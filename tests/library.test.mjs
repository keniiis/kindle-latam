import test from 'node:test';
import assert from 'node:assert/strict';
import { parseKindleClippings } from '../src/lib/parser.ts';
import { mergeClippings, createBackup, readBackup, validateClippings, saveLibrary, LIBRARY_STORAGE_KEY } from '../src/lib/library.ts';

const entry = (text = 'Primera cita', position = 12) => `Libro (Autor)\n- Your Highlight at location ${position} | Added on January 1, 2020 10:00:00 AM\n\n${text}\n==========`;

test('Spanish notes retain type, historical date, paragraphs and CRLF/BOM support', () => {
    const [clip] = parseKindleClippings('\uFEFFLibro (Autor)\r\n- Tu nota en la posición 12 | Añadido el domingo, 25 de octubre de 2020 10:00:00\r\n\r\nUno\r\n\r\nDos\r\n==========');
    assert.equal(clip.type, 'Note');
    assert.equal(clip.date.getFullYear(), 2020);
    assert.equal(clip.date.getMonth(), 9);
    assert.equal(clip.date.getDate(), 25);
    assert.equal(clip.content, 'Uno\n\nDos');
});

test('Bookmarks can have no text; invalid dates are unknown, not today', () => {
    const [clip] = parseKindleClippings('Libro (Autor)\n- Tu marcador en la posición 1 | Añadido el fecha desconocida\n\n==========');
    assert.equal(clip.type, 'Bookmark');
    assert.equal(clip.content, '');
    assert.equal(clip.date.getTime(), 0);
    const [invalid] = parseKindleClippings('Libro (Autor)\n- Tu nota | Añadido el 31 de febrero de 2020 10:00:00\nTexto\n==========');
    assert.equal(invalid.date.getTime(), 0);
});

test('Spanish PM and English dates are parsed', () => {
    const [clip] = parseKindleClippings('Libro (Autor)\n- Tu subrayado | Añadido el 25 de octubre de 2020 01:15:00 p. m.\nTexto\n==========');
    assert.equal(clip.date.getHours(), 13);
    assert.equal(parseKindleClippings(entry())[0].date.getFullYear(), 2020);
});

test('Reimport keeps edited quotes and adds only new entries', () => {
    const [original] = parseKindleClippings(entry());
    const edited = { ...original, title: 'Título editado', content: 'Corrección personal' };
    const manual = { ...original, id: 'manual', meta: 'Manual Entry', sourceKey: undefined, content: 'Manual' };
    const merged = mergeClippings([edited, manual], parseKindleClippings(entry() + '\n' + entry('Segunda', 20) + '\n' + entry()));
    assert.equal(merged.length, 3);
    assert.equal(merged[0].content, 'Corrección personal');
    assert.equal(merged[1].content, 'Manual');
    assert.equal(merged[2].content, 'Segunda');
});

test('Legacy imported quotes without sourceKey deduplicate', () => {
    const [legacy] = parseKindleClippings(entry());
    delete legacy.sourceKey;
    assert.equal(mergeClippings([legacy], parseKindleClippings(entry())).length, 1);
});

test('Loading legacy data preserves its original identity before subsequent edits', () => {
    const [legacy] = parseKindleClippings(entry());
    delete legacy.sourceKey;
    const [loaded] = validateClippings(JSON.parse(JSON.stringify([legacy])));
    loaded.title = 'Título corregido';
    loaded.content = 'Texto corregido';
    assert.equal(mergeClippings([loaded], parseKindleClippings(entry())).length, 1);
});

test('Invalid text never produces entries or changes the existing library', () => {
    const previous = parseKindleClippings(entry());
    assert.deepEqual(parseKindleClippings('No es un archivo Kindle\nEste es un texto cualquiera\nHola'), []);
    assert.deepEqual(mergeClippings(previous, []), previous);
});

test('Backup roundtrip preserves edits, dates, genre and import identity', () => {
    const clips = parseKindleClippings(entry());
    clips[0].genre = 'Ficción';
    clips[0].content = 'Mi edición';
    const restored = readBackup(createBackup(clips));
    assert.deepEqual(restored, clips);
    assert.equal(mergeClippings(restored, parseKindleClippings(entry())).length, 1);
    assert.equal(mergeClippings(restored, restored).length, 1);
});

test('Reject malformed backups, invalid dates, unknown versions and duplicate ids', () => {
    assert.throws(() => readBackup('{'));
    assert.throws(() => readBackup(JSON.stringify({ app: 'Otra app', version: 1, clippings: [] })));
    assert.throws(() => readBackup(JSON.stringify({ app: 'CitandoAndo', version: 2, clippings: [] })));
    assert.throws(() => validateClippings([{ id: 'incompleto' }]));
    const [clip] = parseKindleClippings(entry());
    assert.throws(() => validateClippings([{ ...clip, date: 'ayer' }]));
    assert.throws(() => validateClippings([clip, clip]));
    assert.deepEqual(readBackup(createBackup([])), []);
});

test('Deleting the final quote persists an empty library across reloads', () => {
    const memory = new Map();
    const storage = { setItem: (key, value) => memory.set(key, value) };
    saveLibrary(storage, parseKindleClippings(entry()));
    saveLibrary(storage, []);
    assert.deepEqual(validateClippings(JSON.parse(memory.get(LIBRARY_STORAGE_KEY))), []);
});

test('Storage failures propagate so the interface can warn instead of claiming success', () => {
    assert.throws(() => saveLibrary({ setItem() { throw new Error('QuotaExceeded'); } }, []), /QuotaExceeded/);
});

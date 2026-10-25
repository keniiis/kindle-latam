import test from 'node:test';
import assert from 'node:assert/strict';
import { groupBooks, bookKey, bookTransitionName, renameBook, removeBooks } from '../src/lib/library.ts';
const clip = (id, title, author) => ({ id, title, author, content: id, meta: '', type: 'Highlight', date: new Date(0) });
const clips = [clip('a','El viaje','Ana'), clip('b','El viaje','Luis'), clip('c','El viaje','Ana')];

test('Same title and different authors form distinct books', () => {
    const books = groupBooks(clips);
    assert.equal(books.length, 2);
    assert.deepEqual(books.find(b => b.author === 'Ana').clippings.map(c => c.id), ['a','c']);
    assert.notEqual(bookKey(clips[0]), bookKey(clips[1]));
    assert.notEqual(bookTransitionName(clips[0]), bookTransitionName(clips[1]));
});
test('Composite identities resist delimiter and Unicode collisions', () => {
    assert.notEqual(bookKey({title:'A|B',author:'C'}), bookKey({title:'A',author:'B|C'}));
    assert.notEqual(bookTransitionName({title:'Á',author:'C'}), bookTransitionName({title:'A',author:'C'}));
    assert.equal(groupBooks([clip('1','__proto__','Ana')]).length, 1);
});
test('Renaming affects only the intended author and protects against merging', () => {
    const updated = renameBook(clips, bookKey(clips[0]), 'Otro título', 'Ana');
    assert.equal(updated[1], clips[1]);
    assert.equal(updated[0].title, 'Otro título');
    assert.equal(updated[2].title, 'Otro título');
    assert.throws(() => renameBook(clips, bookKey(clips[0]), 'El viaje', 'Luis'), /Ya existe/);
    assert.throws(() => renameBook(clips, bookKey(clips[0]), ' ', 'Ana'));
});
test('Deleting one book leaves the other author intact', () => {
    assert.deepEqual(removeBooks(clips, new Set([bookKey(clips[0])])), [clips[1]]);
    assert.deepEqual(removeBooks(clips, new Set(clips.map(bookKey))), []);
});

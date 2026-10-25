import test from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { buildBookPDF } from '../src/lib/pdf.ts';

test('PDF includes all quotes and paginates a quote longer than a page', () => {
    const clippings = Array.from({length: 12}, (_, i) => ({id:String(i), title:'Lecturas compartidas', author:'Ana Muñoz', type:'Highlight', meta:'', date:new Date(0), content:`CITA_${i + 1}: La imaginación también necesita espacio para respirar. Los árboles y la música acompañan esta lectura.`}));
    clippings[4].content = 'INICIO_LARGO\n' + Array.from({length:110}, (_, i) => `Línea ${i + 1}: Una cita extensa debe continuar sin perder palabras.`).join('\n') + '\nFIN_LARGO';
    clippings.push({...clippings[0], id:'marcador',type:'Bookmark',content:''});
    const doc = buildBookPDF({title:'Lecturas compartidas: un cuaderno de citas',author:'Ana Muñoz', clippings});
    assert.ok(doc.getNumberOfPages() >= 4);
    const raw = doc.output();
    for (const marker of ['CITA_1:', 'CITA_4:', 'CITA_6:', 'CITA_12:', 'INICIO_LARGO', 'FIN_LARGO', 'Marcador sin texto']) assert.ok(raw.includes(marker), marker);
    if (process.env.PDF_QA_FILE) writeFileSync(process.env.PDF_QA_FILE, Buffer.from(doc.output('arraybuffer')));
});

test('Long titles and authors paginate without dropping trailing text', () => {
    const doc = buildBookPDF({title:'Título largo '.repeat(200) + 'FIN_TITULO', author:'Autor '.repeat(200) + 'FIN_AUTOR', clippings:[]});
    assert.ok(doc.getNumberOfPages() > 1);
    assert.ok(doc.output().includes('FIN_TITULO'));
    assert.ok(doc.output().includes('FIN_AUTOR'));
});

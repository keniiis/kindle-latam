// Comprueba que los artículos del blog estén bien formados antes de publicarlos.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { blogPosts } from '../src/data/blogData.ts';

const CATEGORIES = ['Libros', 'Guías', 'Tutoriales', 'Tendencias'];
const slugs = new Set(blogPosts.map((p) => p.slug));

test('Cada artículo tiene un slug único y válido para la URL', () => {
    assert.equal(slugs.size, blogPosts.length, 'hay slugs repetidos');
    for (const p of blogPosts) assert.match(p.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, p.slug);
});

test('Título, descripción y fecha están completos', () => {
    for (const p of blogPosts) {
        assert.ok(p.title.trim().length > 10, `${p.slug}: título vacío o muy corto`);
        assert.ok(p.description.trim().length >= 50, `${p.slug}: descripción muy corta para Google`);
        assert.match(p.date, /^\d{4}-\d{2}-\d{2}$/, `${p.slug}: fecha con formato inválido`);
        assert.ok(!Number.isNaN(Date.parse(p.date)), `${p.slug}: fecha inexistente`);
        assert.match(p.readTime, /^\d+ min/, `${p.slug}: tiempo de lectura inválido`);
    }
});

test('La primera etiqueta es una categoría del blog', () => {
    for (const p of blogPosts) assert.ok(CATEGORIES.includes(p.tags[0]), `${p.slug}: categoría «${p.tags[0]}»`);
});

test('Las portadas locales existen en public/', () => {
    for (const p of blogPosts) {
        if (p.coverImage?.startsWith('/')) assert.ok(existsSync(`public${p.coverImage}`), `${p.slug}: falta ${p.coverImage}`);
    }
});

test('Los enlaces internos a otros artículos apuntan a artículos existentes', () => {
    for (const p of blogPosts) {
        for (const [, slug] of p.content.matchAll(/href="\/blog\/([^"#?]+)"/g)) {
            assert.ok(slugs.has(slug), `${p.slug}: enlace roto a /blog/${slug}`);
        }
    }
});

test('Las etiquetas HTML principales del contenido están balanceadas', () => {
    for (const p of blogPosts) {
        for (const tag of ['p', 'h2', 'h3', 'ul', 'ol', 'li', 'a', 'strong', 'pre', 'code']) {
            const open = (p.content.match(new RegExp(`<${tag}(\\s[^>]*)?>`, 'g')) || []).length;
            const close = (p.content.match(new RegExp(`</${tag}>`, 'g')) || []).length;
            assert.equal(open, close, `${p.slug}: <${tag}> abiertas ${open}, cerradas ${close}`);
        }
    }
});

export interface Quote {
  id: string;
  text: string;
  book: string;
  author: string;
  page?: string;
  location?: string;
  date?: string;
  kind: "highlight" | "note" | "bookmark";
  favorite: boolean;
  source: "kindle" | "manual" | "sample";
  createdAt: number;
}

export interface TemplateDef {
  id: string;
  name: string;
  desc: string;
  bg: string;
  bg2?: string;
  gradient?: boolean;
  /** Tercer color opcional del degradado. */
  bg3?: string;
  text: string;
  muted: string;
  accent: string;
  font: "serif" | "sans" | "mono" | "display";
  ornament: "quote" | "line" | "asterisk" | "frame" | "none";
  dark?: boolean;
}

export type FormatId = "square" | "story" | "wide";

export interface FormatDef {
  id: FormatId;
  name: string;
  dims: string;
  ratio: string;
  w: number;
  h: number;
  icon: string;
}

export const FORMATS: FormatDef[] = [
  { id: "square", name: "Post cuadrado", dims: "1080 × 1080", ratio: "aspect-square", w: 1080, h: 1080, icon: "square" },
  { id: "story", name: "Historia / Reel", dims: "1080 × 1920", ratio: "aspect-[9/16]", w: 1080, h: 1920, icon: "story" },
  { id: "wide", name: "Portada X / Banner", dims: "1600 × 900", ratio: "aspect-video", w: 1600, h: 900, icon: "wide" },
];

export const TEMPLATES: TemplateDef[] = [
  { id: "verde", name: "Verde", desc: "El verde de la app", bg: "#3F5B3A", text: "#FFFFFF", muted: "rgba(255,255,255,0.66)", accent: "#A9C79A", font: "sans", ornament: "quote", dark: true },
  { id: "negro", name: "Negro", desc: "Sobrio, para que la frase brille", bg: "#222222", text: "#FFFFFF", muted: "rgba(255,255,255,0.6)", accent: "#A9C79A", font: "sans", ornament: "quote", dark: true },
  { id: "blanco", name: "Blanco", desc: "Limpio y minimal", bg: "#FFFFFF", text: "#1E1E1E", muted: "rgba(30,30,30,0.55)", accent: "#3F5B3A", font: "sans", ornament: "quote" },
  { id: "papel", name: "Papel", desc: "Crema cálido, tipografía de libro", bg: "#F3EBDD", text: "#2B1D16", muted: "rgba(43,29,22,0.58)", accent: "#C9A14A", font: "serif", ornament: "quote" },
  { id: "arrugado", name: "Papel arrugado", desc: "Textura de papel, como una hoja guardada", bg: "#E5E5E5", bg2: "#D3D3D1", gradient: true, text: "#1E1E1E", muted: "rgba(30,30,30,0.55)", accent: "#1E1E1E", font: "serif", ornament: "quote" },
  { id: "melocoton", name: "Melocotón", desc: "Degradado cálido y suave", bg: "#FFE6D6", bg2: "#F7B49B", gradient: true, text: "#4A2417", muted: "rgba(74,36,23,0.58)", accent: "#C2573A", font: "serif", ornament: "quote" },
  { id: "lila", name: "Lila", desc: "Pastel lavanda, tipografía redonda", bg: "#EEE4FC", bg2: "#C6B0F0", gradient: true, text: "#2E1F4D", muted: "rgba(46,31,77,0.58)", accent: "#6B4FBB", font: "sans", ornament: "quote" },
  { id: "menta", name: "Menta", desc: "Verde fresco y claro", bg: "#E1F6EA", bg2: "#A5DFC1", gradient: true, text: "#17402E", muted: "rgba(23,64,46,0.58)", accent: "#2F7D58", font: "sans", ornament: "quote" },
  { id: "atardecer", name: "Atardecer", desc: "Naranja, rosa y violeta", bg: "#FFB347", bg2: "#FF5E7E", bg3: "#8E4DCB", gradient: true, text: "#FFFFFF", muted: "rgba(255,255,255,0.75)", accent: "#FFF3D6", font: "sans", ornament: "quote", dark: true },
  { id: "oceano", name: "Océano", desc: "Azul intenso a turquesa", bg: "#2B5BFF", bg2: "#18B7D9", gradient: true, text: "#FFFFFF", muted: "rgba(255,255,255,0.75)", accent: "#D6F4FF", font: "sans", ornament: "quote", dark: true },
];

/** Fondo CSS de un estilo: color liso o degradado. */
export function backgroundOf(t: TemplateDef): string {
  if (!t.gradient) return t.bg;
  return `linear-gradient(140deg, ${[t.bg, t.bg2, t.bg3].filter(Boolean).join(", ")})`;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
}

/** Parser robusto de My Clippings.txt */
export function parseClippings(raw: string): Quote[] {
  const normalized = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const blocks = normalized.split(/^==========\s*$/m);
  const out: Quote[] = [];

  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trimEnd());
    // elimina líneas vacías al inicio/fin
    while (lines.length && lines[0].trim() === "") lines.shift();
    while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();
    if (lines.length < 2) continue;

    const titleLine = lines[0].trim();
    if (!titleLine || titleLine.startsWith("- Your") || titleLine.startsWith("- Tu")) continue;

    const metaLine = lines[1]?.trim() ?? "";
    const contentLines = lines.slice(2).join("\n").trim();
    // Si no hay contenido y es bookmark, lo saltamos
    if (!contentLines) continue;

    // Título y autor: "Título (Autor)" — el autor es el último paréntesis
    let book = titleLine;
    let author = "Autor desconocido";
    const m = titleLine.match(/^(.*)\s\(([^()]+)\)\s*$/);
    if (m) {
      book = m[1].trim();
      author = m[2].trim();
    }
    // Limpia BOM y caracteres raros
    book = book.replace(/^\uFEFF/, "").trim();
    if (book.length > 120) book = book.slice(0, 120) + "…";

    let kind: Quote["kind"] = "highlight";
    const metaLow = metaLine.toLowerCase();
    if (metaLow.includes("note") || metaLow.includes("nota")) kind = "note";
    else if (metaLow.includes("bookmark") || metaLow.includes("marcador")) kind = "bookmark";

    let page: string | undefined;
    let location: string | undefined;
    let date: string | undefined;

    const pageM = metaLine.match(/[Pp][áa]g(?:ina)?\.?\s*(\d+(?:-\d+)?)/) || metaLine.match(/page\s*(\d+(?:-\d+)?)/i);
    if (pageM) page = pageM[1];
    const locM = metaLine.match(/(?:posici[óo]n|position|location)\s*([\d-]+)/i);
    if (locM) location = locM[1];
    const dateM = metaLine.match(/Added on\s*(.+)$/i) || metaLine.match(/Añadido el\s*(.+)$/i) || metaLine.match(/\|\s*([^|]+)$/);
    if (dateM) date = dateM[1].trim();

    // Limpia texto: quita guiones sueltos, colapsa espacios excesivos pero respeta párrafos
    let text = contentLines.replace(/^\uFEFF/, "").trim();
    if (text.length < 3) continue;
    if (text.length > 1200) text = text.slice(0, 1200) + "…";

    out.push({
      id: uid(),
      text,
      book: book || "Sin título",
      author,
      page,
      location,
      date,
      kind,
      favorite: false,
      source: "kindle",
      createdAt: Date.now() - out.length,
    });
  }
  return out;
}

export function groupByBook(quotes: Quote[]) {
  const map = new Map<string, { book: string; author: string; quotes: Quote[] }>();
  for (const q of quotes) {
    const key = `${q.book}|||${q.author}`;
    if (!map.has(key)) map.set(key, { book: q.book, author: q.author, quotes: [] });
    map.get(key)!.quotes.push(q);
  }
  return [...map.values()].sort((a, b) => b.quotes.length - a.quotes.length);
}

export const SAMPLE_CLIPPINGS = `Don Quijote de la Mancha (Miguel de Cervantes)
- Your Highlight on page 145 | position 2300-2305 | Added on Tuesday, March 12, 2024 9:55:00 PM

La libertad, Sancho, es uno de los más preciosos dones que a los hombres dieron los cielos.
==========
Cien años de soledad (Gabriel García Márquez)
- Your Highlight on page 34 | position 512-515 | Added on Monday, March 4, 2024 9:12:00 PM

Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo.
==========
El amor en los tiempos del cólera (Gabriel García Márquez)
- Your Highlight on page 112 | position 1780-1783 | Added on Tuesday, March 5, 2024 8:02:11 PM

Era inevitable: el olor de las almendras amargas le recordaba siempre el destino de los amores contrariados.
==========
Ficciones (Jorge Luis Borges)
- Your Highlight on page 45 | position 700-703 | Added on Wednesday, March 6, 2024 10:44:00 PM

El universo (que otros llaman la Biblioteca) se compone de un número indefinido, y tal vez infinito, de galerías hexagonales.
==========
Rayuela (Julio Cortázar)
- Your Highlight on page 78 | position 1204-1207 | Added on Thursday, March 7, 2024 7:31:00 PM

Andábamos sin buscarnos pero sabiendo que andábamos para encontrarnos.
==========
La casa de los espíritus (Isabel Allende)
- Your Highlight on page 201 | position 3200-3204 | Added on Friday, March 8, 2024 9:00:00 PM

La memoria es frágil y el transcurso de una vida es muy breve y sucede todo tan deprisa, que no alcanzamos a ver la relación entre los acontecimientos.
==========
Pedro Páramo (Juan Rulfo)
- Your Highlight on page 23 | position 340-343 | Added on Saturday, March 9, 2024 6:20:00 PM

Vine a Comala porque me dijeron que acá vivía mi padre, un tal Pedro Páramo.
==========
El túnel (Ernesto Sabato)
- Your Highlight on page 89 | position 1400-1402 | Added on Sunday, March 10, 2024 11:15:00 PM

Bastará decir que soy Juan Pablo Castel, el pintor que mató a María Iribarne.
==========
Como agua para chocolate (Laura Esquivel)
- Your Highlight on page 56 | position 890-893 | Added on Monday, March 11, 2024 8:40:00 PM

La cocina es el lugar donde se guardan los secretos más íntimos de una familia.
==========
Los detectives salvajes (Roberto Bolaño)
- Your Highlight on page 145 | position 2300-2305 | Added on Tuesday, March 12, 2024 9:55:00 PM

Todo lo que empieza como comedia acaba como tragedia.
==========
La sombra del viento (Carlos Ruiz Zafón)
- Your Highlight on page 12 | position 180-184 | Added on Wednesday, March 13, 2024 7:07:00 PM

Los libros son espejos: sólo se ve en ellos lo que uno ya lleva dentro.
==========
Veinte poemas de amor (Pablo Neruda)
- Your Highlight on page 8 | position 120-123 | Added on Thursday, March 14, 2024 10:10:00 PM

Es tan corto el amor, y es tan largo el olvido.
==========
El Aleph (Jorge Luis Borges)
- Your Highlight on page 67 | position 1010-1014 | Added on Friday, March 15, 2024 8:25:00 PM

Vi el Aleph, desde todos los puntos, vi en el Aleph la tierra, y en la tierra otra vez el Aleph y en el Aleph la tierra.
==========
`;

export function sampleQuotes(): Quote[] {
  return parseClippings(SAMPLE_CLIPPINGS).map((q) => ({ ...q, source: "sample" as const }));
}

export function statsOf(quotes: Quote[]) {
  const books = new Set(quotes.map((q) => q.book)).size;
  const authors = new Set(quotes.map((q) => q.author)).size;
  const words = quotes.reduce((a, q) => a + q.text.split(/\s+/).length, 0);
  const favs = quotes.filter((q) => q.favorite).length;
  return { total: quotes.length, books, authors, words, favs };
}

export function fontFor(t: TemplateDef): string {
  switch (t.font) {
    case "serif":
      return `"Fraunces", Georgia, serif`;
    case "display":
      return `"Instrument Serif", Georgia, serif`;
    case "mono":
      return `"JetBrains Mono", monospace`;
    default:
      return `"Space Grotesk", system-ui, sans-serif`;
  }
}

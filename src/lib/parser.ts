export interface Clipping {
    id: string;
    title: string;
    author: string;
    content: string;
    meta: string;
    type: "Highlight" | "Note" | "Bookmark";
    date: Date;
}

export function parseKindleClippings(raw: string): Clipping[] {
    const defaults: Clipping = {
        id: "",
        title: "",
        author: "",
        content: "",
        meta: "",
        type: "Highlight",
        date: new Date(),
    };

    return raw
        .split("==========")
        .map((section) => {
            const lines = section.trim().split("\n").filter((l) => l.trim() !== "");
            if (lines.length < 3) return null;

            const titleLine = lines[0].trim();
            const metaLine = lines[1].trim();
            const content = lines.slice(2).join("\n").trim();

            // Basic regex to extract title and author
            // Usually "Title (Author)"
            const authorMatch = titleLine.match(/\(([^)]+)\)$/);
            const author = authorMatch ? authorMatch[1] : "Unknown Author";
            const title = authorMatch
                ? titleLine.replace(authorMatch[0], "").trim()
                : titleLine;

            // Extract type and date from meta line
            // Example: "- Your Highlight at location 123-124 | Added on Sunday, January 1, 2023 12:00:00 PM"
            let type: Clipping["type"] = "Highlight";
            if (metaLine.includes("Note")) type = "Note";
            if (metaLine.includes("Bookmark")) type = "Bookmark";

            // Simple date parsing attempt (this can be brittle due to locales)
            // Extracting what's after "Added on " or "Añadido el "
            let date = new Date();
            const dateMatch = metaLine.match(/(?:Added on|Añadido el) (.+)$/i);
            if (dateMatch) {
                const parsedDate = new Date(dateMatch[1]);
                if (!isNaN(parsedDate.getTime())) {
                    date = parsedDate;
                }
            }

            return {
                id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2), // simple fallback
                title,
                author,
                content,
                meta: metaLine,
                type,
                date,
            };
        })
        .filter((clip): clip is Clipping => clip !== null); // The key fix: Type predicate
}
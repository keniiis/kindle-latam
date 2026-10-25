This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Biblioteca y respaldos

- Los libros se distinguen por título y autor. Editar o eliminar uno no modifica otros autores con el mismo título; cambiarlo a una combinación ya existente se rechaza para evitar mezclas accidentales.
- El PDF incluye todas las anotaciones, texto seleccionable y numeración de páginas. Las citas extensas continúan en las páginas siguientes. Si la portada no responde, se exporta el texto igualmente.

- Importar `My Clippings.txt` añade anotaciones sin reemplazar la biblioteca. Reimportar una misma entrada conserva su versión existente, incluidas las ediciones.
- **Descargar respaldo** exporta citas, títulos, autores, fechas, géneros e identidad de importación en JSON. Las portadas en caché y las preferencias visuales no se incluyen.
- **Restaurar respaldo** valida el archivo completo y pide confirmar antes de combinarlo con la biblioteca. No reemplaza las citas existentes ni elimina datos.
- Ambos botones están disponibles también con la biblioteca vacía. El límite por archivo es 20 MB.
- Si falla el guardado, descarga un respaldo antes de cerrar. Si la biblioteca guardada es ilegible, la aplicación bloquea modificaciones y permite descargar los datos originales para recuperarlos.
- Las fechas no reconocidas se representan internamente con el instante Unix cero; no se reemplazan por la fecha de importación.

### Pruebas de datos

Con Node.js 22.6 o posterior, ejecuta `node --experimental-strip-types --test tests/*.test.mjs` (también disponible como `pnpm test`). Comprueba importación en español/inglés, combinación sin duplicados, conservación de ediciones, validación de respaldos y persistencia de una biblioteca vacía.

## Ejecutar el proyecto

Usa Node.js 24 LTS y pnpm 12.15.0. El archivo de versiones del proyecto es `pnpm-lock.yaml`; no mezcles instalaciones con npm o Yarn.

```bash
pnpm install --frozen-lockfile
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

La compilación descarga las fuentes de Google usadas por `next/font`; requiere conexión a Internet.

### Mantenimiento de dependencias

Ejecuta `pnpm audit`, `pnpm test` y `pnpm build` después de actualizar dependencias. Las excepciones de versión en `pnpm-workspace.yaml` sustituyen dependencias indirectas vulnerables de las herramientas PWA y CSS. No desactivan la comprobación de seguridad ni el período mínimo de antigüedad de pnpm. Revisa si siguen siendo necesarias al actualizar esas herramientas.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

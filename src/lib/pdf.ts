import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

/**
 * pdf.js runs its parser in a web worker. Resolving the worker through
 * `import.meta.url` lets Vite fingerprint and bundle it, rather than fetching
 * it from a CDN at runtime (which a strict CSP would block).
 *
 * Imported only by the lazily-loaded PDF components, so pdf.js stays out of
 * the main bundle.
 */
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export { Document, Page } from 'react-pdf';

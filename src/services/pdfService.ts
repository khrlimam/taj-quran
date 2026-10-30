import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker to use the local static public worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export interface RenderResult {
  width: number;
  height: number;
}

class PdfService {
  private pdfDoc: pdfjsLib.PDFDocumentProxy | null = null;
  private loadingPromise: Promise<pdfjsLib.PDFDocumentProxy> | null = null;
  private activeRenderTasks = new Map<HTMLCanvasElement, pdfjsLib.RenderTask>();
  private pageCache = new Map<number, pdfjsLib.PDFPageProxy>();

  public async getDocument(): Promise<pdfjsLib.PDFDocumentProxy> {
    if (this.pdfDoc) return this.pdfDoc;

    if (!this.loadingPromise) {
      this.loadingPromise = (async () => {
        const loadingTask = pdfjsLib.getDocument({
          url: '/taj_quran.pdf',
          standardFontDataUrl: '/standard_fonts/',
          disableRange: false,
          disableStream: false,
        });
        const doc = await loadingTask.promise;
        this.pdfDoc = doc;
        return doc;
      })();
    }

    return this.loadingPromise;
  }

  public async getPage(pageNumber: number): Promise<pdfjsLib.PDFPageProxy> {
    if (this.pageCache.has(pageNumber)) {
      return this.pageCache.get(pageNumber)!;
    }

    const doc = await this.getDocument();
    const safePageNum = Math.min(Math.max(1, pageNumber), doc.numPages);
    const page = await doc.getPage(safePageNum);
    
    // Keep max 20 pages in cache
    if (this.pageCache.size > 20) {
      const firstKey = this.pageCache.keys().next().value;
      if (firstKey !== undefined) {
        this.pageCache.delete(firstKey);
      }
    }
    this.pageCache.set(safePageNum, page);
    return page;
  }

  public async renderPageToCanvas(
    pageNumber: number,
    canvas: HTMLCanvasElement,
    maxWidth: number,
    maxHeight: number,
    nightMode: boolean = false
  ): Promise<RenderResult> {
    // Cancel existing render on this canvas if any
    const existingTask = this.activeRenderTasks.get(canvas);
    if (existingTask) {
      try {
        existingTask.cancel();
      } catch {
        // ignore cancellation error
      }
      this.activeRenderTasks.delete(canvas);
    }

    const page = await this.getPage(pageNumber);

    // Initial unscaled viewport to get natural aspect ratio
    const unscaledViewport = page.getViewport({ scale: 1.0 });
    const naturalWidth = unscaledViewport.width;
    const naturalHeight = unscaledViewport.height;

    // Calculate best fit scale
    const scaleX = maxWidth / naturalWidth;
    const scaleY = maxHeight / naturalHeight;
    const baseScale = Math.min(scaleX, scaleY);

    // Account for high-DPI displays (retina screens)
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const renderScale = baseScale * dpr;

    const viewport = page.getViewport({ scale: renderScale });

    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Could not get 2d context');

    // Set canvas internal resolution to high-DPI
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    // CSS displayed size
    const cssWidth = Math.floor(viewport.width / dpr);
    const cssHeight = Math.floor(viewport.height / dpr);
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    // Clear background
    context.fillStyle = nightMode ? '#1e293b' : '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      background: nightMode ? 'rgba(30,41,59,1)' : 'rgba(255,255,255,1)'
    };

    const renderTask = page.render(renderContext);
    this.activeRenderTasks.set(canvas, renderTask);

    try {
      await renderTask.promise;
      this.activeRenderTasks.delete(canvas);

      // Preload next/prev pages
      this.preloadPage(pageNumber - 1);
      this.preloadPage(pageNumber + 1);
      this.preloadPage(pageNumber + 2);

      return { width: cssWidth, height: cssHeight };
    } catch (err: any) {
      this.activeRenderTasks.delete(canvas);
      if (err?.name === 'RenderingCancelledException') {
        return { width: cssWidth, height: cssHeight };
      }
      throw err;
    }
  }

  private async preloadPage(pageNumber: number) {
    if (pageNumber < 1 || (this.pdfDoc && pageNumber > this.pdfDoc.numPages)) return;
    try {
      await this.getPage(pageNumber);
    } catch {
      // ignore
    }
  }
}

export const pdfService = new PdfService();

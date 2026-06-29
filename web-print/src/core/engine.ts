import { fabric } from 'fabric';

/**
 * CanvasManager: The imperative engine for web-print.
 * Handles all Fabric.js operations, object creation, and exports.
 */
export class CanvasManager {
  public canvas: fabric.Canvas;

  constructor(element: HTMLCanvasElement) {
    // 1. Initialize the Fabric Canvas
    this.canvas = new fabric.Canvas(element, {
      width: 600,
      height: 600,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true, // Prevents objects from jumping to front on click
    });

    // 2. Configure Global Object Styling (Institutional Blue Theme)
    this.setupGlobalStyles();
  }

  /**
   * Sets up professional UI handles for all objects
   */
  private setupGlobalStyles() {
    fabric.Object.prototype.set({
      transparentCorners: false,
      cornerColor: '#3b82f6',     // Blue-600
      cornerStyle: 'circle',
      borderColor: '#3b82f6',
      cornerSize: 10,
      borderScaleFactor: 2,
      padding: 5,
    });
  }

  /**
   * Adds a new Textbox to the canvas
   */
  public addText(content: string = 'Double-click to edit') {
    const text = new fabric.Textbox(content, {
      left: 100,
      top: 100,
      width: 400,
      fontSize: 40,
      fontFamily: 'Inter, system-ui, sans-serif',
      fill: '#1e293b',            // slate-800
      textAlign: 'left',
      // Institutional constraint: Prevent vertical stretching to save typography
      lockScalingY: true, 
    });

    this.canvas.add(text);
    this.canvas.setActiveObject(text);
    this.canvas.renderAll();
  }

  /**
   * Updates the background color of the entire canvas
   */
  public setBackgroundColor(color: string) {
    this.canvas.setBackgroundColor(color, () => {
      this.canvas.renderAll();
    });
  }

  /**
   * Exports the current canvas as a high-resolution PNG
   */
  public exportPNG() {
    // 1. Deselect objects so handles don't show in the export
    this.canvas.discardActiveObject();
    this.canvas.renderAll();

    // 2. Generate high-res image (multiplier: 2 = 1200x1200px)
    const dataURL = this.canvas.toDataURL({
      format: 'png',
      multiplier: 2,
      enableRetinaScaling: true,
    });

    // 3. Trigger Browser Download
    const link = document.createElement('a');
    link.download = `web-print-design-${Date.now()}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Helper to clean up the canvas when the component is destroyed
   */
  public dispose() {
    this.canvas.dispose();
  }
}
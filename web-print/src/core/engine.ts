import { fabric } from 'fabric';

export class CanvasManager {
  public canvas: fabric.Canvas;

  constructor(canvasElement: HTMLCanvasElement, width: number, height: number) {
    this.canvas = new fabric.Canvas(canvasElement, {
      width,
      height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    });
    this.setupControls();
  }

  private setupControls() {
    fabric.Object.prototype.set({
      transparentCorners: false,
      cornerColor: '#3b82f6',
      cornerStyle: 'circle',
      borderColor: '#3b82f6',
      cornerSize: 10,
    });
  }

  public addText(content: string = 'New Text') {
    const text = new fabric.Textbox(content, {
      left: 100,
      top: 100,
      width: 400,
      fontSize: 40,
      fontFamily: 'Inter',
      fill: '#1a1a1a',
    });
    this.canvas.add(text);
    this.canvas.setActiveObject(text);
    this.canvas.renderAll();
  }

  public addImage(url: string) {
    fabric.Image.fromURL(url, (img) => {
      img.scaleToWidth(300);
      this.canvas.add(img);
      this.canvas.centerObject(img);
      this.canvas.setActiveObject(img);
      this.canvas.renderAll();
    });
  }

  public exportPNG() {
    const dataURL = this.canvas.toDataURL({ format: 'png', multiplier: 2 });
    const link = document.createElement('a');
    link.download = `web-print-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  }
}
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { CanvasManager } from './engine';

/**
 * web-print: Batch Processing Engine
 * Handles Excel parsing and ZIP generation
 */
export class BatchProcessor {
  private manager: CanvasManager;

  constructor(manager: CanvasManager) {
    this.manager = manager;
  }

  public async processExcel(file: File, onProgress: (p: number) => void) {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(worksheet) as any[];

          const zip = new JSZip();
          const folder = zip.folder("web_print_exports");

          // Loop through Excel rows
          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            
            // Map Excel data to Canvas objects using Variable Tags
            this.manager.canvas.getObjects().forEach((obj: any) => {
              if (obj.dataTag && row[obj.dataTag] !== undefined) {
                obj.set('text', String(row[obj.dataTag]));
              }
            });

            this.manager.canvas.renderAll();

            // Capture high-res snapshot
            const dataURL = this.manager.canvas.toDataURL({ 
                format: 'png', 
                multiplier: 2 
            });
            
            const base64Data = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
            folder?.file(`export_${i + 1}.png`, base64Data, { base64: true });
            
            // Update UI progress
            onProgress(Math.round(((i + 1) / rows.length) * 100));
          }

          // Generate and download ZIP
          const content = await zip.generateAsync({ type: "blob" });
          saveAs(content, `web_print_batch_${Date.now()}.zip`);
          resolve();
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  }
}
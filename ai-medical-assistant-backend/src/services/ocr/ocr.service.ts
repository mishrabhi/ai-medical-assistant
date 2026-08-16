import fs from "fs/promises";
import path from "path";
import { PDFParse } from "pdf-parse";
import { createWorker } from "tesseract.js";
import { ApiError } from "../../utils/ApiError";

class OCRService {
  async extractText(filePath: string, mimeType: string) {
    const absolutePath = path.resolve(filePath);

    if (mimeType === "application/pdf") {
      return this.extractPdfText(absolutePath);
    }

    if (
      mimeType === "image/jpeg" ||
      mimeType === "image/jpg" ||
      mimeType === "image/png"
    ) {
      return this.extractImageText(absolutePath);
    }

    throw new ApiError(400, "Unsupported file type for OCR.");
  }

  private async extractPdfText(filePath: string) {
    const buffer = await fs.readFile(filePath);

    const parser = new PDFParse({
      data: buffer,
    });

    try {
      const result = await parser.getText();

      return result.text.trim();
    } finally {
      await parser.destroy();
    }
  }

  private async extractImageText(filePath: string) {
    const worker = await createWorker("eng");

    try {
      const {
        data: { text },
      } = await worker.recognize(filePath);

      return text.trim();
    } finally {
      await worker.terminate();
    }
  }
}

export const ocrService = new OCRService();

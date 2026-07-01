import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import path from "path";
import { pathToFileURL } from "url";

// Explicitly set the pdf.worker.mjs location for Next.js server runtime
try {
  const workerPath = path.join(
    process.cwd(),
    "node_modules",
    "pdfjs-dist",
    "legacy",
    "build",
    "pdf.worker.mjs"
  );
  // Convert standard file path to a valid file:// URL for ESM loader support on Windows
  const workerUrl = pathToFileURL(workerPath).toString();
  PDFParse.setWorker(workerUrl);
  console.log("PDF worker URL configured successfully:", workerUrl);
} catch (err) {
  console.error("Failed to set PDF worker path:", err);
}

export async function parsePdf(buffer: Buffer): Promise<string> {
  try {
    // Instantiate the PDFParse class using the Uint8Array buffer data
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const textResult = await parser.getText();
    await parser.destroy(); // Clean up parser resources
    return textResult.text || "";
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to extract text from PDF resume.");
  }
}

export async function parseDocx(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  } catch (error) {
    console.error("Error parsing DOCX:", error);
    throw new Error("Failed to extract text from DOCX resume.");
  }
}

/**
 * Main parser coordinator that routes parsing tasks based on MIME type.
 */
export async function parseResume(buffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === "application/pdf") {
    return await parsePdf(buffer);
  } else if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword"
  ) {
    return await parseDocx(buffer);
  } else {
    throw new Error("Unsupported file type. Only PDF and DOCX formats are supported.");
  }
}

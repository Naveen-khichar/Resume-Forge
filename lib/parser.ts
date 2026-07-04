import { getDocumentProxy, extractText } from "unpdf";
import mammoth from "mammoth";


export async function parsePdf(buffer: Buffer): Promise<string> {
  try {
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    return text || "";
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
 * Main parser coordinator that routes parsing tasks based on MIME type or file extension.
 */
export async function parseResume(buffer: Buffer, mimeType: string, fileName?: string): Promise<string> {
  const isPdf = 
    mimeType === "application/pdf" || 
    (fileName && fileName.toLowerCase().endsWith(".pdf"));

  const isDocx = 
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword" ||
    (fileName && (fileName.toLowerCase().endsWith(".docx") || fileName.toLowerCase().endsWith(".doc")));

  if (isPdf) {
    return await parsePdf(buffer);
  } else if (isDocx) {
    return await parseDocx(buffer);
  } else {
    throw new Error("Unsupported file type. Only PDF and DOCX formats are supported.");
  }
}

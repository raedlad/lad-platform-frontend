import { Contract } from "../types/contract";
import { 
  generateContractPDF as generatePDFMake, 
  downloadContractPDF as downloadPDFMake,
  previewContractPDF as previewPDFMake 
} from "../services/pdf-simple.service";

/**
 * Enhanced PDF Generator using pdfMake with Arabic Support
 * Replaces the old jsPDF implementation with proper Arabic text rendering
 */

export const generateContractPDF = async (contract: Contract): Promise<Blob> => {
  console.log("=".repeat(50));
  console.log("🚀 PDF GENERATION STARTED (pdfMake) - FUNCTION CALLED");
  console.log("=".repeat(50));
  console.log("📋 Contract ID:", contract.id);
  console.log("📋 Contract data:", contract);
  console.log("⏰ Timestamp:", new Date().toISOString());
  
  console.log("🔔 PDF Generation Started! (pdfMake with Arabic support)");
  
  try {
    // Use the new pdfMake service
    const blob = await generatePDFMake(contract);
    
    console.log("🎉 MAIN PATH: PDF Generated Successfully with pdfMake!");
    console.log("✅ PDF Blob created, size:", blob.size, "bytes");
    
    return blob;
  } catch (error) {
    console.error("❌ PDF Generation Error:", error);
    throw error;
  }
};

export const downloadContractPDF = async (
  contract: Contract,
  filename?: string
): Promise<void> => {
  console.log("📥 Starting PDF download using pdfMake service...");
  
  try {
    await downloadPDFMake(contract, filename);
    console.log("✅ PDF download completed successfully!");
  } catch (error) {
    console.error("❌ PDF download failed:", error);
    throw error;
  }
};

export const previewContractPDF = async (contract: Contract): Promise<string> => {
  console.log("👀 Generating PDF preview using pdfMake service...");
  
  try {
    const previewUrl = await previewPDFMake(contract);
    console.log("✅ PDF preview URL generated:", previewUrl);
    return previewUrl;
  } catch (error) {
    console.error("❌ PDF preview generation failed:", error);
    throw error;
  }
};

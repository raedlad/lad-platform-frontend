import * as pdfMake from "pdfmake/build/pdfmake";
import { TDocumentDefinitions, Content } from "pdfmake/interfaces";
import { Contract } from "../types/contract";

// Initialize pdfMake with default fonts - safer approach for Next.js
let pdfMakeInitialized = false;

const initializePdfMake = async () => {
  if (pdfMakeInitialized) return;

  try {
    // Dynamic import to avoid SSR issues
    const pdfFonts = await import("pdfmake/build/vfs_fonts");

    // Check if vfs exists in different possible locations
    if (
      pdfFonts &&
      (pdfFonts as any).pdfMake &&
      (pdfFonts as any).pdfMake.vfs
    ) {
      (pdfMake as any).vfs = (pdfFonts as any).pdfMake.vfs;
    } else if (pdfFonts && (pdfFonts as any).vfs) {
      (pdfMake as any).vfs = (pdfFonts as any).vfs;
    } else {
      console.warn("⚠️ pdfMake fonts not found, using minimal font setup");
      // Minimal font setup as fallback
      (pdfMake as any).vfs = {};
    }

    // Configure Arabic fonts after VFS is set
    configureArabicFonts();

    pdfMakeInitialized = true;
    console.log("✅ pdfMake initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize pdfMake fonts:", error);
    // Set minimal vfs to prevent errors
    (pdfMake as any).vfs = {};
    pdfMakeInitialized = true;
  }
};

// Arabic font configuration (Tajawal font base64 - you'll need to add the actual base64 data)
const TajawalRegularBase64 = `
// TODO: Add Tajawal-Regular.ttf base64 data here
// You can get this by converting the TTF file to base64
`;

// Configure fonts for Arabic support (will be set during initialization)
const configureArabicFonts = () => {
  try {
    // Use Object.defineProperty to safely set fonts
    if (!(pdfMake as any).fonts) {
      Object.defineProperty(pdfMake, 'fonts', {
        value: {},
        writable: true,
        configurable: true
      });
    }
    
    // Always configure Tajawal as the primary font
    (pdfMake as any).fonts.Tajawal = {
      normal: "Tajawal-Regular.ttf",
      bold: "Tajawal-Regular.ttf",
      italics: "Tajawal-Regular.ttf",
      bolditalics: "Tajawal-Regular.ttf"
    };
    
    if (TajawalRegularBase64.trim().length > 100) {
      (pdfMake as any).vfs['Tajawal-Regular.ttf'] = TajawalRegularBase64;
      console.log('✅ Tajawal fonts configured with base64 data');
    } else {
      console.log('ℹ️ Using Tajawal font (no base64 data provided - will use system font)');
    }
  } catch (error) {
    console.warn('⚠️ Font configuration failed:', error);
  }
};

/**
 * Helper function to detect if text contains Arabic characters
{{ ... }}
 */
const hasArabicText = (text: string): boolean => {
  return /[\u0600-\u06FF]/.test(text);
};

/**
 * Helper function to create bilingual text content
 */
const createBilingualText = (
  englishText: string,
  arabicText: string
): Content[] => {
  return [
    {
      text: englishText,
      alignment: "left" as const,
      font: "Tajawal",
      margin: [0, 0, 0, 2],
    },
    {
      text: arabicText,
      alignment: "right" as const,
      font: "Tajawal",
      margin: [0, 0, 0, 8],
    },
  ];
};

/**
 * Helper function to create section header
 */
const createSectionHeader = (
  englishTitle: string,
  arabicTitle: string
): Content => {
  return {
    columns: [
      {
        text: englishTitle,
        style: "sectionHeader",
        alignment: "left" as const,
        width: "50%",
      },
      {
        text: arabicTitle,
        style: "sectionHeaderArabic",
        alignment: "right" as const,
        width: "50%",
      },
    ],
    margin: [0, 15, 0, 10],
  };
};

/**
 * Generate contract PDF using pdfMake
 */
export const generateContractPDF = async (
  contract: Contract
): Promise<Blob> => {
  console.log("🚀 Generating PDF with pdfMake for contract:", contract.id);

  // Initialize pdfMake first
  await initializePdfMake();

  const documentDefinition: TDocumentDefinitions = {
    content: [
      // Title Section
      {
        columns: [
          {
            text: "CONTRACT AGREEMENT",
            style: "title",
            alignment: "left" as const,
            width: "50%",
          },
          {
            text: "اتفاقية العقد",
            style: "titleArabic",
            alignment: "right" as const,
            width: "50%",
          },
        ],
        margin: [0, 0, 0, 20],
      },

      // Project Information Section
      createSectionHeader("PROJECT INFORMATION", "معلومات المشروع"),

      // Project Details
      ...createBilingualText(
        `Project: ${contract.project.title}`,
        `المشروع: ${contract.project.title}`
      ),
      ...createBilingualText(
        `Contractor: ${contract.offer.contractor_name}`,
        `المقاول: ${contract.offer.contractor_name}`
      ),
      ...createBilingualText(
        `Amount: ${contract.offer.offer_amount.toLocaleString()} SAR`,
        `المبلغ: ${contract.offer.offer_amount.toLocaleString()} ريال سعودي`
      ),
      ...createBilingualText(
        `Duration: ${contract.offer.duration}`,
        `المدة: ${contract.offer.duration}`
      ),
      ...createBilingualText(
        `Version: ${contract.versionNumber}`,
        `الإصدار: ${contract.versionNumber}`
      ),
      ...createBilingualText(
        `Status: ${contract.status}`,
        `الحالة: ${contract.status}`
      ),

      // Standard Clauses Section
      createSectionHeader("STANDARD CLAUSES", "البنود القياسية"),

      // Standard Clauses Content
      {
        ol: contract.standardClauses.map((clause, index) => ({
          columns: [
            {
              text: `${clause.title}\n${clause.text}`,
              alignment: "left" as const,
              width: "50%",
              margin: [0, 0, 10, 10],
            },
            {
              text: `${clause.title}\n${clause.text}`,
              alignment: "right" as const,
              font: "Tajawal",
              width: "50%",
              margin: [10, 0, 0, 10],
            },
          ],
        })),
        margin: [0, 0, 0, 15],
      },

      // Additional Clauses Section
      createSectionHeader("ADDITIONAL CLAUSES", "البنود الإضافية"),

      // Additional Clauses Content
      contract.additionalClauses.length > 0
        ? {
            ol: contract.additionalClauses.map((clause, index) => ({
              columns: [
                {
                  text: clause.text,
                  alignment: "left" as const,
                  width: "50%",
                  margin: [0, 0, 10, 10],
                },
                {
                  text: clause.text,
                  alignment: "right" as const,
                  font: "Tajawal",
                  width: "50%",
                  margin: [10, 0, 0, 10],
                },
              ],
            })),
            margin: [0, 0, 0, 15],
          }
        : {
            columns: [
              {
                text: "No additional clauses",
                alignment: "left" as const,
                width: "50%",
                style: "normal",
              },
              {
                text: "لا توجد بنود إضافية",
                alignment: "right" as const,
                font: "Tajawal",
                width: "50%",
                style: "normal",
              },
            ],
            margin: [0, 0, 0, 15],
          },

      // Signatures Section
      createSectionHeader("SIGNATURES", "التوقيعات"),

      // Client Signature
      ...createBilingualText(
        `Client: ${contract.clientSignedPDF_URL ? "Signed ✓" : "Pending ☐"}`,
        `العميل: ${contract.clientSignedPDF_URL ? "موقع ✓" : "في الانتظار ☐"}`
      ),

      // Contractor Signature
      ...createBilingualText(
        `Contractor: ${
          contract.contractorSignedPDF_URL ? "Signed ✓" : "Pending ☐"
        }`,
        `المقاول: ${
          contract.contractorSignedPDF_URL ? "موقع ✓" : "في الانتظار ☐"
        }`
      ),

      // Footer
      {
        text: "\n\n",
        pageBreak: "after" as const,
      },
      {
        columns: [
          {
            text: [
              `Generated: ${new Date().toLocaleDateString()}\n`,
              `Contract ID: ${contract.id}`,
            ],
            alignment: "left" as const,
            fontSize: 10,
            width: "50%",
          },
          {
            text: [
              `تاريخ الإنشاء: ${new Date().toLocaleDateString()}\n`,
              `رقم العقد: ${contract.id}`,
            ],
            alignment: "right" as const,
            font: "Tajawal",
            fontSize: 10,
            width: "50%",
          },
        ],
        margin: [0, 20, 0, 0],
      },
    ],

    // Styles
    styles: {
      title: {
        fontSize: 20,
        bold: true,
        font: "Tajawal",
      },
      titleArabic: {
        fontSize: 18,
        bold: true,
        font: "Tajawal",
      },
      sectionHeader: {
        fontSize: 14,
        bold: true,
        font: "Tajawal",
      },
      sectionHeaderArabic: {
        fontSize: 14,
        bold: true,
        font: "Tajawal",
      },
      normal: {
        fontSize: 11,
        font: "Tajawal",
      },
      arabic: {
        fontSize: 11,
        font: "Tajawal",
      },
    },

    // Default style
    defaultStyle: {
      fontSize: 11,
      font: "Tajawal",
    },

    // Page settings
    pageSize: "A4",
    pageMargins: [40, 60, 40, 60],

    // Info
    info: {
      title: `Contract ${contract.id} - ${contract.project.title}`,
      author: "Contract Management System",
      subject: "Contract Agreement",
      creator: "pdfMake with Arabic Support",
    },
  };

  return new Promise((resolve, reject) => {
    try {
      const pdfDocGenerator = pdfMake.createPdf(documentDefinition);

      pdfDocGenerator.getBlob((blob: Blob) => {
        console.log(
          "✅ PDF generated successfully with pdfMake, size:",
          blob.size,
          "bytes"
        );
        resolve(blob);
      });
    } catch (error) {
      console.error("❌ PDF generation failed:", error);
      reject(error);
    }
  });
};

/**
 * Download contract PDF
 */
export const downloadContractPDF = async (
  contract: Contract,
  filename?: string
): Promise<void> => {
  try {
    console.log("📥 Starting PDF download for contract:", contract.id);

    const blob = await generateContractPDF(contract);

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download =
      filename || `contract-${contract.id}-v${contract.versionNumber}.pdf`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    URL.revokeObjectURL(url);

    console.log("✅ PDF download completed successfully");
  } catch (error) {
    console.error("❌ PDF download failed:", error);
    throw error;
  }
};

/**
 * Generate PDF blob URL for preview in iframe
 */
export const previewContractPDF = async (
  contract: Contract
): Promise<string> => {
  try {
    console.log("👀 Generating PDF preview for contract:", contract.id);

    const blob = await generateContractPDF(contract);
    const url = URL.createObjectURL(blob);

    console.log("✅ PDF preview URL generated:", url);
    return url;
  } catch (error) {
    console.error("❌ PDF preview generation failed:", error);
    throw error;
  }
};

/**
 * Cleanup preview URL to prevent memory leaks
 */
export const cleanupPreviewURL = (url: string): void => {
  URL.revokeObjectURL(url);
  console.log("🧹 Preview URL cleaned up");
};

// Export font configuration helper for external use
export const configurePDFMakeFonts = (tajawalBase64: string): void => {
  if (tajawalBase64 && tajawalBase64.trim().length > 100) {
    try {
      (pdfMake as any).vfs['Tajawal-Regular.ttf'] = tajawalBase64;
      
      // Use Object.defineProperty to safely set fonts
      if (!(pdfMake as any).fonts) {
        Object.defineProperty(pdfMake, 'fonts', {
          value: {},
          writable: true,
          configurable: true
        });
      }
      
      (pdfMake as any).fonts.Tajawal = {
        normal: 'Tajawal-Regular.ttf',
        bold: 'Tajawal-Regular.ttf',
        italics: 'Tajawal-Regular.ttf',
        bolditalics: 'Tajawal-Regular.ttf'
      };
      
      console.log('✅ Tajawal fonts configured for pdfMake');
    } catch (error) {
      console.warn('⚠️ External font configuration failed:', error);
    }
  }
};

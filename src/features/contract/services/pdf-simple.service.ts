import { Contract } from '../types/contract';

/**
 * Simplified PDF Service using dynamic imports for Next.js compatibility
 */

// Simple text-based PDF generation as fallback
const generateSimplePDF = (contract: Contract): Blob => {
  const content = `
CONTRACT AGREEMENT / اتفاقية العقد

PROJECT INFORMATION / معلومات المشروع
Project: ${contract.project.title}
المشروع: ${contract.project.title}

Contractor: ${contract.offer.contractor_name}
المقاول: ${contract.offer.contractor_name}

Amount: ${contract.offer.offer_amount.toLocaleString()} SAR
المبلغ: ${contract.offer.offer_amount.toLocaleString()} ريال سعودي

Duration: ${contract.offer.duration}
المدة: ${contract.offer.duration}

Version: ${contract.versionNumber}
الإصدار: ${contract.versionNumber}

Status: ${contract.status}
الحالة: ${contract.status}

STANDARD CLAUSES / البنود القياسية
${contract.standardClauses.map((clause, index) => 
  `${index + 1}. ${clause.title}\n   ${clause.text}`
).join('\n\n')}

ADDITIONAL CLAUSES / البنود الإضافية
${contract.additionalClauses.length > 0 
  ? contract.additionalClauses.map((clause, index) => 
      `${index + 1}. ${clause.text}`
    ).join('\n\n')
  : 'No additional clauses / لا توجد بنود إضافية'
}

SIGNATURES / التوقيعات
Client: ${contract.clientSignedPDF_URL ? 'Signed ✓' : 'Pending ☐'}
العميل: ${contract.clientSignedPDF_URL ? 'موقع ✓' : 'في الانتظار ☐'}

Contractor: ${contract.contractorSignedPDF_URL ? 'Signed ✓' : 'Pending ☐'}
المقاول: ${contract.contractorSignedPDF_URL ? 'موقع ✓' : 'في الانتظار ☐'}

Generated: ${new Date().toLocaleDateString()}
Contract ID: ${contract.id}
تاريخ الإنشاء: ${new Date().toLocaleDateString()}
رقم العقد: ${contract.id}
`;

  return new Blob([content], { type: 'application/pdf' });
};

/**
 * Generate contract PDF with dynamic pdfMake loading
 */
export const generateContractPDF = async (contract: Contract): Promise<Blob> => {
  console.log('🚀 Generating PDF for contract:', contract.id);
  
  try {
    // Try to use pdfMake with dynamic import
    const [pdfMake, pdfFonts] = await Promise.all([
      import('pdfmake/build/pdfmake'),
      import('pdfmake/build/vfs_fonts').catch(() => null)
    ]);
    
    console.log('📦 pdfMake modules loaded');
    
    // Initialize VFS safely
    if (pdfFonts) {
      try {
        if ((pdfFonts as any).pdfMake?.vfs) {
          (pdfMake as any).vfs = (pdfFonts as any).pdfMake.vfs;
        } else if ((pdfFonts as any).vfs) {
          (pdfMake as any).vfs = (pdfFonts as any).vfs;
        }
        console.log('✅ Fonts initialized');
      } catch (fontError) {
        console.warn('⚠️ Font initialization failed:', fontError);
      }
    }
    
    // Try to configure fonts, but use fallback if it fails
    let useCustomFonts = false;
    try {
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
      
      useCustomFonts = true;
      console.log('✅ Fonts configured to use Tajawal with all styles');
    } catch (fontConfigError) {
      console.warn('⚠️ Font configuration failed, using default fonts:', fontConfigError);
      useCustomFonts = false;
    }
    
    // Helper function to get font name
    const getFont = () => useCustomFonts ? 'Tajawal' : undefined;
    
    // Create document definition with proper typing
    const documentDefinition: any = {
      content: [
        // Title
        {
          columns: [
            { text: 'CONTRACT AGREEMENT', fontSize: 18, bold: true, width: '50%', ...(useCustomFonts && { font: 'Tajawal' }) },
            { text: 'اتفاقية العقد', fontSize: 16, bold: true, alignment: 'right', width: '50%', ...(useCustomFonts && { font: 'Tajawal' }) }
          ],
          margin: [0, 0, 0, 20]
        },
        
        // Project Information
        {
          columns: [
            { text: 'PROJECT INFORMATION', fontSize: 14, bold: true, width: '50%' },
            { text: 'معلومات المشروع', fontSize: 14, bold: true, alignment: 'right', width: '50%' }
          ],
          margin: [0, 0, 0, 10]
        },
        
        // Project Details
        {
          columns: [
            {
              stack: [
                `Project: ${contract.project.title}`,
                `Contractor: ${contract.offer.contractor_name}`,
                `Amount: ${contract.offer.offer_amount.toLocaleString()} SAR`,
                `Duration: ${contract.offer.duration}`,
                `Version: ${contract.versionNumber}`,
                `Status: ${contract.status}`
              ],
              width: '50%'
            },
            {
              stack: [
                `المشروع: ${contract.project.title}`,
                `المقاول: ${contract.offer.contractor_name}`,
                `المبلغ: ${contract.offer.offer_amount.toLocaleString()} ريال سعودي`,
                `المدة: ${contract.offer.duration}`,
                `الإصدار: ${contract.versionNumber}`,
                `الحالة: ${contract.status}`
              ],
              alignment: 'right',
              width: '50%'
            }
          ],
          margin: [0, 0, 0, 20]
        },
        
        // Standard Clauses
        {
          columns: [
            { text: 'STANDARD CLAUSES', fontSize: 14, bold: true, width: '50%' },
            { text: 'البنود القياسية', fontSize: 14, bold: true, alignment: 'right', width: '50%' }
          ],
          margin: [0, 0, 0, 10]
        },
        
        // Clauses content
        {
          ol: contract.standardClauses.map(clause => ({
            columns: [
              { text: `${clause.title}\n${clause.text}`, width: '50%' },
              { text: `${clause.title}\n${clause.text}`, alignment: 'right', width: '50%' }
            ]
          })),
          margin: [0, 0, 0, 20]
        },
        
        // Additional Clauses
        {
          columns: [
            { text: 'ADDITIONAL CLAUSES', fontSize: 14, bold: true, width: '50%' },
            { text: 'البنود الإضافية', fontSize: 14, bold: true, alignment: 'right', width: '50%' }
          ],
          margin: [0, 0, 0, 10]
        },
        
        // Additional clauses content
        contract.additionalClauses.length > 0 ? {
          ol: contract.additionalClauses.map(clause => ({
            columns: [
              { text: clause.text, width: '50%' },
              { text: clause.text, alignment: 'right', width: '50%' }
            ]
          })),
          margin: [0, 0, 0, 20]
        } : {
          columns: [
            { text: 'No additional clauses', width: '50%' },
            { text: 'لا توجد بنود إضافية', alignment: 'right', width: '50%' }
          ],
          margin: [0, 0, 0, 20]
        },
        
        // Signatures
        {
          columns: [
            { text: 'SIGNATURES', fontSize: 14, bold: true, width: '50%' },
            { text: 'التوقيعات', fontSize: 14, bold: true, alignment: 'right', width: '50%' }
          ],
          margin: [0, 0, 0, 10]
        },
        
        {
          columns: [
            {
              stack: [
                `Client: ${contract.clientSignedPDF_URL ? 'Signed ✓' : 'Pending ☐'}`,
                `Contractor: ${contract.contractorSignedPDF_URL ? 'Signed ✓' : 'Pending ☐'}`
              ],
              width: '50%'
            },
            {
              stack: [
                `العميل: ${contract.clientSignedPDF_URL ? 'موقع ✓' : 'في الانتظار ☐'}`,
                `المقاول: ${contract.contractorSignedPDF_URL ? 'موقع ✓' : 'في الانتظار ☐'}`
              ],
              alignment: 'right',
              width: '50%'
            }
          ],
          margin: [0, 0, 0, 30]
        },
        
        // Footer
        {
          columns: [
            {
              stack: [
                `Generated: ${new Date().toLocaleDateString()}`,
                `Contract ID: ${contract.id}`
              ],
              fontSize: 10,
              width: '50%'
            },
            {
              stack: [
                `تاريخ الإنشاء: ${new Date().toLocaleDateString()}`,
                `رقم العقد: ${contract.id}`
              ],
              fontSize: 10,
              alignment: 'right',
              width: '50%'
            }
          ]
        }
      ],
      
      // Default style - only use custom font if available
      ...(useCustomFonts && {
        defaultStyle: {
          font: 'Tajawal',
          fontSize: 11
        }
      }),
      ...(!useCustomFonts && {
        defaultStyle: {
          fontSize: 11
        }
      }),
      
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      
      info: {
        title: `Contract ${contract.id}`,
        author: 'Contract Management System'
      }
    };
    
    // Generate PDF
    return new Promise((resolve, reject) => {
      try {
        const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
        pdfDocGenerator.getBlob((blob: Blob) => {
          console.log('✅ PDF generated with pdfMake, size:', blob.size, 'bytes');
          resolve(blob);
        });
      } catch (error) {
        console.error('❌ pdfMake generation failed:', error);
        reject(error);
      }
    });
    
  } catch (error) {
    console.error('❌ pdfMake loading failed, using simple fallback:', error);
    
    // Fallback to simple text PDF
    const blob = generateSimplePDF(contract);
    console.log('✅ Simple PDF generated, size:', blob.size, 'bytes');
    return blob;
  }
};

/**
 * Download contract PDF
 */
export const downloadContractPDF = async (
  contract: Contract,
  filename?: string
): Promise<void> => {
  try {
    const blob = await generateContractPDF(contract);
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `contract-${contract.id}-v${contract.versionNumber}.pdf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    console.log('✅ PDF download completed');
  } catch (error) {
    console.error('❌ PDF download failed:', error);
    throw error;
  }
};

/**
 * Generate PDF preview URL
 */
export const previewContractPDF = async (contract: Contract): Promise<string> => {
  try {
    const blob = await generateContractPDF(contract);
    const url = URL.createObjectURL(blob);
    console.log('✅ PDF preview URL generated');
    return url;
  } catch (error) {
    console.error('❌ PDF preview generation failed:', error);
    throw error;
  }
};

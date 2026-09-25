import html2pdf from 'html2pdf.js';

export const downloadQuestionPaperPdf = async (element: HTMLElement, fileName: string) => {
  await html2pdf()
    .set({
      margin: [12, 12, 14, 12],
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    } as Record<string, unknown>)
    .from(element)
    .save();
};
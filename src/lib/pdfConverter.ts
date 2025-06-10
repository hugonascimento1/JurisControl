import * as pdfjsLib from 'pdfjs-dist';

export const convertPdfToHtml = async (pdfUrl: string): Promise<string> => {
  try {
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    let htmlContent = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      htmlContent += textContent.items
        .map(item => {
          // Verifica se é um TextItem válido
          if ('str' in item && 'transform' in item) {
            return `<div style="position:absolute; left:${item.transform[4]}px; top:${item.transform[5]}px">${item.str}</div>`;
          }
          return '';
        })
        .join('');
    }

    return `<div style="position:relative; min-height:1000px;">${htmlContent}</div>`;
  } catch (error) {
    console.error('Erro na conversão PDF para HTML:', error);
    throw new Error('Falha na conversão do PDF');
  }
};
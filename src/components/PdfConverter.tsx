'use client';

// components/PdfConverter.tsx
import { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Configura o worker do PDF.js
// Isso é importante para que o PDF.js funcione corretamente no navegador
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PdfConverterProps {
  pdfUrl: string | null;
  onConversionComplete: (html: string) => void;
  onError: (error: string) => void;
  onConvertingChange: (isConverting: boolean) => void;
}

const PdfConverter: React.FC<PdfConverterProps> = ({ pdfUrl, onConversionComplete, onError, onConvertingChange }) => {
  useEffect(() => {
    const convertPdfToHtml = async (url: string): Promise<string> => {
      onConvertingChange(true);
      try {
        if (!url || !url.startsWith('http')) {
          throw new Error('URL do PDF inválida');
        }

        let pdfData;
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          pdfData = await response.arrayBuffer();
        } catch (fetchError) {
          console.error('Erro no fetch do PDF:', fetchError);
          throw new Error('Não foi possível baixar o PDF');
        }

        const pdf = await pdfjsLib.getDocument({
          data: pdfData,
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.10.377/cmaps/',
          cMapPacked: true
        }).promise;

        let htmlContent = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          try {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            // Processamento do texto:
            const lines: { [key: number]: string[] } = {};
            let lastY = -1;
            let currentLine: string[] = [];

            textContent.items.forEach((item: any) => {
              const transform = item.transform;
              const y = transform[5]; // Y-coordinate is at index 5 for PDF.js item transform

              if (lastY === -1 || Math.abs(y - lastY) > 5) { // Threshold for new line (adjust as needed)
                if (currentLine.length > 0) {
                  const sortedLine = currentLine.sort((a, b) => {
                    const xA = (textContent.items.find((x: any) => x.str === a) as any)?.transform[4] || 0;
                    const xB = (textContent.items.find((x: any) => x.str === b) as any)?.transform[4] || 0;
                    return xA - xB;
                  });
                  htmlContent += `<p>${sortedLine.join(' ')}</p>`;
                }
                currentLine = [item.str];
                lastY = y;
              } else {
                currentLine.push(item.str);
              }
            });

            // Add the last line if it exists
            if (currentLine.length > 0) {
                const sortedLine = currentLine.sort((a, b) => {
                  const xA = (textContent.items.find((x: any) => x.str === a) as any)?.transform[4] || 0;
                  const xB = (textContent.items.find((x: any) => x.str === b) as any)?.transform[4] || 0;
                  return xA - xB;
                });
                htmlContent += `<p>${sortedLine.join(' ')}</p>`;
            }

          } catch (pageError) {
            console.error(`Erro na página ${i}:`, pageError);
            htmlContent += `<p>[Erro ao processar página ${i}]</p>`;
          }
        }

        return htmlContent || '<p>Nenhum conteúdo extraído do PDF</p>';

      } catch (error: any) {
        console.error('Erro detalhado na conversão:', error);
        onError(`Erro na conversão: ${error.message}`);
        return `<p class="error">Erro na conversão: ${error.message}</p>`;
      } finally {
        onConvertingChange(false);
      }
    };

    if (pdfUrl) {
      convertPdfToHtml(pdfUrl)
        .then(html => onConversionComplete(html))
        .catch(err => onError(err.message));
    }
  }, [pdfUrl, onConversionComplete, onError, onConvertingChange]);

  return null; // Este componente não renderiza nada diretamente, ele apenas lida com a lógica de conversão.
};

export default PdfConverter;
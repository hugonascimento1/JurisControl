'use client';

// components/PdfConverter.tsx
import { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Configura o worker do PDF.js
// Isso é importante para que o PDF.js funcione corretamente no navegador
// pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';

interface PdfConverterProps {
    pdfUrl: string | null;
    shouldConvert: boolean; // Novo prop para controlar a execução
    onConversionComplete: (html: string) => void;
    onError: (error: string) => void;
    onConvertingChange: (isConverting: boolean) => void;
}

const PdfConverter: React.FC<PdfConverterProps> = ({
    pdfUrl,
    shouldConvert,
    onConversionComplete,
    onError,
    onConvertingChange,
}) => {

    useEffect(() => {
        const convertPdfToHtml = async (url: string) => {
            onConvertingChange(true); // Inicia o estado de conversão
            try {
                // Configura o caminho para o worker, importante para o pdf.js
                // Use a versão local se você tiver o worker.min.js na public/pdfjs
                // Ex: pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js';
                pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';

                const loadingTask = pdfjsLib.getDocument(url);
                const pdf = await loadingTask.promise;
                let htmlContent = '';

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 1.5 }); // Aumentei a escala para melhor qualidade visual

                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    const renderContext = {
                        canvasContext: context!,
                        viewport: viewport,
                    };

                    await page.render(renderContext).promise;

                    // Adicionando um estilo básico para centralizar e ajustar a imagem
                    const imgData = canvas.toDataURL('image/png');
                    htmlContent += `<p style="text-align: center; margin-bottom: 10px;"><img src="${imgData}" style="max-width: 100%; height: auto; display: inline-block;" alt="Página ${i}" /></p>`;
                }

                onConversionComplete(htmlContent);
            } catch (err: any) {
                console.error('Erro ao converter PDF:', err);
                onError('Erro ao converter PDF para HTML. Verifique o arquivo.');
            } finally {
                onConvertingChange(false); // Finaliza o estado de conversão
            }
        };

        if (pdfUrl && shouldConvert) {
            convertPdfToHtml(pdfUrl);
        }
    }, [pdfUrl, shouldConvert, onConversionComplete, onError, onConvertingChange]);

    return null; // Este componente não renderiza nada diretamente no DOM
};

export default PdfConverter;
'use client';

import NavBar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast, ToastContainer, ToastPosition } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { withAuth } from "@/utils/withAuth";
import html2pdf from 'html2pdf.js';

const EditorTiny = dynamic(() => import('@/components/EditorTiny'), {
    ssr: false,
});

async function generateDocumentModel(description, apiKey) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `
                            Você é um criador de modelos de documentos para um escritório de advocacia. Gere um modelo de documento formatado em HTML puro com base na seguinte descrição: ${description}.

                            O HTML gerado deve ser um fragmento (sem as tags <html>, <head> ou <body> — apenas o conteúdo interno).

                            O conteúdo deve iniciar com uma <div> principal contendo todo o documento, com o seguinte estilo inline: 
                            'font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.4; color: #333;'.

                            Regras de formatação:

                            - Use a tag <p> para todo o conteúdo textual, incluindo títulos e subtítulos.
                            - Para títulos de seções ou destaques, use: "<p><b>Título ou Destaque</b></p>".
                            - Para parágrafos normais, use <p>Texto aqui</p>.
                            - Sempre que precisar de uma quebra de linha (sem novo parágrafo), use a tag <br>.
                            - Use a tag <b> para destacar:
                            - Títulos e subtítulos (mesmo que sejam simulados com <p><b>)
                            - Termos importantes (como nomes das partes, “AÇÃO”, “REQUER”, “DOS FATOS”, valores etc.)
                            - Qualquer elemento textual que precise aparecer em **negrito no PDF final**
                            - Use a tag <i> para observações ou informações complementares.

                            Evite instruções genéricas como “[espaço de 5 linhas]”, “(Doc. 01)”, “Documentos anexos: ...” ou notas explicativas destinadas à IA. O conteúdo deve parecer natural e profissional, como se tivesse sido redigido por um advogado experiente.

                            **NÃO use markdown nem envolva o HTML com blocos de código (\`\`\`). Apenas o HTML puro, corretamente formatado.**

                            O objetivo é gerar um HTML compatível tanto com editores como o TinyMCE quanto com exportadores de PDF, preservando a aparência profissional.
`
                    }]
                }],
            }),
        }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Erro da API Gemini: Status ${response.status}, Resposta: ${errorText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        let generatedHtml = data.candidates[0]?.content?.parts[0]?.text || '';

        generatedHtml = generatedHtml.replace(/^```html\s*\n?/, '').replace(/\n?\s*```$/, '').trim();

        console.log("HTML gerado pela IA (direto e limpo):", generatedHtml);

        if (!generatedHtml.trim()) {
            console.warn("A IA retornou um HTML vazio ou inválido após a limpeza.");
            return "A IA não conseguiu gerar um modelo. Tente refinar sua descrição.";
        }

        const logoUrl = "https://juriscontrol.vercel.app/_next/image?url=%2Flogo-escritorio.png&w=1080&q=75";
        const logoHtml = `<p style="text-align: center; margin-bottom: 20px;"><img src="${logoUrl}" alt="Logo do Escritório" width="250" height="103" style="display: inline-block;"></p>`;

        generatedHtml = logoHtml + generatedHtml;

        return generatedHtml;
    } catch (error) {
        console.error('Erro ao chamar a API do Gemini: ', error);
    }
}

function Page() {
    // estados para geração com ia
    const [description, setDescription] = useState('');
    const [htmlContent, setHtmlContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    // estados para aba de upload de modelos
    const [text, setText] = useState('');

    // ref para o conteúdo
    const contentRef = useRef(null);

    const toastOptions = {
        position: "top-center" as ToastPosition,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    }


    // Função para geração de conteúdo IA
    const handleGenerate = async () => {
        if (!description.trim()) {
            toast.warn('Por favor, forneça uma descrição para gerar o documento.', toastOptions);
            console.warn('Por favor, forneça uma descrição para gerar o documento.');

            return;
        }

        setIsLoading(true);
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        const generatedResult = await generateDocumentModel(description, apiKey);

        if (generatedResult.startsWith('A IA não conseguiu gerar') || generatedResult.startsWith('Ocorreu um erro')) {
            console.warn(generatedResult);
            toast.error(generatedResult, toastOptions);
            setHtmlContent('');
        } else {
            setHtmlContent(generatedResult);
        }

        setIsLoading(false);
    }

    // const handleDownload = async () => {
    //     if (!htmlContent) {
    //         toast.warn("Nenhum conteúdo para exportar.", toastOptions);
    //         return;
    //     }

    //     // 1. Crie um elemento temporário para renderizar o HTML
    //     const tempElement = document.createElement('div');
    //     tempElement.innerHTML = htmlContent;

    //     // 2. Adicione os estilos CSS relevantes para o PDF
    //     tempElement.style.cssText = `
    //         font-family: Arial, sans-serif;
    //         font-size: 12pt;
    //         line-height: 1.5;
    //         color: #333;
    //         padding: 20mm; /* Simular margens A4 */
    //         width: 210mm; /* Largura da página A4 */
    //         box-sizing: border-box; /* Para que o padding não aumente a largura total */
    //     `;

    //     const styleTag = document.createElement('style');
    //     styleTag.textContent = `
    //         p { margin-bottom: 1em; }
    //         h1 { font-size: 24pt; margin-top: 1.5em; margin-bottom: 0.5em; }
    //         h2 { font-size: 20pt; margin-top: 1.2em; margin-bottom: 0.4em; }
    //         /* ... Adicione os outros estilos que você quer que apareçam no PDF ... */
    //         img { max-width: 100%; height: auto; display: block; margin: 0 auto; }
    //         table { width: 100%; border-collapse: collapse; margin-bottom: 1em; }
    //         th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    //     `;
    //     tempElement.prepend(styleTag);

    //     // Ocultar o elemento, mas garantir que ele esteja no DOM e com layout
    //     // Uma forma é posicionar fora da tela, mas com display: block
    //     tempElement.style.position = 'absolute';
    //     tempElement.style.top = '-9999px';
    //     tempElement.style.left = '-9999px';
    //     tempElement.style.zIndex = '-1'; // Certifique-se de que não interfira visualmente
    //     document.body.appendChild(tempElement); // Anexar ao body para que html2canvas possa vê-lo

    //     try {
    //         // 3. Gerar o PDF usando html2pdf.js
    //         await html2pdf()
    //             .from(tempElement)
    //             .set({
    //                 margin: 10, // Margens em mm
    //                 filename: 'documento-gerado.pdf',
    //                 image: { type: 'jpeg', quality: 0.98 },
    //                 html2canvas: {
    //                     scale: 2, // Aumenta a resolução do "print"
    //                     useCORS: true, // Permite carregar imagens de outros domínios
    //                     allowTaint: true, // Pode ajudar com certas imagens
    //                 },
    //                 jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    //             })
    //             .save();

    //         toast.success("Documento gerado com sucesso!", toastOptions);

    //     } catch (error) {
    //         console.error('Erro ao gerar PDF:', error);
    //         toast.error('Erro ao gerar PDF: ', toastOptions);
    //     } finally {
    //         // 4. Limpar o elemento temporário
    //         document.body.removeChild(tempElement);
    //     }
    // };

    return (
        <div className="flex flex-col justify-center items-center mb-5">
            <NavBar
                botaoVoltar={
                    <Link className="p-0 m-0 flex items-center" href="/inicio">
                        <Button size="icon" className="bg-[#030430] hover:bg-gray-500">
                            <ChevronLeftIcon style={{ width: "35px", height: "35px" }} className=""></ChevronLeftIcon>
                        </Button>
                    </Link>
                }
                nome="Gerar Documentos"

            />
            <ToastContainer />
            <Tabs defaultValue="gere-com-ia" className="w-[98%] border-2 border-gray-300 pb-4 rounded-t-lg shadow-lg">
                <TabsList className="flex flex-row bg-[#030430] h-11 rounded-t-lg w-full justify-start items-start">
                    <TabsTrigger value="gere-com-ia">Gere com IA</TabsTrigger>
                    <TabsTrigger value="modelos-prontos">Usar um modelo</TabsTrigger>
                </TabsList>
                <TabsContent value="gere-com-ia" className="flex justify-center px-2">
                    <div className="flex flex-col md:flex-row w-full gap-4">
                        <Card className="w-full md:w-1/3 h-[calc(100vh-200px)] flex flex-col">
                            <CardHeader className="bg-[#030430] h-14 justify-center text-white rounded-t-lg mb-3">
                                <CardTitle className="text-lg">Descreva e Gere</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="flex flex-col gap-4 p-3">
                                    <CardDescription className="text-base text-gray-500">
                                        Forneça uma descrição detalhada o modelo de documento que você precisa.
                                        Quanto mais específico você for, mais precisa será a geração do
                                        modelo pela IA.
                                    </CardDescription>

                                    <Textarea
                                        className="border-2 border-gray-300 p-2 resize-vertical overflow-hidden h-[50px] mt-5 mb-3"
                                        placeholder="Gere uma petição inicial para o caso x..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        disabled={isLoading}
                                    />

                                    <Button onClick={handleGenerate} disabled={isLoading}>
                                        {isLoading ? 'Gerando...' : 'Gerar'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="w-full md:w-4/6 h-[calc(100vh-200px)] flex flex-col">
                            <CardHeader className="bg-[#030430] h-14 justify-center text-white rounded-t-lg mb-3">
                                <CardTitle className="text-lg">Editor de Texto</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col justify-between gap-10 pb-1">
                                {/* <div ref={contentRef} className="p-4 bg-white"> */}
                                <EditorTiny value={htmlContent} onChange={(newHtml) => setHtmlContent(newHtml)} />
                                {/* </div> */}
                                {/* <Button onClick={handleDownload} className="mt-4">Download</Button> */}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="modelos-prontos" className="flex justify-center px-2 py-0 mt-0">
                    <div className="flex flex-col md:flex-row w-full gap-4 mt-0">
                        <h1>Em desenvolvimento</h1>
                        {/* <Card className="w-full md:w-1/3 h-[calc(100vh-200px)] flex flex-col">
                            <CardHeader className="bg-[#030430] h-14 justify-center text-white rounded-t-lg mb-3">
                                <CardTitle className="text-lg">Faça upload do modelo</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="flex flex-col gap-4 p-3">
                                    <CardDescription className="text-base text-gray-500">
                                        Faça o upload do modelo que você deseja usar
                                    </CardDescription>

                                    <ul className="my-3 gap-2">
                                        <p className="text-gray-400">modelo-procuracao.pdf</p>
                                        <p className="text-gray-400">modelo-procuracao.pdf</p>
                                        <p className="text-gray-400">modelo-procuracao.pdf</p>
                                    </ul>


                                    <Button onClick={handleGenerate}>Usar modelo</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="w-full md:w-4/6 h-[calc(100vh-200px)] flex flex-col">
                            <CardHeader className="bg-[#030430] h-14 justify-center text-white rounded-t-lg mb-3">
                                <CardTitle className="text-lg">Edição</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col justify-between gap-10">
                                <EditorTiny value={text} onChange={(newText) => setText(newText)} />
                                <Button className="justify-self-end w-full">Download</Button> 
                            </CardContent>
                        </Card> */}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default withAuth(['advogado'])(Page);

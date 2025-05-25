'use client';

import NavBar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import dynamic from "next/dynamic";

import { withAuth } from "@/utils/withAuth";

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
                        Você é um criador de modelos de documentos para um escritório de advocacia. Gere um modelo de documento formatado em **HTML puro** com base na seguinte descrição: ${description}.

                        O HTML gerado deve ser um fragmento de HTML (sem tags <html>, <head>, <body> completas, apenas o conteúdo interno).
                        Ele deve começar com uma tag <div> principal que envolva todo o conteúdo.
                        Esta <div> principal deve ter um estilo inline: 'font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.4; color: #333;' para garantir uma boa legibilidade e cor de texto padrão.

                        O documento deve incluir títulos (use tags como <h2>, <h3>), parágrafos (<p>), e espaçamento adequado para um documento legal. Use a tag <b> para destacar informações importantes e <i> para citações ou referências.

                        **É crucial que o HTML seja retornado sem marcadores de bloco de código (como \`\`\`html ou \`\`\`). Retorne apenas o HTML puro e bem-formado.** O documento deve ser entregue pronto para uso, limpo e com uma estrutura profissional.`
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
    const [description, setDescription] = useState('');
    const [htmlContent, setHtmlContent] = useState<string>('');
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!description.trim()) {
            alert('Por favor, forneça uma descrição para gerar o documento.');
            return;
        }

        setIsLoading(true);
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        
        const generatedResult = await generateDocumentModel(description, apiKey);

        if (generatedResult.startsWith('A IA não conseguiu gerar') || generatedResult.startsWith('Ocorreu um erro')) {
            alert(generatedResult); 
            setHtmlContent(''); 
        } else {
            setHtmlContent(generatedResult);
        }
        
        setIsLoading(false);
    }

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

            <Tabs defaultValue="gere-com-ia" className="w-[98%] border-2 border-gray-300 pb-4 rounded-t-lg shadow-lg">
                <TabsList className="flex flex-row bg-[#030430] h-11 rounded-t-lg w-full justify-start items-start">
                    <TabsTrigger value="gere-com-ia">Gere com IA</TabsTrigger>
                    <TabsTrigger value="modelos-prontos">Modelos Prontos</TabsTrigger>
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

                        <Card className="w-full md:w-4/6 h-[calc(100vh-200px)] flex flex-col bg-black">
                            <CardHeader className="bg-[#030430] h-14 justify-center text-white rounded-t-lg mb-3">
                                <CardTitle className="text-lg">Editor de Texto</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col justify-between gap-10 pb-1">
                                <EditorTiny value={htmlContent} onChange={(newHtml) => setHtmlContent(newHtml)} />
                                {/* <Button className="justify-self-end w-full">Download</Button> */}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="modelos-prontos" className="flex justify-center px-2 py-0 mt-0">
                    <div className="flex flex-col md:flex-row w-full gap-4 mt-0">
                        <Card className="w-full md:w-1/3 h-[calc(100vh-200px)] flex flex-col">
                            <CardHeader className="bg-[#030430] h-14 justify-center text-white rounded-t-lg mb-3">
                                <CardTitle className="text-lg">Escolha seu modelo</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="flex flex-col gap-4 p-3">
                                    <CardDescription className="text-base text-gray-500">
                                        Escolha um dos modelos disponíveis e clique em
                                        "Usar modelo" para carregar o modelo dentro da aba de edição
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
                                {/* <Button className="justify-self-end w-full">Download</Button> */}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default withAuth(['advogado'])(Page);

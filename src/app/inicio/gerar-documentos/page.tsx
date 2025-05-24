'use client';

import NavBar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import dynamic from "next/dynamic";
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Delta from "quill-delta";
import { withAuth } from "@/utils/withAuth";
// import html2pdf from 'html2pdf.js';

const ReactQuill = dynamic(() => import('react-quill'), {
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
                        text: `Você é um criador de modelos de documentos para um escritório 
                        de advocacia. Gere um modelo de documento formatado com base na 
                        seguinte descrição: ${description}. O documento deve incluir títulos, 
                        subtítulos, parágrafos e espaçamento adequados para um documento legal. 
                        Use negrito para destacar informações importantes e itálico para citações 
                        ou referências. Não inclua nenhuma marcação ou comentário adicional no 
                        documento gerado. O documento deve ser entregue pronto para uso, sem nenhuma 
                        alteração. Remova todos os colchetes e forneça informações genéricas onde 
                        necessário. Formate o documento de forma clara e organizada, com títulos, 
                        subtítulos, parágrafos e espaçamento adequados para um documento legal. 
                        Não use asteriscos para destacar palavras ou frases.`
                    }]
                }],
            }),
        }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        const delta = convertTextToDeltaWithBold(text);
        return delta;
    } catch (error) {
        console.error('Erro ao chamar a API do Gemini: ', error);
        return 'Erro ao gerar o modelo. Tente novamente.';
    }

    function convertTextToDeltaWithBold(text) {
        const delta = new Delta();
        let currentIndex = 0;

        while (currentIndex < text.length) {
            const boldStart = text.indexOf('**', currentIndex);

            if (boldStart === -1) {
                delta.insert(text.substring(currentIndex));
                currentIndex = text.length;
            } else {
                delta.insert(text.substring(currentIndex, boldStart));
                currentIndex = boldStart + 2;

                const boldEnd = text.indexOf('**', currentIndex);

                if (boldEnd === -1) {
                    delta.insert(text.substring(currentIndex));
                    currentIndex = text.length;
                } else {
                    delta.insert(text.substring(currentIndex, boldEnd), { bold: true });
                    currentIndex = boldEnd + 2;
                }
            }
        }

        return delta;
    }
}

function Page() {
    const [description, setDescription] = useState('');
    const [generatedModel, setGeneratedModel] = useState<any>('');

    const handleGenerate = async () => {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        const model = await generateDocumentModel(description, apiKey);
        setGeneratedModel(model);
    }

    return (
        <div className="flex flex-col justify-center items-center mb-5"> {/* Removido o padding do div pai */}
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
                                    />

                                    <Button onClick={handleGenerate}>Gerar</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="w-full md:w-4/6 h-[calc(100vh-200px)] flex flex-col">
                            <CardHeader className="bg-[#030430] h-14 justify-center text-white rounded-t-lg mb-3">
                                <CardTitle className="text-lg">Editor de Texto</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col justify-between gap-10">
                                <ReactQuill
                                    className="flex-grow mb-3 h-[calc(100vh-375px)]"
                                    value={generatedModel}
                                    onChange={setGeneratedModel}
                                />
                                <Button className="justify-self-end w-full">Download</Button>
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
                                <ReactQuill
                                    className="flex-grow mb-3 h-[calc(100vh-375px)]"
                                    value={generatedModel}
                                    onChange={setGeneratedModel}
                                />
                                <Button className="justify-self-end w-full">Download</Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default withAuth(['advogado'])(Page);

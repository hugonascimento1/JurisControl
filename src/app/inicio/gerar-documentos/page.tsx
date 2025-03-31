'use client'

import NavBar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'

const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

export default function Page() {
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


            <div className="flex flex-col md:flex-row w-11/12 gap-2 justify-center items-center">
                <Card className="w-1/3 h-[595px]">
                    <CardHeader className="bg-[#030430] text-white rounded-t-lg mb-3">
                        <CardTitle>Descreva e Gere</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* <CardContent className="flex flex-col gap-4 justify-center h-full"> */}
                        <div className="flex flex-col gap-4 justify-center p-3">
                            <CardDescription className="text-base text-gray-500">
                                Forneça uma descrição detalhada o modelo de documento que você precisa.
                                Quanto mais específico você for, mais precisa será a geração do
                                modelo pela IA.
                            </CardDescription>

                            <Textarea
                                className="border-2 border-gray-300 p-2 resize-vertical overflow-hidden  h-[50px] mt-5 mb-3"
                                placeholder="Gere uma petição inicial para o caso x..."

                            />

                            <Button>Gerar</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="w-4/6 h-[595px]">
                    <CardHeader className="bg-[#030430] text-white rounded-t-lg mb-3">
                        <CardTitle>Editor de Texto</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <ReactQuill className="h-[400px]" />
                        <Button className="mt-10 justify-self-end">Download</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
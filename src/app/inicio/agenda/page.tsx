'use client'

import NavBar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast, ToastContainer, ToastPosition } from "react-toastify";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { FullCalendario } from "@/components/FullCalendario";
import { withAuth } from "@/utils/withAuth";
import { set } from "react-hook-form";

interface AgendaTarefa {
  id: number;
  titulo: string;
  descricao: string;
  data: Date;
}

function Page() {

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');

  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Método 'POST' para adicionar uma TAREFA
  const handleAdicionarTarefa = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim() || !descricao.trim() || !data) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      const tarefaParaEnviar = {
        titulo,
        descricao,
        data
      };

      const response = await axios.post(
        `https://backendjuriscontrol.onrender.com/api/cadastrar-tarefa`,
        tarefaParaEnviar,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success("Tarefa adicionada com sucesso!", toastOptions);
      setTitulo('');
      setDescricao('');
      setData('');
    } catch (error) {
      toast.error('Erro ao adicionar tarefa', toastOptions);
      console.error('Erro:', error);
    }
  }

  const toastOptions = {
      position: "top-center" as ToastPosition,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
  };

  return (
    <div className="flex flex-col">
      <NavBar
        botaoVoltar={
          <Link className="p-0 m-0 flex items-center" href="/inicio">
            <Button size="icon" className="bg-[#030430] hover:bg-gray-500">
              <ChevronLeftIcon style={{ width: "35px", height: "35px" }} className=""></ChevronLeftIcon>
            </Button>
          </Link>
        }
        nome="Agenda"
      />

      <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-2 mx-5 mt-1 mb-5">
        <Card className="w-full md:w-1/3 flex flex-col h-[610px]">
          <CardHeader className="bg-[#030430] text-white mb-5 rounded-t-lg">
            <CardTitle className="font-semibold">Adicionar Tarefa</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex flex-col gap-2 mb-4">
              <Label className="text-base">Título:</Label>
              <Input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Insira o título."
                className="border-gray-300 border-2"
              />
            </div>

            <div className="flex flex-col gap-2 mb-4">
              <Label className="text-base">Data:</Label>
              <Input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="border-gray-300 border-2"
              />
            </div>

            <div className="flex flex-col flex-grow gap-2 mb-4">
              <Label className="text-base">Descrição:</Label>
              <Textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Insira sua descrição."
                className="border-gray-300 border-2 w-full flex-grow"
              />
            </div>

            <div className="flex flex-row gap-2 justify-end">
              <Button
                variant='outline'
                type="button"
                onClick={() => {
                  setTitulo('');
                  setDescricao('');
                  setData('');
                }}
                className="border-gray-300 border-2 shadow-md"
              >
                Limpar
              </Button>
              <Button type="submit" className="shadow-md">Salvar</Button>
            </div>


          </CardContent>
        </Card>

        <Card className="w-full md:w-2/3 h-[610px]">
          <CardHeader className="bg-[#030430] text-white mb-5 rounded-t-lg">
            <CardTitle>Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '100%'}}>
                <FullCalendario />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default withAuth(['advogado'])(Page);

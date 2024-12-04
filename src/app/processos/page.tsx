"use client";

import { SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { MenuIcon, ChevronLeft, Circle, Search, CirclePlus } from "lucide-react";
import Link from "next/link";

import VisualizarCaso from "@/components/visualizarCaso";
import NavBar from "@/components/navbar";

interface Info {
  caso: number;
  status: string;
  reclamante: string;
  reclamado: string;
  data: string;
}

const processos: Info[] = [
  {
    caso: 0,
    status: "Andamento",
    reclamante: "Ana Carla",
    reclamado: "Caixa",
    data: ""
  },
  {
    caso: 0,
    status: "Aberto",
    reclamante: "Matheus V.",
    reclamado: "",
    data: "20/11/2024"
  },
  {
    caso: 0,
    status: "",
    reclamante: "Jonas Alberto",
    reclamado: "Empresas LTDA",
    data: "22/10/2024"
  },
  {
    caso: 0,
    status: "Andamento",
    reclamante: "Kaká Bueno",
    reclamado: "Mc",
    data: "09/06/2024"
  },
  {
    caso: 0,
    status: "Andamento",
    reclamante: "Ana Carla",
    reclamado: "Caixa",
    data: ""
  },
  {
    caso: 0,
    status: "Aberto",
    reclamante: "Matheus V.",
    reclamado: "",
    data: "20/11/2024"
  },
  {
    caso: 0,
    status: "",
    reclamante: "Jonas Alberto",
    reclamado: "Empresas LTDA",
    data: "22/10/2024"
  },
  {
    caso: 0,
    status: "Andamento",
    reclamante: "Kaká Bueno",
    reclamado: "Mc",
    data: "09/06/2024"
  },
  {
    caso: 0,
    status: "Andamento",
    reclamante: "Ana Carla",
    reclamado: "Caixa",
    data: ""
  },
  {
    caso: 0,
    status: "Aberto",
    reclamante: "Matheus V.",
    reclamado: "",
    data: "20/11/2024"
  },
  {
    caso: 0,
    status: "",
    reclamante: "Jonas Alberto",
    reclamado: "Empresas LTDA",
    data: "22/10/2024"
  },
  {
    caso: 0,
    status: "Incompleto",
    reclamante: "Kaká Bueno",
    reclamado: "Mc",
    data: "09/06/2024"
  }
];

const itemsPag = 9;

export default function Page({ info }: { info: Info[] }) {

  const [proxPag, setProxPag] = useState(1);

  const totalPages = Math.ceil(processos.length / itemsPag);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setProxPag(page);
    }
  };

  const paginatedData = processos.slice(
    (proxPag - 1) * itemsPag,
    proxPag * itemsPag
  );

  return (
    <div className="flex flex-col">
      <NavBar
        botaoVoltar={
          <Link className="p-0 m-0 flex items-center" href="/">
            <Button size="icon" className="bg-[#030430] hover:bg-gray-500">
              <ChevronLeft style={{ width: "35px", height: "35px" }} className=""></ChevronLeft>
            </Button>
          </Link>
        }
        nome={"Processos"}
        botaoMenu={
          <Button size="icon" className="bg-[#030430] hover:bg-gray-500 p-6">
            <MenuIcon style={{ width: "35px", height: "35px" }} className="text-white"></MenuIcon>
          </Button>
        }
      />
      <div className="flex justify-between m-8 mb-16">
        <div className="flex items-center justify-center">
          <Input icon={
            <Button variant="ghost" size="icon" className="pt-1 hover:bg-transparent focus:ring-0">
              <Search style={{ width: "28px", height: "28px" }} className="text-gray-500"></Search>
            </Button>
          } className="md:w-[400px] px-14 py-4 text-xl text-start h-12 bg-[#D9D9D9]" placeholder="Buscar Processo..." />
        </div>
        <Button className="bg-green-600 hover:bg-green-900 gap-2 p-6 text-base">
          Adicionar Novo
          <CirclePlus size="icon" style={{ width: "25px", height: "25px" }} className="text-white" />
        </Button>
      </div>

      {processos && processos.length > 0 ?
        <div className="grid grid-cols-1 md:grid-cols-3">
          {paginatedData.map((processos: Info, index: number) => {

            const caso = (proxPag - 1) * itemsPag + index + 1;
            const status = processos.status || "Indefinido";
            const reclamante = processos.reclamante || "Sem anexo";
            const reclamado = processos.reclamado || "Sem anexo";
            const data = processos.data || "Sem anexo";

            const statusProcesso = processos.status === "Aberto"
              ? "text-green-500" : processos.status === "Andamento"
                ? "text-yellow-500" : processos.status === "Incompleto"
                  ? "text-red-500" : "text-gray-500"
            return (
              <div className="w-full pl-5 pb-5 pr-5" key={index}>
                <Card>
                  <CardHeader className="">
                    <CardTitle className="flex justify-between bg-[#030430] text-white px-4 py-1 rounded-tl-lg rounded-br-lg font-semibold leading-none tracking-tight text-base">
                      Caso Nº {caso}
                      <div className="flex flex-row items-center font-extralight italic">
                        <Circle size={14} className={`${statusProcesso} fill-current mr-2`}></Circle>
                        {status}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-[#555555] font-light">
                    <div>
                      <p className="text-[#030430] font-semibold">Reclamante: <span className="font-light">{reclamante}</span></p>
                      <p className="text-[#030430] font-semibold">Reclamado: <span className="font-light">{reclamado}</span></p>
                      <div className="flex justify-between text-[#030430]">
                        <p className="text-[#030430] font-semibold">Data Início: <span className="font-light">{data}</span></p>
                        <span className="underline cursor-pointer"><VisualizarCaso /></span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div> : (
          <div className="flex flex-col items-center m-20 text-[#030430] font-semibold">
            <h1>Não há processos no momento</h1>
            <p>Adicione para uma visualização</p>
          </div>
        )}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => handlePageChange(proxPag - 1)}
              className={proxPag === 1 || processos.length === 0 ? "cursor-not-allowed text-gray-400" : "cursor-pointer"}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, pageIndex) => (
            <PaginationItem key={pageIndex}>
              <PaginationLink
                href="#"
                onClick={() => handlePageChange(pageIndex + 1)}
                className={proxPag === pageIndex + 1 ? "active" : "Sem mais processos"}
              >
                {pageIndex + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => handlePageChange(proxPag + 1)}
              className={proxPag === totalPages || processos.length === 0 ? "cursor-not-allowed text-gray-400" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

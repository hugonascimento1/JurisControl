"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { MenuIcon, ChevronLeft, Circle, Search, CirclePlus, BinocularsIcon } from "lucide-react";
import Link from "next/link";

// import VisualizarCaso from "@/components/visualizarCaso";
import NavBar from "@/components/navbar";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";

import { processos, InfoProcesso } from "./processosData";

const itemsPag = 5;

export default function Page() {
  const router = useRouter();
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

  const handleCadastroProcesso = () => {
    router.push('/inicio/processos/cadastro-processo')
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <NavBar
        botaoVoltar={
          <Link className="p-0 m-0 flex items-center" href="/inicio">
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

      <div className="flex flex-col gap-4 md:flex-row justify-between items-start md:items-center m-8 mb-10 w-11/12">
        <div className="flex items-center justify-center">
          <Input icon={
            <Button variant="ghost" size="icon" className="pt-1 hover:bg-transparent shadow-none focus:ring-0">
              <Search style={{ width: "20px", height: "20px" }} className="text-gray-500 "></Search>
            </Button>
          } className="md:w-[400px] pl-14 py-4 text-xl text-start h-10 border-gray-300 border-2" placeholder="Buscar Processo..." />
        </div>
        <Button
          onClick={handleCadastroProcesso}
          className="bg-green-600 hover:bg-green-900 gap-2 p-6 text-base">
          Cadastrar novo
          <CirclePlus size="icon" style={{ width: "25px", height: "25px" }} className="text-white" />
        </Button>
      </div>

      <div className="w-11/12 mb-3">
        <Table className="border rounded-2xl">
          <TableHeader className="bg-[#030430]">
            <TableRow>
              <TableHead className="text-white text-lg font-semibold">N° Processo</TableHead>
              <TableHead className="text-white text-lg font-semibold">Identificação</TableHead>
              <TableHead className="text-white text-lg font-semibold">Última Atualização</TableHead>
              <TableHead className="text-white text-lg font-semibold">Tribunal</TableHead>
              <TableHead className="text-white text-lg font-semibold">Autor</TableHead>
              <TableHead className="text-white text-lg font-semibold">Advogado</TableHead>
              
              <TableHead className="text-white text-lg font-semibold">Status</TableHead>
              <TableHead className="text-white w-24 text-lg font-semibold">Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((processo, index) => (
              <TableRow key={index}>
                  <TableCell>{processo.numeroProcesso}</TableCell>
                  <TableCell>{processo.nomeProcesso}</TableCell>
                  <TableCell>{processo.ultimaAtualizacao}</TableCell>
                  <TableCell>{processo.tribunal}</TableCell>
                  <TableCell>{processo.autor}</TableCell>
                  <TableCell>{processo.advogado}</TableCell>
                  <TableCell
                    className={
                      processo.status === "Concluído"
                      ? "text-green-600 font-semibold"
                      : processo.status === "Em Andamento"
                      ? "text-yellow-600 font-semibold"
                      : "text-gray-600 font-semibold"
                    }
                  >
                    {processo.status}
                  </TableCell>
                  <TableCell>
                    <Link href={`/inicio/processos/${processo.numeroProcesso}`}>
                      <Button variant="outline">
                        <BinocularsIcon />
                      </Button>
                    </Link>
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <Pagination className="mb-7">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => handlePageChange(proxPag - 1)}
              className={
                proxPag === 1 || processos.length === 0
                ? "cursor-not-allowed text-gray-400"
                : "cursor-pointer"
              }
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, pageIndex) => (
            <PaginationItem key={pageIndex}>
              <PaginationLink
                href="#"
                onClick={() => handlePageChange(pageIndex + 1)}
                className={proxPag === pageIndex + 1 ? "active" : ""}
              >
                {pageIndex + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext 
              href="#"
              onClick={() => handlePageChange(proxPag + 1)}
              className={
                proxPag === totalPages || processos.length === 0
                ? "cursor-not-allowed text-gray-400"
                : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

    </div>
  )
}
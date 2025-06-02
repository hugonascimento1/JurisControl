"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import NavBar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MenuIcon, ChevronLeft, Search, CirclePlus, BinocularsIcon, Loader2, SquareArrowOutUpRightIcon } from "lucide-react";
import { toast, ToastContainer, ToastPosition } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { withAuth } from "@/utils/withAuth";

// import { processos, InfoProcesso } from "./processosData";

const itemsPag = 10;

// interface para representar o processo simplificado que aparece na tabela
interface ProcessoSimples {
  id: number;
  numeroProcesso: string;
  vara: string;
  classeTipo: string;
  assuntosTitulo: string;
  comarcaUF: string;
  status: string;
  nomeAutor: string;
  telefoneCliente: string;
  advogadoAutor: string;
  nomeReu: string;
  advogadoReu: string;
  advogadoId: number;
}

// interface para a resposta da API contendo o advogado e seus processos simplificados
interface AdvogadoProcessosResponse {
  id: number;
  nome: string;
  email: string;
  registroOAB: string;
  processos: ProcessoSimples[];
}

function Page() {
  const router = useRouter();
  const [proxPag, setProxPag] = useState(1);
  const [processos, setProcessos] = useState<ProcessoSimples[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [advogadoId, setAdvogadoId] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

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

  useEffect(() => {
    const id = sessionStorage.getItem('advogadoId');
    const token = sessionStorage.getItem('authToken');
    if (id) {
      setAdvogadoId(id);
    }
    if (token) {
      setAuthToken(token);
    }

  }, []);

  // Método 'GET' de processos do advogado (processos criados pelo advogado)
  useEffect(() => {
    const fetchProcessosAdvogado = async () => {
      if (!advogadoId || !authToken) {
        console.warn('Id do advogado ou token não encontrados. Redirecionando para login');
        router.push('/login');
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<AdvogadoProcessosResponse>(
          `https://backendjuriscontrol.onrender.com/api/buscar-advogado/${advogadoId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setProcessos(response.data.processos || []);
        if (response.data.processos.length === 0) {
          toast.info("Não foram encontrados processos para este advogado.", toastOptions)
        }
      } catch (error: any) {
        let errorMessage = 'Erro ao buscar processos.';
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            errorMessage = 'Não foram encontrados processos para este advogado.';
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
        }
        setError(errorMessage);
        toast.error(errorMessage, toastOptions);
      } finally {
        setLoading(false);
      }
    };

    if (advogadoId && authToken) {
      fetchProcessosAdvogado();
    }
  }, [advogadoId, authToken, router]);

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
      />

      <div className="flex flex-col gap-4 md:flex-row justify-between items-start md:items-center m-8 mb-5 w-11/12">
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
        <Table className="border shadow-3xl rounded-2xl">
          <TableHeader className="bg-[#030430]">
            <TableRow>
              <TableHead className="text-white text-lg font-semibold">N° Processo</TableHead>
              <TableHead className="text-white text-lg font-semibold">Assunto</TableHead>
              <TableHead className="text-white text-lg font-semibold">Classe</TableHead>
              <TableHead className="text-white text-lg font-semibold">Cliente</TableHead>
              <TableHead className="text-white text-lg font-semibold">Vara</TableHead>
              <TableHead className="text-white text-lg font-semibold">Comarca/UF</TableHead>
              <TableHead className="text-white text-lg font-semibold">Status</TableHead>
              <TableHead className="text-white w-24 text-lg font-semibold">Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <Loader2 className="animate-spin h-6 w-6 mx-auto text-gray-500" />
                  <p className="mt-2 text-gray-500">Carregando processos...</p>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-red-500 py-8">
                  {error}
                </TableCell>
              </TableRow>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((processo, index) => (
                <TableRow key={index} className="">
                  <TableCell className="py-0">{processo.numeroProcesso}</TableCell>
                  <TableCell className="py-0">{processo.assuntosTitulo}</TableCell>
                  <TableCell className="py-0">{processo.classeTipo}</TableCell>
                  <TableCell className="py-0">{processo.nomeAutor}</TableCell>
                  <TableCell className="py-0">{processo.vara}</TableCell>
                  <TableCell className="py-0">{processo.comarcaUF}</TableCell>
                  <TableCell
                    className={
                      processo.status === "Criado"
                        ? "bg-green-500 text-white rounded-lg my-3 py-2 px-2 font-semibold text-center flex items-center justify-center"
                      : processo.status === "Em Andamento"
                        ? "bg-amber-400 text-white rounded-lg my-3 py-2 px-2 font-semibold text-center flex items-center justify-center"
                      : processo.status === "Finalizado"
                        ? "bg-stone-500 text-white rounded-lg my-3 py-2 px-2 font-semibold text-center flex items-center justify-center"
                      : "bg-black text-white rounded-lg my-3 py-2 px-2 font-semibold text-center flex items-center justify-center"                                                           
                    }
                  >
                    {processo.status}
                  </TableCell>
                  <TableCell className="py-0">
                    <Link href={`/inicio/processos/${processo.id}`}>
                      <Button variant="outline">
                        <SquareArrowOutUpRightIcon />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
          ))
          ) : (
          <TableRow>
            <TableCell colSpan={8} className="text-center text-gray-500 py-8">
              Nenhum processo encontrado.
            </TableCell>
          </TableRow>
            )}
        </TableBody>
      </Table>
    </div>

      {/* Paginação */ }
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

    </div >
  )
}

export default withAuth(['advogado'])(Page);

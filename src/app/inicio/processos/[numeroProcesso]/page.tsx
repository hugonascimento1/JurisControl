"use client";
import { useParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, FilePenLine } from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/navbar";
import { movimentos } from "../movimentosData"; // Lista de movimentos
import { processos } from "../processosData"; // Lista de processos

export default function Page() {
  const params = useParams();
  const { numeroProcesso } = params;

  // Buscar o processo pelo número na lista de processos
  const processo = processos.find((p) => p.numeroProcesso === numeroProcesso);

  // Buscar os movimentos relacionados a esse processo
  const movimentosProcesso = movimentos.filter(
    (m) => m.numeroProcesso === numeroProcesso
  );

  if (!processo) {
    return (
      <div className="text-center p-10">
        <h1 className="text-2xl font-bold">Processo não encontrado</h1>
        <Link href="/inicio/processos">
          <Button className="mt-5 bg-[#030430] hover:bg-gray-500">
            Voltar para a lista
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="justify-center items-center">
      <NavBar
        nome="Detalhes do Processo"
        botaoVoltar={
          <Link className="p-0 m-0 flex items-center" href="/inicio/processos">
            <Button size="icon" className="bg-[#030430] hover:bg-gray-500">
              <ChevronLeftIcon style={{ width: "35px", height: "35px" }} />
            </Button>
          </Link>
        }
      />
      <div className="relative w-full flex justify-end pr-5">
        <Button size="icon" className="bg-gray-500 hover:bg-gray-600 w-14 h-14">
          <FilePenLine className="w-9 h-9" />
        </Button>
      </div>

      <div className="p-5 flex flex-col justify-center items-center gap-2 sm:flex-row h-auto">
        <Card className="w-full md:w-1/3 h-[600px] overflow-y-auto">
          <CardHeader className="bg-[#030430] justify-center h-14 rounded-t-lg text-white items-start">
            <CardTitle className="text-lg">Movimentos</CardTitle>
          </CardHeader>
          <CardContent className="h-full mt-5">
            {movimentosProcesso.length > 0 ? (
              movimentosProcesso.map((movimento, index) => (
                <Card key={index} className="mt-5 w-full h-auto">
                  <CardHeader>
                    <CardTitle>{movimento.nomeMovimento}</CardTitle>
                    <CardDescription className="text-sm">
                      {movimento.atualizacaoMovimento}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-0">
                    {movimento.descricaoMovimento}
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500">
                Nenhum movimento encontrado
              </p>
            )}
          </CardContent>
        </Card>

        {/* Card de Detalhes do Processo */}
        <Card className="w-full md:w-2/3 h-[600px]">
          <CardHeader className="bg-[#030430] justify-center h-14 rounded-t-lg text-white items-start">
            <CardTitle className="text-lg">
              Processo N° {processo.numeroProcesso}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 mt-5 w-full grid grid-cols-2 gap-4">
            <Card className="bg-slate-100 shadow">
              <CardContent className="p-2">
                <p className="text-sm text-gray-500 font-semibold">Processo</p>
                <p className="text-base font-medium">{processo.nomeProcesso}</p>
              </CardContent>
            </Card>

            {/* Mini Card: Autor */}
            <Card className="bg-slate-100 shadow">
              <CardContent className="p-2">
                <p className="text-sm text-gray-500 font-semibold">Autor</p>
                <p className="text-base font-medium">{processo.autor}</p>
              </CardContent>
            </Card>

            {/* Mini Card: Réu */}
            <Card className="bg-slate-100 shadow">
              <CardContent className="p-2">
                <p className="text-sm text-gray-500 font-semibold">Réu</p>
                <p className="text-base font-medium">{processo.advogado}</p>
              </CardContent>
            </Card>

            {/* Mini Card: Tribunal */}
            <Card className="bg-slate-100 shadow">
              <CardContent className="p-2">
                <p className="text-sm text-gray-500 font-semibold">Tribunal</p>
                <p className="text-base font-medium">{processo.tribunal}</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-100 shadow">
              <CardContent className="p-2">
                <p className="text-sm text-gray-500 font-semibold">Processo</p>
                <p className="text-base font-medium">{processo.status}</p>
              </CardContent>
            </Card>

            {/* Mini Card: Data de Início */}
            <Card className="bg-slate-100 shadow">
              <CardContent className="p-2">
                <p className="text-sm text-gray-500 font-semibold">
                  Ultima Atualização
                </p>
                <p className="text-base font-medium">
                  {processo.ultimaAtualizacao}
                </p>
              </CardContent>
            </Card>
          </CardContent>
          <CardContent className="p-0 m-0">
            <CardHeader className="bg-[#030430] justify-center h-14  text-white items-start">
              <CardTitle className="text-lg">
                Arquivos Anexados
              </CardTitle>
            </CardHeader>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, FilePenLine } from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/navbar";
import { movimentos } from "../../movimentosData"; // Lista de movimentos
import { processos } from "../../processosData"; // Lista de processos
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Page() {
  const params = useParams();
  const { numeroProcesso } = params;

  // Buscar o processo pelo número na lista de processos
  const processoOriginal = processos.find(
    (p) => p.numeroProcesso === numeroProcesso
  );

  // Estado para armazenar as alterações feitas no processo
  const [processo, setProcesso] = useState(processoOriginal);

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
        <EditarProcessoModal
          processo={processo}
          onSave={(data) => {
            setProcesso(data); // Atualiza o estado com os novos dados
          }}
        />
      </div>

      <div className="p-5 flex flex-col justify-center items-center gap-2 sm:flex-row h-auto">
        {/* Movimentos */}
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

        {/* Detalhes do Processo */}
        <Card className="w-full md:w-2/3 h-[600px]">
          <CardHeader className="bg-[#030430] justify-center h-14 rounded-t-lg text-white items-start">
            <CardTitle className="text-lg">
              Processo N° {processo.numeroProcesso}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 mt-5 w-full bg-slate-200 grid grid-cols-2 gap-4">
            {[
              { label: "Nome do Processo", value: processo.nomeProcesso },
              { label: "Autor", value: processo.autor },
              { label: "Tribunal", value: processo.tribunal },
              { label: "Status", value: processo.status },
              { label: "Última Atualização", value: processo.ultimaAtualizacao },
            ].map((item, index) => (
              <Card key={index} className="bg-slate-100 shadow">
                <CardContent className="p-2">
                  <p className="text-sm text-gray-500 font-semibold">
                    {item.label}
                  </p>
                  <p className="text-base font-medium">{item.value}</p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Componente Modal de Edição
function EditarProcessoModal({ processo, onSave }: { processo: any, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({ ...processo });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" className="bg-gray-500 hover:bg-gray-600 w-14 h-14">
          <FilePenLine className="w-9 h-9" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Processo</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {[
            { name: "nomeProcesso", label: "Nome do Processo" },
            { name: "autor", label: "Autor" },
            { name: "reu", label: "Réu" },
            { name: "tribunal", label: "Tribunal" },
            { name: "status", label: "Status" },
          ].map((field, index) => (
            <div key={index}>
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

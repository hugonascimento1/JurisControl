'use client';

import NavBar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationLink,
    PaginationNext,
    PaginationEllipsis
} from "@/components/ui/pagination";
import { 
    Table,
    TableBody,
    TableCaption,
    TableHead,
    TableRow,
    TableHeader,
    TableFooter,
    TableCell 
} from "@/components/ui/table";
import { 
    CirclePlus, 
    Edit, 
    Search, 
    Trash2 
} from "lucide-react";
import { 
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter 
} from "@/components/ui/dialog";
import { withAuth } from "@/utils/withAuth";

const advogados = [
    {
        nome: "Maria Oliveira",
        inscricao_oab: "123456/PR",
        cpf: "111.222.333-44",
        senha: "Maria2024!"
    },
    {
        nome: "Carlos Souza",
        inscricao_oab: "654321/RJ",
        cpf: "555.666.777-88",
        senha: "Carlos@123"
    },
    {
        nome: "Ana Martins",
        inscricao_oab: "987654/SP",
        cpf: "999.888.777-66",
        senha: "Ana#Martins"
    },
    {
        nome: "João Lima",
        inscricao_oab: "135792/RS",
        cpf: "444.555.666-77",
        senha: "Joao!Lima456"
    },
    {
        nome: "Beatriz Silva",
        inscricao_oab: "246813/MG",
        cpf: "222.333.444-55",
        senha: "BeaSilva@2024"
    },
    {
        nome: "Beatriz Silva",
        inscricao_oab: "246813/MG",
        cpf: "222.333.444-55",
        senha: "BeaSilva@2024"
    },
]

function Page() {
    return (
        <div>
            <NavBar nome={"Advogados"}  botaoVoltar />

            <div className="m-2">
                <div className="m-2 mb-6 flex justify-between">
                    <div className="flex items-center space-x-2">
                        <Search className=" text-gray-500" />
                        <Input 
                            className=" md:w-[400px]"
                            placeholder={"Buscar Advogado"}
                        />
                    </div>
                    <Button className=" bg-green-600 hover:bg-green-900 gap-2 p-6">
                        Novo Advogado
                        <CirclePlus className="text-white" />
                    </Button>
                </div>
                
                <Card className="m-2 p-3">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">Nome</TableHead>
                                <TableHead>Inscrição</TableHead>
                                <TableHead>CPF</TableHead>
                                <TableHead>Senha</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {advogados.map((advogado) => (
                                <TableRow key={advogado.cpf}>
                                    <TableCell className="font-medium">{advogado.nome}</TableCell>
                                    <TableCell>{advogado.inscricao_oab}</TableCell>
                                    <TableCell>{advogado.cpf}</TableCell>
                                    <TableCell>{advogado.senha}</TableCell>
                                    <TableCell>
                                        <Button variant="outline">
                                            <Edit className="text-gray-600"  />
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline">
                                                    <Trash2 className="text-gray-600" />
                                                </Button>                
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                <DialogTitle className="flex justify-center font-bold text-xl text-[#030430]">Excluir Advogado(a)</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <h1 className="text-center">Você tem certeza que quer excluir o(a) Dr.(a)  do sistema de Câmara Arbitral</h1>
                                                    <strong className="text-[#030430] text-xl text-center">{advogado.nome}</strong>
                                                    <h1 className="text-center">do sistema de Câmara Arbitral</h1>
                                                </div>
                                                <DialogFooter className="flex flex-row gap-2 justify-end">
                                                    <Button variant="outline" className="">Cancelar</Button>
                                                    <Button type="submit" className="text-white bg-red-600 hover:bg-red-900">Excluir</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>    
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                <Pagination className="mt-8">
                    <PaginationContent>
                        <PaginationItem>
                        <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                        <PaginationLink href="#" isActive>
                            2
                        </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                        <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                        <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}

export default withAuth(['administrador'])(Page);

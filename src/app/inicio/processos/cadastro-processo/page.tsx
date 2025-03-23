'use client'

import NavBar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeftIcon, Trash2Icon } from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"

/* Algumas informações importantes:
    No SELETOR DE TRIBUNAL deve ser feita a logica para o funcionamento 
    da API pois a API só funciona para a busca do processo e o endpoint 
    do processo estiver correto, então, cada tribunal tem seu próprio 
    endpoint para buscar os processos, e se o processo não pretence ao 
    tribunal indicado ele não vai encontrar 
*/

/*O que a gente consegue pegar na API:

- numeroProcesso > "072239914020178070001"
- classe > nome > "Exceução fiscal"
- ########## sistema > nome > "Pje"
- ########## formato > nome > "Eletrônico"
- tribunal > "TJDFT"
- dataHoraUltimaAtualizacao > "2025-02-12T01:01:06.608582388Z"
- dataAjuizamento > "2017-08-221T10:05:32.000Z"
- movimentos > complementosTabelados > nome > "sorteio", descricao > "tipo_de_distribuicao_redistribuicao"
- movinetos complementosTabelados > nome > "Distribuição", dataHora > "2017-08-21T10:05:32.000Z"
- assuntos > nome > "Dívida Ativa (Execução Fiscal)"

*/

export default function Page() {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const newFiles = Array.from(event.target.files);
            setUploadedFiles([...uploadedFiles, ...newFiles]);
        }
    };

    const handleRemoveFile = (index: number) => {
        setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col justify-center items-center mb-7">
            <NavBar
                nome="Cadstro de processo"
                botaoVoltar={
                    <Link className="p-0 m-0 flex items-center" href="/inicio">
                        <Button size="icon" className="bg-[#030430] hover:bg-gray-500">
                            <ChevronLeftIcon style={{ width: "35px", height: "35px" }} className=""></ChevronLeftIcon>
                        </Button>
                    </Link>
                } />

            <Card className="w-11/12">
                <CardHeader className="bg-[#030430] h-16 justify-center rounded-t-lg text-white items-start mb-6">
                    <CardTitle className="text-xl">Preencha as informações do processo</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col justify-center gap-3 items-center">
                        <Card className="w-full">
                            <CardHeader className="bg-[#030430] justify-center h-14 rounded-t-lg text-white items-start">
                                <CardTitle className="text-lg">Entrada de dados</CardTitle>
                                {/* <CardDescription className="text-gray-200">Selecione o tribunal, insira o número do processo e clique em carregar dados.</CardDescription> */}
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-6 mt-5">

                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:grid-cols-2">

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Tribunal</Label>
                                            <Select>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Escolha um Tribunal" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Tribunal</SelectLabel>
                                                        <SelectItem value="tribunal1">Tribunal Superior do Trabalho</SelectItem>
                                                        <SelectItem value="tribunal2">Tribunal Superior Eleitoral</SelectItem>
                                                        <SelectItem value="tribunal3">Tribunal Superior de Justiça</SelectItem>
                                                        <SelectItem value="tribunal4">Tribunal Superior Militar</SelectItem>
                                                        <SelectItem value="tribunal5">Tribunal Superior do Trabalho</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Número</Label>
                                            <Input
                                                type="text"
                                                placeholder="Número do processo"
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Classe</Label>
                                            <Input
                                                type="text"
                                                placeholder="Ex: Execução Fiscal"
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Assuntos</Label>
                                            <Input
                                                type="text"
                                                placeholder="Ex: Dívida Ativa (Execução Fiscal)"
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Data/Hora Última Atuali.</Label>
                                            <Input
                                                type="datetime-local"
                                                placeholder=""
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Data Ajuizamento</Label>
                                            <Input
                                                type="datetime-local"
                                                placeholder=""
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col h-[200px] gap-2 overflow-y-auto">
                                        <Label className="text-base">Movimentos</Label>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Movimentos</TableHead>
                                                    <TableHead>Data/Hora</TableHead>
                                                    <TableHead>Complemento</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {/* <TableRow>
                                                    <TableCell>Distribuição</TableCell>
                                                    <TableCell>21/08/2017 10:05</TableCell>
                                                    <TableCell>Tipo de distribuição: Sorteio</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Conclusão</TableCell>
                                                    <TableCell>16/02/2018 17:57</TableCell>
                                                    <TableCell>Tipo de conclusão: Para despacho</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Documento</TableCell>
                                                    <TableCell>17/09/2019 08:51</TableCell>
                                                    <TableCell>Tipo de documento: Mandado</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Expedição de documento</TableCell>
                                                    <TableCell>17/09/2019 08:51</TableCell>
                                                    <TableCell>Tipo de documento: Mandado</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Expedição de documento</TableCell>
                                                    <TableCell>17/09/2019 08:51</TableCell>
                                                    <TableCell>Tipo de documento: Aviso de recebimento (AR)</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Documento</TableCell>
                                                    <TableCell>27/09/2019 10:40</TableCell>
                                                    <TableCell>Tipo de documento: Certidão</TableCell>
                                                </TableRow> */}
                                            </TableBody>
                                        </Table>
                                    </div>

                                </div>
                            </CardContent>
                        </Card>

                        <Card className="w-full">
                            <CardHeader className="bg-[#030430] h-14 justify-center rounded-t-lg text-white items-start">
                                <CardTitle className="text-lg">Detalhamento do Processo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-6 mt-5">
                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 sm:grid-cols-2">

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Autor</Label>
                                            <Input
                                                type="text"
                                                placeholder="Nome do autor"
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Advogado do Autor</Label>
                                            <Input
                                                type="text"
                                                placeholder="Nome do Advogado do autor"
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Réu</Label>
                                            <Input
                                                type="text"
                                                placeholder="Nome do réu"
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Advogado Réu</Label>
                                            <Input
                                                type="text"
                                                placeholder="Nome do Advogado do réu"
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">CPF</Label>
                                            <Input
                                                type="text"
                                                placeholder="CPF do cliente"
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Telefone</Label>
                                            <Input
                                                type="tel" 
                                                id="phone" 
                                                name="phone" 
                                                // pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                                                placeholder="Telefone do cliente"
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Email</Label>
                                            <Input
                                                type="email"
                                                placeholder="Email do cliente"
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">CEP</Label>
                                            <Input
                                                type="text"
                                                placeholder="CEP do cliente"
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Rua</Label>
                                            <Input
                                                type="text"
                                                placeholder="Rua do cliente"
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Número</Label>
                                            <Input
                                                type="text"
                                                placeholder="Número da casa do cliente"
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Bairro</Label>
                                            <Input
                                                type="text"
                                                placeholder="Bairro do cliente"
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Cidade</Label>
                                            <Input
                                                type="text"
                                                placeholder="Cidade do cliente"
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Estado</Label>
                                            <Select>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Escolha um Estado" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Estado</SelectLabel>
                                                        <SelectItem value="ac">Acre</SelectItem>
                                                        <SelectItem value="al">Alagoas</SelectItem>
                                                        <SelectItem value="ap">Amapá</SelectItem>
                                                        <SelectItem value="am">Amazonas</SelectItem>
                                                        <SelectItem value="ba">Bahia</SelectItem>
                                                        <SelectItem value="ce">Ceará</SelectItem>
                                                        <SelectItem value="df">Distrito Federal</SelectItem>
                                                        <SelectItem value="es">Espírito Santo</SelectItem>
                                                        <SelectItem value="go">Goiás</SelectItem>
                                                        <SelectItem value="ma">Maranhão</SelectItem>
                                                        <SelectItem value="mt">Mato Grosso</SelectItem>
                                                        <SelectItem value="ms">Mato Grosso do Sul</SelectItem>
                                                        <SelectItem value="mg">Minas Gerais</SelectItem>
                                                        <SelectItem value="pa">Pará</SelectItem>
                                                        <SelectItem value="pb">Paraíba</SelectItem>
                                                        <SelectItem value="pr">Paraná</SelectItem>
                                                        <SelectItem value="pe">Pernambuco</SelectItem>
                                                        <SelectItem value="pi">Piauí</SelectItem>
                                                        <SelectItem value="rj">Rio de Janeiro</SelectItem>
                                                        <SelectItem value="rn">Rio Grande do Norte</SelectItem>
                                                        <SelectItem value="rs">Rio Grande do Sul</SelectItem>
                                                        <SelectItem value="ro">Rondônia</SelectItem>
                                                        <SelectItem value="rr">Roraima</SelectItem>
                                                        <SelectItem value="sc">Santa Catarina</SelectItem>
                                                        <SelectItem value="sp">São Paulo</SelectItem>
                                                        <SelectItem value="se">Sergipe</SelectItem>
                                                        <SelectItem value="to">Tocantins</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="w-full">
                            <CardHeader className="bg-[#030430] justify-center h-14 rounded-t-lg text-white items-start">
                                <CardTitle className="text-lg">Anexar Documentos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-4 mt-5">
                                    <div className="flex items-center gap-2">
                                        <Input type="file" id="fileUpload" className="hidden" onChange={(e) => handleFileChange(e)} />
                                        <Label htmlFor="fileUpload" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded">
                                            Selecionar Arquivo
                                        </Label>
                                    </div>
                                    {uploadedFiles.length > 0 && (
                                        <div>
                                            <Label className="text-lg ">Arquivos Anexados:</Label>
                                            <ul>
                                                {uploadedFiles.map((file, index) => (
                                                    <li key={index} className="flex items-center justify-between text-gray-600 mb-2">
                                                        {file.name}
                                                        <Button className="w-6 h-6" variant='outline' size='icon' onClick={() => handleRemoveFile(index)}>
                                                            <Trash2Icon />
                                                        </Button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-row justify-end gap-2 items-center mt-5">
                        <Button variant="outline" className="bg-gray-200 h-11 w-24">Cancelar</Button>
                        <Button className="bg-green-600 h-11 w-24">Salvar</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

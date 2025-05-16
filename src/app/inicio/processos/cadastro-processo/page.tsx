'use client'

// mudar a logica para o cadastro de movimentos, colocar algo
// como uma lista e poder ir adicionando mais um movimento
// parecido com a logica para os anexos

import React, { useEffect, useState } from "react"
import Link from "next/link"

import NavBar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    ChevronLeftIcon,
    Trash2Icon
} from "lucide-react"

interface Tribunal {
    id: number;
    nome: string;
    endpoint: string;
}

export default function Page() {
    const [advogadoNome, setAdvogadoNome] = useState<string | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    
    const [tribunais, setTribunais] = useState<Tribunal[]>([]);
    const [tribunalSelecionado, setTribunalSelecionado] = useState<string>('');

    const [numeroProcesso, setNumeroProcesso] = useState<string>('');
    const [classe, setClasse] = useState<string>('');
    const [assuntos, setAssuntos] = useState<string>('');
    const [dataHoraUltimaAtualizacao, setdataHoraUltimaAtualizacao] = useState<string>('');
    const [dataAjuizamento, setdataAjuizamento] = useState<string>('');
    const [movimentos, setMovimentos] = useState<any[]>([]);

    const url = process.env.NEXT_PUBLIC_URL_TRIBUNAIS!;
    const token = process.env.NEXT_PUBLIC_TOKEN_TRIBUNAIS;

    useEffect(() => {
        setAdvogadoNome(sessionStorage.getItem('advogadoNome'));
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                })
                const data = await response.json();
                setTribunais(data.results);
            } catch (error) {
                console.error('Erro ao buscar tribunais', error)
            }
        };

        fetchData();
    }, []); 

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const newFiles = Array.from(event.target.files);
            setUploadedFiles([...uploadedFiles, ...newFiles]);
        }
    };

    const handleRemoveFile = (index: number) => {
        setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
    };

    // const buscarDadosProcesso = async () => {
    //     try {
    //         const response = await fetch(tribunalSelecionado, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ numeroProcesso: numeroProcesso }).
    //         });

    //         if (!response.ok) {
    //             throw new Error(`Erro na requisição: ${response.status}`);
    //         }

    //         const data = await response.json();
    //         const processo = data.hits.hits[0]._source;

    //         setClasse(processo.classe.nome);
    //         setAssuntos(processo.assuntos.map((assunto) => assunto.nome).join(', '));
    //         setdataHoraUltimaAtualizacao(processo.dataHoraUltimaAtualizacao);
    //         setdataAjuizamento(processo.dataAjuizamento);
    //         setMovimentos(processo.movimentos);
    //     } catch (error) {
    //         console.error('Erro ao buscar dados do processo:', error)
    //         alert(error);
    //     }
    // };

    return (
        <div className="flex flex-col justify-center items-center mb-3">
            <NavBar
                nome="Cadastro de processo"
                botaoVoltar={
                    <Link className="p-0 m-0 flex items-center" href="/inicio/processos">
                        <Button size="icon" className="bg-[#030430] hover:bg-gray-500">
                            <ChevronLeftIcon style={{ width: "35px", height: "35px" }} className=""></ChevronLeftIcon>
                        </Button>
                    </Link>
                } />

            <Card className="w-[97%] border-none">
                {/* <CardHeader className="bg-[#030430] h-16 justify-center rounded-t-lg text-white items-start mb-6">
                    <CardTitle className="text-xl">Preencha as informações do processo</CardTitle>
                </CardHeader> */}
                <CardContent>
                    <div className="flex flex-col justify-center gap-3 items-center">
                        <Card className="w-full">
                            <CardHeader className="bg-[#030430] justify-center h-14 rounded-t-lg text-white items-start">
                                <CardTitle className="text-lg">Informações do Processo</CardTitle>
                                {/* <CardDescription className="text-gray-200">Selecione o tribunal, insira o número do processo e clique em carregar dados.</CardDescription> */}
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-6 mt-5">

                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:grid-cols-2">

                                        {/* <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Tribunal</Label>
                                            <Select onValueChange={setTribunalSelecionado}>
                                                <SelectTrigger className="w-full border-gray-300 border-2">
                                                    <SelectValue placeholder="Escolha um Tribunal" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Tribunal</SelectLabel>
                                                        {tribunais.map((tribunal) => (
                                                            <SelectItem className="text-black" key={tribunal.id} value={tribunal.endpoint}>
                                                                {tribunal.nome}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div> */}

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="numeroProcesso" className="text-base">Número do processo</Label>
                                            <Input
                                                type="text"
                                                id="numeroProcesso"
                                                value={numeroProcesso}
                                                onChange={(e) => setNumeroProcesso(e.target.value)}
                                                placeholder="0000001-23.2024.4.01.9000"
                                                className="w-full border-gray-300 border-2"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="vara" className="text-base">Vara</Label>
                                            <Input
                                                type="text"
                                                id="vara"
                                                // value={vara}
                                                placeholder=""
                                                className="w-full border-gray-300 border-2"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="classe" className="text-base">Classe (Tipo do processo)</Label>
                                            <Input
                                                type="text"
                                                id="classe"
                                                value={classe}
                                                placeholder="Ex: Execução Fiscal"
                                                className="w-full border-gray-300 border-2"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="assuntos" className="text-base">Assunto (Título)</Label>
                                            <Input
                                                type="text"
                                                id="assuntos"
                                                value={assuntos}
                                                placeholder="Ex: Dívida Ativa (Execução Fiscal)"
                                                className="w-full border-gray-300 border-2"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="assuntos" className="text-base">Comarca / UF</Label>
                                            <Input
                                                type="text"
                                                id="assuntos"
                                                // value={assuntos}
                                                placeholder=""
                                                className="w-full border-gray-300 border-2"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2 w-full">
                                        <Label htmlFor="text" className="text-base">Situação do Processo</Label>
                                        <Select defaultValue="iniciado">
                                            <SelectTrigger className="w-full border-gray-300 border-2">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Situação do Processo</SelectLabel>
                                                    <SelectItem value="iniciado">Iniciado</SelectItem>
                                                    <SelectItem value="distribuido">Distribuído</SelectItem>
                                                    <SelectItem value="emAndamento">Em Andamento</SelectItem>
                                                    <SelectItem value="aguardandoDecisao">Aguardando Decisão</SelectItem>
                                                    <SelectItem value="sentenciado">Sentenciado</SelectItem>
                                                    <SelectItem value="recursos">Recursos</SelectItem>
                                                    <SelectItem value="execucao">Execução</SelectItem>
                                                    <SelectItem value="suspenso">Suspenso</SelectItem>
                                                    <SelectItem value="concluido">Concluído</SelectItem>
                                                    <SelectItem value="arquivado">Arquivado</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                        

                                        {/* <div className="flex flex-col gap-2">
                                            <Label htmlFor="dataAjuizamento" className="text-base">Data Ajuizamento</Label>
                                            <Input
                                                type="datetime-local"
                                                id="dataAjuizamento"
                                                value={dataAjuizamento}
                                                placeholder=""
                                                className="w-full border-gray-300 border-2"
                                            />
                                        </div> */}

                                    </div>

                                    {/* <div className="flex flex-col h-[200px] gap-2 overflow-y-auto">
                                        <Label className="text-base">Movimentos</Label>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Movimento</TableHead>
                                                    <TableHead>Data/Hora</TableHead>
                                                    <TableHead>Complemento</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
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
                                                </TableRow>
                                            </TableBody>
                                        </Table>

                                    </div> */}

                                    

                                </div>
                            </CardContent>
                        </Card>

                        <Card className="w-full">
                            <CardHeader className="bg-[#030430] h-14 justify-center rounded-t-lg text-white items-start">
                                <CardTitle className="text-lg">Partes do Processo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-6 mt-5">
                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 sm:grid-cols-2">

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Cliente</Label>
                                            <Input
                                                type="text"
                                                placeholder="Nome do cliente"
                                                className="w-full border-gray-300 border-2"
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
                                                className="w-full border-gray-300 border-2" 
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Advogado do cliente</Label>
                                            <Input
                                                type="text"
                                                placeholder="Nome do Advogado do autor"
                                                className="w-full border-gray-300 border-2"
                                                defaultValue={advogadoNome ?? ''}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Parte Adversa</Label>
                                            <Input
                                                type="text"
                                                placeholder="Nome da parte Adversa"
                                                className="w-full border-gray-300 border-2"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Advogado parte Adversa</Label>
                                            <Input
                                                type="text"
                                                placeholder=""
                                                className="w-full border-gray-300 border-2"
                                            />
                                        </div>
                                        {/* <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">CPF</Label>
                                            <Input
                                                type="text"
                                                placeholder="CPF do cliente"
                                                className="w-full border-gray-300 border-2"
                                            />
                                        </div> */}
                                        
                                        {/* <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Email</Label>
                                            <Input
                                                type="email"
                                                placeholder="Email do cliente"
                                                className="w-full border-gray-300 border-2"
                                            />
                                        </div> */}

                                        {/* <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Rua</Label>
                                            <Input
                                                type="text"
                                                placeholder="Rua do cliente"
                                                className="w-full border-gray-300 border-2"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Número</Label>
                                            <Input
                                                type="text"
                                                placeholder="Número da casa do cliente"
                                                className="w-full border-gray-300 border-2"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Bairro</Label>
                                            <Input
                                                type="text"
                                                placeholder="Bairro do cliente"
                                                className="w-full border-gray-300 border-2"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Cidade</Label>
                                            <Input
                                                type="text"
                                                placeholder="Cidade do cliente"
                                                className="w-full border-gray-300 border-2"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Estado</Label>
                                            <Select>
                                                <SelectTrigger className="w-full border-gray-300 border-2">
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
                                        </div> */}

                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* <Card className="w-full">
                            <CardHeader className="bg-[#030430] justify-center h-14 rounded-t-lg text-white items-start">
                                <CardTitle className="text-lg">Anexar Documentos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-4 mt-5">
                                    <div className="flex items-center gap-2">
                                        <Input type="file" id="fileUpload" className="hidden " onChange={(e) => handleFileChange(e)} />
                                        <Label htmlFor="fileUpload" className="cursor-pointer shadow-lg bg-blue-500 text-white px-4 py-2 rounded">
                                            Selecionar Arquivo
                                        </Label>
                                    </div>
                                    {uploadedFiles.length > 0 && (
                                        <div>
                                            <Label className="text-lg font-semibold">Arquivos Anexados:</Label>
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
                        </Card> */}
                    </div>

                    <div className="flex flex-row justify-end gap-2 items-center mt-5">
                        <Button variant="outline" className="h-12 w-28 ">Cancelar</Button>
                        <Button className="bg-green-600 hover:bg-green-900 h-12 w-28 shadow-2xl">Cadastrar</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

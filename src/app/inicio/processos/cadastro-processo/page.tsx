import NavBar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
    return (
        <div className="flex flex-col justify-center items-center mb-7">
            <NavBar nome="Cadstro de processo" />

            <Card className="w-11/12">
                <CardHeader className="bg-[#030430] h-16 justify-center rounded-t-lg text-white items-start mb-6">
                    <CardTitle className="text-xl">Preencha as informações do processo</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col justify-center gap-3 items-center">
                        <Card className="w-full">
                            <CardHeader className="bg-[#030430] justify-center rounded-t-lg text-white items-start">
                                <CardTitle className="text-lg">Entrada de dados</CardTitle>
                                <CardDescription className="text-gray-200">Selecione o tribunal, insira o número do processo e clique em carregar dados.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-6 mt-5">
                                    {/* Parte 1 */}
                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:grid-cols-2">
                                        {/* Tribunal */}
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

                                        {/* Número */}
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Número</Label>
                                            <Input
                                                type="text"
                                                placeholder="Número do processo"
                                                className="w-full"
                                            />
                                        </div>

                                        {/* Classe */}
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Classe</Label>
                                            <Input
                                                type="text"
                                                placeholder="Ex: Execução Fiscal"
                                                className="w-full"
                                            />
                                        </div>

                                        {/* Assuntos */}
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Assuntos</Label>
                                            <Input
                                                type="text"
                                                placeholder="Ex: Dívida Ativa (Execução Fiscal)"
                                                className="w-full"
                                            />
                                        </div>

                                        {/* Data/Hora Última Atualização */}
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Data/Hora Última Atuali.</Label>
                                            <Input
                                                type="text"
                                                placeholder=""
                                                className="w-full"
                                            />
                                        </div>

                                        {/* Data Ajuizamento */}
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Data Ajuizamento</Label>
                                            <Input
                                                type="text"
                                                placeholder=""
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    {/* Div tabela */}
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
                                    </div>

                                    {/* Parte 2 */}
                                    {/* <div className="flex flex-col justify-start gap-4 items-center md:flex-row mt-5">

                                        

                                    </div> */}

                                    {/* Parte 3 */}
                                    {/* <div className="flex flex-col gap-4 md:flex-row">

                    
                                    </div> */}

                                </div>
                            </CardContent>
                        </Card>

                        <Card className="w-full">
                            <CardHeader className="bg-[#030430] h-14 justify-center rounded-t-lg text-white items-start">
                                <CardTitle className="text-lg">Detalhamento do Processo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Atributos Opcionais do processo
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

{/* <Button variant="secondary" className="bg-gray-300 text-gray-600">
                                            Carregar dados do processo
                                        </Button> */}
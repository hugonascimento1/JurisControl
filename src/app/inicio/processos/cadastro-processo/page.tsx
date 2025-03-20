import NavBar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

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
        <div className=" flex flex-col justify-center items-center mb-7">
            <NavBar nome="Cadstro de processo" />

            <Card className=" w-11/12">
                <CardHeader className=" bg-[#030430] text-white h-16 rounded-t-lg mb-6 justify-center items-start">
                    <CardTitle className="text-xl">Preencha as informações do processo</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col justify-center items-center gap-3">
                        <Card className=" w-full">
                            <CardHeader className=" bg-[#030430] text-white h-14 rounded-t-lg justify-center items-start">
                                <CardTitle className="text-lg">Entrada de dados</CardTitle>
                                {/* <CardDescription> nesta seção você deve informar o tribunal e o número do processo para buscarmos os dados do PJe</CardDescription> */}
                            </CardHeader>
                            <CardContent>
                                <div className=" mt-5">

                                    {/* Parte 1 */}
                                    <div className=" flex flex-col md:flex-row gap-4 justify-start items-center">
                                        <div className=" flex flex-col justify-center items-start gap-2">
                                            <Label htmlFor="text" className=" text-base">Tribunal</Label>
                                            <Select>
                                                <SelectTrigger className="w-[180px] md:min-w-[400px]">
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

                                        <div className=" flex flex-col justify-center items-start gap-2">
                                            <Label htmlFor="text" className=" text-base">Número</Label>
                                            <Input
                                                type="text"
                                                placeholder="número do processo"
                                                className="w-[180px] md:min-w-[400px]"
                                            />
                                        </div>

                                        <Button variant="secondary" className=" bg-gray-300 text-gray-600">
                                            Carregar dados do processo
                                        </Button>
                                    </div>

                                    {/* Parte 2 */}
                                    <div className=" flex flex-col md:flex-row gap-4 justify-start items-center mt-5">
                                        <div className=" flex flex-col justify-center items-start gap-2">
                                            <Label htmlFor="text" className=" text-base">Classe</Label>
                                            <Input
                                                type="text"
                                                placeholder="Ex: Execução Fiscal"
                                                className="w-[180px] md:min-w-[400px]"
                                            />
                                        </div>

                                        <div className=" flex flex-col justify-center items-start gap-2">
                                            <Label htmlFor="text" className=" text-base">Data/Hora Última Atuali.</Label>
                                            <Input
                                                type="text"
                                                placeholder=""
                                                className="w-[180px] md:min-w-[400px]"
                                            />
                                        </div>

                                        <div className=" flex flex-col justify-center items-start gap-2">
                                            <Label htmlFor="text" className=" text-base">Data Ajuizamento</Label>
                                            <Input
                                                type="text"
                                                placeholder=""
                                                className="w-[180px] md:min-w-[400px]"
                                            />
                                        </div>
                                    </div>

                                    {/* Parte 3 */}
                                    <div className=" flex flex-col md:flex-row gap-4 justify-start items-center mt-5">
                                        
                                        <div className=" flex flex-col justify-center items-start gap-2">
                                            <Label htmlFor="text" className=" text-base">Assuntos</Label>
                                            <Input
                                                type="text"
                                                placeholder="Ex: Dívida Ativa (Execução Fiscal)"
                                                className="w-[180px] md:min-w-[400px]"
                                            />
                                        </div>

                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className=" w-full">
                            <CardHeader className="bg-[#030430] text-white h-14 rounded-t-lg justify-center items-start">
                                <CardTitle className="text-lg">Detalhamento do Processo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Atributos Opcionais do processo
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-row gap-2 mt-5 justify-end items-center">
                        <Button variant="outline" className=" bg-gray-200 w-24 h-11">Cancelar</Button>
                        <Button className="w-24 h-11 bg-green-600">Salvar</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
import { 
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdicionarAudiencia from "@/components/adicionarAudiencia";

export default function AdicionarProcesso() {
    return(
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <p>Adicionar Processo</p>
                </DialogTrigger>
                <DialogContent className="flex flex-col w-[45%] max-w-6xl h-[95%] p-8">
                    <DialogTitle className="text-center text-xl font-semibold mb-3">Adicionar Processo</DialogTitle>
                    <div className="">
                        <div className="flex flex-row justify-around mb-2">
                            <div className="flex flex-col justify-between">
                                <Label>Cliente Réu</Label>
                                <Input style={{backgroundColor: "#f0f0f0", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", fontSize: "14px", borderRadius: "8px", padding: "0px 8px", margin: "2px 0px 10px 0px", border: "2px solid #030430 focus:border-none", height: "30px", width: "250px"}}></Input>
                                <Label>Advogado Réu</Label>
                                <Input style={{backgroundColor: "#f0f0f0", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", fontSize: "14px", borderRadius: "8px", padding: "0px 8px", margin: "2px 0px 10px 0px", border: "2px solid #030430 focus:border-none", height: "30px", width: "250px"}}></Input>
                                <Label>Anexar Documento(s)</Label>
                                <input type="file" style={{textAlign: "center", alignItems: "center", backgroundColor: "#f0f0f0", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", fontSize: "14px", borderRadius: "8px", padding: "0px 8px", margin: "2px 0px 10px 0px", border: "2px solid #030430 focus:border-none", height: "30px"}} />
                            </div>
                            <div className="flex flex-col justify-between">
                                <Label>Tipo do Processo</Label>
                                <Input style={{backgroundColor: "#f0f0f0", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", fontSize: "14px", borderRadius: "8px", padding: "0px 8px", margin: "2px 0px 10px 0px", border: "2px solid #030430 focus:border-none", height: "30px"}}></Input>
                                <Label>Status do Processo</Label>
                                <select style={{backgroundColor: "#f0f0f0", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", fontSize: "14px", borderRadius: "8px", padding: "0px 8px", margin: "2px 0px 12px 0px", border: "2px solid #030430 focus:border-none", height: "30px"}}>
                                    <option value="Aberto">Aberto</option>
                                    <option value="Andamento">Andamento</option>
                                    <option value="Encerrado">Encerrado</option>
                                </select>
                                <Label></Label>
                                <Button style={{height: "50px", fontSize: "16px"}}><AdicionarAudiencia /></Button>
                            </div>
                        </div>
                        <div>
                            <Label>Descrição Geral</Label>
                            <div className="">
                                <textarea className="border rounded-lg border-slate-400 shadow-md px-3 py-2 w-full h-48" style={{resize: "none"}}></textarea>
                            </div>
                        </div>
                        <div className="flex justify-end mt-5">
                            <Button className="mr-3 bg-[#CECECE] text-[#030430] hover:bg-slate-200">Cancelar</Button>
                            <Button>Adicionar</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
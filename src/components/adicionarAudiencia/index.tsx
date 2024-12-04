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

export default function AdicionarAudiencia() {
    return(
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <p>Criar Audiência</p>
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center h-2/4 w-1/4">
                    <DialogTitle className="text-center text-xl font-semibold mb-3">Adicionar Processo</DialogTitle>
                    <div className="">
                        <div className="flex flex-row justify-around mb-2">
                            <div className="flex flex-col justify-between">
                                <Label>Data</Label>
                                <Input type="date" style=
                                {{
                                    backgroundColor: "#f0f0f0", 
                                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", 
                                    fontSize: "14px", borderRadius: "8px", 
                                    padding: "0px 8px", margin: "2px 0px 10px 0px", 
                                    border: "2px solid #030430 focus:border-none", 
                                    height: "30px", width: "250px"}}></Input>
                                <Label>Localização</Label>
                                <Input style={{
                                    backgroundColor: "#f0f0f0", 
                                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", 
                                    fontSize: "14px", 
                                    borderRadius: "8px", 
                                    padding: "0px 8px", 
                                    margin: "2px 0px 10px 0px", 
                                    border: "2px solid #030430 focus:border-none", 
                                    height: "30px"}}></Input>
                            </div>
                        </div>
                        <div className="text-center mt-5">
                            <Button className="mr-3 bg-[#CECECE] text-[#030430] hover:bg-slate-200">Cancelar</Button>
                            <Button>Adicionar</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function VisualizarCaso() {
    return(
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <p>Visualizar Caso</p>
                </DialogTrigger>
                <DialogContent className="flex flex-col h-3/4 p-10">
                    <DialogTitle className="text-center text-lg font-semibold mb-4">Conteúdo Geral do Processo</DialogTitle>
                    <div className="flex justify-start">
                        <p>Resumo do Processo</p>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
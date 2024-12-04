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

interface nrProcesso {
    nrProcesso: number;
}

const resumo = [
    {
        descricao: "Lorem is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }
]

export default function VisualizarCaso({ nrProcesso }: nrProcesso) {
    return(
        <div>
            {resumo.map((resumo, index: number) => {
                return(
                    <Dialog key={index}>
                        <DialogTrigger asChild>
                            <p>Visualizar Caso</p>
                        </DialogTrigger>
                        <DialogContent className="flex flex-col h-3/4 p-10">
                            <DialogTitle className="text-center text-xl font-semibold mb-2">Conteúdo Geral do Processo</DialogTitle>
                            <div className="flex flex-col justify-start">
                                <p className="mb-2">Resumo do Processo - Nº do Processo: <span className="font-semibold">{nrProcesso}</span></p>
                                <div className="border rounded-lg border-slate-400 shadow-md">
                                    <p className="py-2 px-5 text-justify">{resumo.descricao}</p>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )
            })}
        </div>
    )
}
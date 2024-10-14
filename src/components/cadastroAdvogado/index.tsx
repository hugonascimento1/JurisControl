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

export default function CadastrarAdvogado() {
    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="secondary">Novo Advogado</Button>
                    {/* <Button variant="outline">Edit Profile</Button> */}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>Cadastrar Advogado</DialogTitle>
                    <DialogDescription>
                        {/* Adicione um novo advogado a câmara */}
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                            Nome
                            </Label>
                            <Input
                            id="name"
                            // defaultValue="Pedro Duarte"
                            className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                            Registro OAB
                            </Label>
                            <Input
                            id="username"
                            // defaultValue="@peduarte"
                            className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                            CPF
                            </Label>
                            <Input
                            id="username"
                            // defaultValue="@peduarte"
                            className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                            Senha 
                            </Label>
                            <Input
                            id="username"
                            // defaultValue="@peduarte"
                            className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                    <Button type="submit">Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
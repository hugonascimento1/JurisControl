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
                    <DialogTitle className="flex justify-center items-center font-bold text-[#030430]">Cadastrar Advogado</DialogTitle>
                    <DialogDescription>
                        {/* Adicione um novo advogado a câmara */}
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 mx-3">
                        <div className="">
                            <Label htmlFor="name" className="text-right">
                            Nome
                            </Label>
                            <Input
                            id="name"
                            type="text"
                            // defaultValue="Pedro Duarte"
                            className="col-span-3  mt-2"
                            />
                        </div>
                        <div className="">
                            <Label htmlFor="registroOAB" className="text-right">
                            Registro OAB
                            </Label>
                            <Input
                            id=""
                            type="text"
                            // defaultValue="@peduarte"
                            className="col-span-3 mt-2"
                            />
                        </div>
                        <div className="">
                            <Label htmlFor="cpf" className="text-right">
                            CPF
                            </Label>
                            <Input
                            id="cpf"
                            type="text"
                            // defaultValue="@peduarte"
                            className="col-span-3 mt-2"
                            />
                        </div>
                        <div className="">
                            <Label htmlFor="password" className="text-right">
                            Senha 
                            </Label>
                            <Input
                            id="password"
                            type="password"
                            // defaultValue="@peduarte"
                            className="col-span-3 mt-2"
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex flex-row justify-end gap-2 mr-3">
                        <Button variant="outline">Cancelar</Button>    
                        <Button type="submit" className="">Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
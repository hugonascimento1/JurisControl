import { 
    GraduationCapIcon, 
    Trash2 
} from "lucide-react";
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle,
} from "@/components/ui/card";
import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Advogados() {
    return (
        <Card className="flex-1">
            <CardHeader>
                <div className="flex items-center justify-center">
                    <CardTitle className="text-lg sm:text-xl text-gray-800">Advogados</CardTitle>
                    <GraduationCapIcon className="ml-auto w-4 h-4 " />
                </div>
                <CardDescription>
                    Advogados presentes na câmara.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <article className="flex flex-row items-center gap-2 border-b py-2 justify-between">
                    <div className="flex flex-row gap-4">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src="https://github.com/Hugo-do-Nascimento.png" />
                            <AvatarFallback>HN</AvatarFallback>
                        </Avatar> 
                        <div>
                            <p className="text-sm sm:text-base font-semibold">Hugo Nascimento</p>
                            <span className="text-[12px] sm:text-sm text-gray-400"><strong>OAB:</strong> 2345643</span>
                        </div>
                    </div>
                    <Button variant={"outline"} size="icon" className="">
                        <Trash2 className="" />
                    </Button>
                </article>

                <article className="flex flex-row items-center gap-2 border-b py-2 justify-between">
                    <div className="flex flex-row gap-4">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src="https://github.com/matsu.png" />
                            <AvatarFallback>Pedro-Matsushita</AvatarFallback>
                        </Avatar> 
                        <div>
                            <p className="text-sm sm:text-base font-semibold">Pedro Matsushita</p>
                            <span className="text-[12px] sm:text-sm text-gray-400"><strong>OAB:</strong> 2345643</span>
                        </div>
                    </div>
                    <Button variant={"outline"} size="icon" className="">
                        <Trash2 className="" />
                    </Button>
                </article>

                <article className="flex flex-row items-center gap-2 border-b py-2 justify-between">
                    <div className="flex flex-row gap-4">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src="https://github.com/MarianaAnjo.png" />
                            <AvatarFallback>MA</AvatarFallback>
                        </Avatar> 
                        <div>
                            <p className="text-sm sm:text-base font-semibold">Mariana Anjos</p>
                            <span className="text-[12px] sm:text-sm text-gray-400"><strong>OAB:</strong> 2345643</span>
                        </div>
                    </div>
                    <Button variant={"outline"} size="icon" className="">
                        <Trash2 className="" />
                    </Button>
                </article>

                <article className="flex flex-row items-center gap-2 border-b py-2 justify-between">
                    <div className="flex flex-row gap-4">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src="https://github.com/jjj-miguel.png" />
                            <AvatarFallback>JM</AvatarFallback>
                        </Avatar> 
                        <div>
                            <p className="text-sm sm:text-base font-semibold">João Miguel</p>
                            <span className="text-[12px] sm:text-sm text-gray-400"><strong>OAB:</strong> 2345643</span>
                        </div>
                    </div>
                    <Button variant={"outline"} size="icon" className="">
                        <Trash2 className="" />
                    </Button>
                </article>

                <article className="flex flex-row items-center gap-2 border-b py-2 justify-between">
                    <div className="flex flex-row gap-4">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src="https://github.com/Ceciliasitcovsky.png" />
                            <AvatarFallback>MC</AvatarFallback>
                        </Avatar> 
                        <div>
                            <p className="text-sm sm:text-base font-semibold">Cecília Sitcovsky</p>
                            <span className="text-[12px] sm:text-sm text-gray-400"><strong>OAB:</strong> 2345643</span>
                        </div>
                    </div>
                    <Button variant={"outline"} size="icon" className="">
                        <Trash2 className="" />
                    </Button>
                </article>

                <article className="flex flex-row items-center gap-2 border-b py-2 justify-between">
                    <div className="flex flex-row gap-4">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src="https://github.com/matheusviniciusga.png" />
                            <AvatarFallback>MV</AvatarFallback>
                        </Avatar> 
                        <div>
                            <p className="text-sm sm:text-base font-semibold">Matheus Vinícius</p>
                            <span className="text-[12px] sm:text-sm text-gray-400"><strong>OAB:</strong> 2345643</span>
                        </div>
                    </div>
                    <Button variant={"outline"} size="icon" className="">
                        <Trash2 className="" />
                    </Button>
                </article>
            </CardContent>
        </Card>
    );
}

interface NavBarProps {
    nome: String;
    botaoAdiconar?: React.ReactNode; // a "?" indica que o uso dessa prop é opcional
    botaoMenu?: React.ReactNode;
    botaoVoltar?: React.ReactNode;
}

export default function NavBar({ nome, botaoAdiconar, botaoMenu, botaoVoltar }: NavBarProps) {
    return (
        <div className="w-full h-[70px] bg-[#030430] flex justify-between items-center px-6 shadow-md mb-4">
            <div className="flex flex-row justify-center items-center gap-5">
                {botaoVoltar}
                <h1 className="text-white font-bold text-2xl">{nome}</h1>
            </div>

            <div className="flex flex-row gap-10">
                {botaoAdiconar}
                {botaoMenu}
            </div>
        </div>
    );
}
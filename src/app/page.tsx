import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ScaleIcon } from "lucide-react";
import Logo from "@/components/logo-text-icon";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-[#030430] p-4 h-52">
        <Logo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Seja bem-vindo ao JurisControl!</strong> Aqui, tudo gira em torno da eficiência.{' '}
            Simplificando o complexo, estamos prontos para ajudar.
          </p>
          <Link href="/login" className="flex items-center gap-5 self-start rounded-lg bg-[#030430] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90 md:text-base">
            <span>Entrar</span>
            <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* <Image 
            src={""}
            alt="imagem sistema"
            width={}
            height={}
          /> */}
        </div>
      </div>
    </main>
  );
}

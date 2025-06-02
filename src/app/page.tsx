"use client";

import { ArrowRightIcon, Lock, MessageCircleQuestion } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ScaleIcon } from "lucide-react";
import Logo from "@/components/logo-text-iconw";
import Desktopmobile from "../../public/desktop-mobile.png";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function Home() {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLoginPage = () => {
    router.push("/login");
  };

  return (
    <main className="flex min-h-screen flex-col justify-center items-center p-6">
      <div className="flex h-32 items-center rounded-lg bg-[#030430] w-[98%]">
        <Logo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row w-[95%]">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Seja bem-vindo ao JurisControl!</strong> Aqui, tudo gira em
            torno da eficiência. Simplificando o complexo, estamos prontos para
            ajudar.
          </p>
          <Button
            // href="/login"
            onClick={handleLoginPage}
            className="flex items-center gap-5 h-12 self-start rounded-lg bg-[#030430] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90 md:text-base"
          >
            <span>Entrar</span>
            <ArrowRightIcon className="w-5 md:w-6" />
          </Button>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Image
            src={Desktopmobile}
            alt="imagem sistema"
            width={652}
            height={400}
          />
        </div>
      </div>

      <section className="mt-12 - px-12 flex flex-col justify-center w-[92%]">
        <div className="flex h-24 shrink-0 items-center justify-center rounded-lg bg-[#030430] px-4 mb-10 w-full">
          <h2 className="text-2xl font-bold text-white">
            Por que usar o JurisControl?
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-4 bg-white rounded-lg border shadow hover:shadow-xl">
            <ScaleIcon className="text-blue-600 mb-2" />
            <h3 className="font-semibold">Organização eficiente</h3>
            <p className="text-sm text-gray-600">
              Centralize e acompanhe seus processos com facilidade.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border shadow hover:shadow-xl">
            <ArrowRightIcon className="text-blue-600 mb-2" />
            <h3 className="font-semibold">Navegação rápida</h3>
            <p className="text-sm text-gray-600">
              Interface intuitiva pensada para advogados e clientes.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border shadow hover:shadow-xl">
            <Lock className="text-blue-600 mb-2" />
            <h3 className="font-semibold">Acesso seguro</h3>
            <p className="text-sm text-gray-600">
              Seus dados protegidos com autenticação segura.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12 - px-12 flex flex-col justify-center w-[92%]">
        <div className="flex h-24 shrink-0 items-center justify-center rounded-lg bg-[#030430] px-4 mb-10 w-full">
          <h2 className="text-2xl font-bold text-white">Equipe Juriscontrol</h2>
        </div>
        <div className="w-full max-w-6xl mx-auto px-4 mt-10 flex flex-col md:flex-row items-center gap-10">
          {/* Imagem da equipe */}
          <div className="w-full md:w-1/2">
            <img
              src="/equipe-juriscontrol.jpg" // Coloque a imagem na pasta public
              alt="Equipe do JurisControl"
              className="rounded-lg shadow-md w-full object-cover"
            />
          </div>

          {/* Texto da história */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-[#030430]">
              Quem somos
            </h2>
            <p className="text-gray-700 text-base leading-relaxed">
              O <strong>JurisControl</strong> nasceu dentro da{" "}
              <strong>Universidade Católica de Pernambuco</strong>, inspirado
              pelas dores reais de um escritório parceiro — hoje nosso cliente.
              Nosso objetivo é{" "}
              <strong>
                tornar a gestão jurídica mais simples, eficiente e acessível
              </strong>
              , com tecnologia feita por quem conhece os desafios do setor.
            </p>
          </div>
        </div>
      </section>

<section className="mt-12 px-12 flex flex-col justify-center items-center w-[92%]">
  <div className="flex h-24 shrink-0 items-center justify-center rounded-lg bg-[#030430] px-4 mb-10 w-full">
    <h2 className="text-2xl font-bold text-white">Escolha o melhor plano para você!</h2>
  </div>

  <div className="flex flex-row items-center md:justify-center gap-5 w-full overflow-x-auto">
    
    {/* JurisBasic */}
    <Card className="max-w-[350px] min-w-[250px] shadow-lg">
      <CardHeader>
        <CardTitle className="text-[#030430] font-bold">JurisBasic</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-xl font-bold">R$ 90,00 / mês</CardDescription>
        <CardDescription className="text-base font-semibold">R$ 990,00 / ano (1 mês grátis!)</CardDescription>
        <hr className="my-2 border-t-2 border-gray-300" />
        <CardDescription className="text-base">✔ Até 2 advogados cadastrados</CardDescription>
        <CardDescription className="text-base">✔ 50 processos ativos</CardDescription>
        <CardDescription className="text-base">✔ 20 documentos gerados por IA/mês</CardDescription>
        <CardDescription className="text-base">✔ 5 GB de armazenamento</CardDescription>
        <hr className="my-2 border-t-2 border-gray-300" />
        <div className="flex justify-center items-center mt-4">
          <Button>Assinar Agora</Button>
        </div>
      </CardContent>
    </Card>

    {/* JurisPro */}
    <Card className="max-w-[350px] min-w-[250px] shadow-lg">
      <CardHeader>
        <CardTitle className="text-[#030430] font-bold">JurisPro</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-xl font-bold">R$ 150,00 / mês</CardDescription>
        <CardDescription className="text-base font-semibold">R$ 1.650,00 / ano (1 mês grátis!)</CardDescription>
        <hr className="my-2 border-t-2 border-gray-300" />
        <CardDescription className="text-base">✔ Até 5 advogados cadastrados</CardDescription>
        <CardDescription className="text-base">✔ 200 processos ativos</CardDescription>
        <CardDescription className="text-base">✔ 50 documentos gerados por IA/mês</CardDescription>
        <CardDescription className="text-base">✔ 20 GB de armazenamento</CardDescription>
        <hr className="my-2 border-t-2 border-gray-300" />
        <div className="flex justify-center items-center mt-4">
          <Button>Assinar Agora</Button>
        </div>
      </CardContent>
    </Card>

    {/* JurisMaster */}
    <Card className="max-w-[350px] min-w-[250px] shadow-lg">
      <CardHeader>
        <CardTitle className="text-[#030430] font-bold">JurisMaster</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-xl font-bold">R$ 210,00 / mês</CardDescription>
        <CardDescription className="text-base font-semibold">R$ 2.310,00 / ano (1 mês grátis!)</CardDescription>
        <hr className="my-2 border-t-2 border-gray-300" />
        <CardDescription className="text-base">✔ Cadastro ilimitado de advogados</CardDescription>
        <CardDescription className="text-base">✔ Processos ativos ilimitados</CardDescription>
        <CardDescription className="text-base">✔ Documentos por IA ilimitados</CardDescription>
        <CardDescription className="text-base">✔ Armazenamento ilimitado</CardDescription>
        <CardDescription className="text-base">✔ Consultoria gratuita para onboarding</CardDescription>
        <hr className="my-2 border-t-2 border-gray-300" />
        <div className="flex justify-center items-center mt-4">
          <Button>Assinar Agora</Button>
        </div>
      </CardContent>
    </Card>
    
  </div>
</section>



      <section className="mt-12 - px-12 flex flex-col justify-center items-center w-[92%] mb-12">
        <div className="flex h-24 shrink-0 items-center justify-center rounded-lg bg-[#030430] px-4 mb-10 w-full">
          <h2 className="text-2xl font-bold text-white">
            Perguntas frequentes
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <MessageCircleQuestion className="w-5 h-5 mr-2 text-blue-600" />
              Quais são os principais benefícios de utilizar o JurisControl?
            </AccordionTrigger>
            <AccordionContent className="text-base text-gray-800 mt-2">
              <ul className="space-y-2 list-disc pl-5">
                <li>
                  Automatização de tarefas e centralização de informações.
                </li>
                <li>Redução de erros com alertas e modelos prontos.</li>
                <li>
                  Dashboards para decisões estratégicas com base em dados.
                </li>
                <li>Alta segurança no armazenamento de dados.</li>
                <li>
                  Melhor atendimento e produtividade com ferramentas intuitivas.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              <MessageCircleQuestion className="w-5 h-5 mr-2 text-blue-600" />O
              sistema tem agenda integrada?
            </AccordionTrigger>
            <AccordionContent className="text-base text-gray-800 mt-2">
              Sim! Você pode agendar audiências, reuniões e prazos com data,
              horário e descrição. Tudo fica organizado em uma agenda digital
              acessível de qualquer lugar.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              <MessageCircleQuestion className="w-5 h-5 mr-2 text-blue-600" />
              Posso acompanhar o desempenho do meu escritório?
            </AccordionTrigger>
            <AccordionContent className="text-base text-gray-800 mt-2">
              Sim! O painel administrativo (dashboard) mostra indicadores como
              número de processos, compromissos e outras métricas importantes
              para a gestão.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              <MessageCircleQuestion className="w-5 h-5 mr-2 text-blue-600" />O
              sistema gera documentos jurídicos automaticamente?
            </AccordionTrigger>
            <AccordionContent className="text-base text-gray-800 mt-2">
              Sim! Você pode usar modelos prontos ou gerar documentos com
              inteligência artificial a partir das informações inseridas no
              sistema.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="w-full bg-[#030430] py-16 px-4 text-white">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Fale com a gente</h2>
          <p className="text-gray-300">
            Tem dúvidas ou quer saber mais? Preencha o formulário abaixo e
            entraremos em contato.
          </p>
        </div>

        <Card className="max-w-3xl mx-auto bg-white shadow-lg">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" placeholder="Seu nome" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                placeholder="Como podemos te ajudar?"
                rows={5}
              />
            </div>

            <Button className="bg-[#030430] hover:bg-[#1a1a5a] text-white w-full">
              Enviar
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

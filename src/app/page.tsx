"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Logo from "@/components/logo-text-icon";
import adv from "../../public/adv.png";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, MessageCircleQuestion, Users } from "lucide-react";
import { Carousell } from "@/components/carousel";
import { CollapsibleDemo } from "@/components/collapsible";
import { CheckCircle } from "lucide-react";
import gp from "../../public/gp.jpg";
import { list } from "postcss";
import { CarouselSize } from "@/components/carouselText";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileForm } from "@/components/form";
export default function Home() {
  const router = useRouter();

  const handleLoginPage = () => {
    router.push("/login");
  };

  const items = [
    {
      question: "Quais são os principais benefícios de utilizar este sistema?",
      icon: MessageCircleQuestion,
      content: (
        <div className="space-y-6 text-base text-gray-800">
          <p>
            A adoção do nosso sistema de gestão para escritórios de advocacia
            proporciona uma série de vantagens que otimizam a operação e o
            desempenho da sua prática jurídica:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
              <span>
                <strong>Eficiência Operacional:</strong> Automatize tarefas e
                centralize informações.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
              <span>
                <strong>Menos Erros:</strong> Alertas e modelos prontos garantem
                precisão.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
              <span>
                <strong>Decisões Inteligentes:</strong> Use dashboards
                analíticos com dados organizados.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
              <span>
                <strong>Segurança:</strong> Proteção de dados com banco robusto.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
              <span>
                <strong>Produtividade:</strong> Ferramentas intuitivas melhoram
                o fluxo de trabalho.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
              <span>
                <strong>Melhor Atendimento:</strong> Comunicação eficaz com o
                cliente.
              </span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      question:
        "Posso agendar meus compromissos (audiências, reuniões, prazos) no sistema? Como funciona?",
      icon: MessageCircleQuestion,
      content: (
        <div className="text-base text-gray-800">
          Sim! O sistema possui uma agenda digital integrada onde você pode
          registrar todos os seus compromissos com data, horário e descrição.
          Isso ajuda a manter sua organização e evita que você perca prazos
          importantes ou tenha conflitos de agenda.
        </div>
      ),
    },
    {
      question:
        "O sistema me ajuda a ter uma visão geral do desempenho do meu escritório?",
      icon: MessageCircleQuestion,
      content: (
        <div className="text-base text-gray-800">
          Sim! Para administradores, o sistema oferece um painel de controle
          <strong> dashboard </strong> com informações consolidadas sobre o
          desempenho do escritório, como volume de processos, compromissos
          agendados e outras estatísticas importantes. Isso facilita a análise e
          a tomada de decisões estratégicas.
        </div>
      ),
    },
    {
      question:
        "O sistema oferece alguma opção para gerar documentos jurídicos?",
      icon: MessageCircleQuestion,
      content: (
        <div className="text-base text-gray-800">
          O <strong>JurisControl</strong> oferece duas maneiras de gerar
          documentos: você pode usar modelos pré-configurados para agilizar a
          criação de documentos comuns, ou utilizar a inteligência artificial
          integrada para gerar documentos personalizados, como procurações e
          contratos, a partir das informações que você inserir.{" "}
        </div>
      ),
    },
    {
      question:
        "O sitesma oferece alguma ferramenta para cadastrar e acompanhar os processos dos meus clientes no sistema?",
      icon: MessageCircleQuestion,
      content: (
        <div className="text-base text-gray-800">
          <p>
            Na seção de <strong>"Processos"</strong>, você pode cadastrar novos
            casos, inserindo todas as informações relevantes como número do
            processo, partes envolvidas e tipo de ação. Depois de cadastrados,
            você pode acompanhar o andamento de cada processo, consultar
            detalhes, prazos e documentos associados.
          </p>
        </div>
      ),
    },
  ];


  const cardItems = [
    {
      title: "Missão",
      content:
        "Tornar o dia a dia do profissional jurídico mais eficiente, produtivo e simples por meio de tecnologia acessível, inteligente e centrada no usuário.",
    },
    {
      title: "Visão",
      content:
        "Ser a principal plataforma de automação e gestão jurídica no Brasil para escritórios de pequeno e médio porte, reconhecida pela eficiência, simplicidade e impacto positivo no dia a dia dos profissionais do Direito.",
    },
    {
      title: "Valores",
      list: [
        "Eficiência com simplicidade: valorizamos soluções que economizam tempo sem complicar o processo. ",
        "Foco no usuário: O sistema é construído ouvindo e observando quem o utiliza.",
        "Inovação responsável: utilizamos IA e automação com ética, transparência e segurança.",
        "Acessibilidade e inclusão: criamos ferramentas que qualquer advogado pode usar, independentemente de seu domínio tecnológico.",
        "Evolução contínua: estamos sempre aprendendo e ajustando com base em dados e feedback real.",
      ],
    },
    {
      title: "Próposito",
      content:
        "Libertar o profissional jurídico das tarefas repetitivas e operacionais, para que ele possa se concentrar no que realmente importa: pensar,argumentar, defender e servir à justiça com mais humanidade.",
    },
    {
      title: "BHAG’s",
      list: [
        "Impactar diretamente 1 milhão de advogados brasileiros até 2035, automatizando atividades operacionais e repetitivas da rotina jurídica. ",
        "Ser a principal plataforma nacional de apoio à advocacia de pequeno e médio porte, promovendo uma transformação digital acessível e estratégica. ",
        "Reduzir em pelo menos 50% o tempo médio gasto com tarefas administrativas em escritórios jurídicos até 2030. ",
        "Integrar a plataforma com todos os principais sistemas de tribunais e órgãos públicos do Brasil até 2032, promovendo interoperabilidade e fluidez no trabalho jurídico.",
        "Manter um índice de satisfação acima de 90% entre advogados e administradores que utilizam o sistema.",
      ],
    },
    // ...
  ];

  return (
    <div className="overflow-x-hidden">
      <header className="w-full h-20 bg-white flex justify-between items-center px-6 shadow-md">
        <div className="flex items-center space-x-3">
          <Logo />
        </div>
      </header>

      {/* Banner com imagem e overlay */}
      <div className="relative w-full h-[500px] mb-40">
        <Image src={adv} alt="Banner" fill className="object-cover blur-sm" />
        <div className="absolute inset-0 bg-[#030430]/70 backdrop-blur-sm" />
        <div className="absolute inset-0 flex flex-col items-center mt-20 text-center px-4">
          <h1 className="text-white text-4xl font-bold mb-5">
            Bem-vindo ao JurisControl
          </h1>
          <p className="text-white text-lg md:text-xl mt-4 max-w-2xl">
            Aqui, tudo gira em torno da eficiência. Simplificando o complexo,
            estamos prontos para ajudar.
          </p>
          <Button
            onClick={handleLoginPage}
            className="flex items-center justify-center gap-5 h-12 mt-20 rounded-lg bg-[#030430] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90 md:text-base"
          >
            <span>Entrar</span>
            <ArrowRightIcon className="w-5 md:w-6" />
          </Button>
        </div>
      </div>

      {/* Sessão do carrossel */}
      <div className="flex flex-col md:flex-row items-center justify-around flex-wrap mb-40">
        <div className="text-[#030430] text-center md:text-left max-w-md mb-20">
          <h1 className="text-2xl font-bold">
            Um sistema, inúmeras possibilidades:
          </h1>
          <p className="text-lg md:text-xl mt-4">
            Centralize e otimize todos os processos da sua prática jurídica.
          </p>
        </div>
        <div className="w-full md:w-auto max-w-3xl">
          <Carousell />
        </div>
      </div>

      {/* Sessão de perguntas frequentes com animação */}
      <div>
        <h1 className="text-3xl font-bold text-[#030430] my-40 text-center">
          Perguntas Frequentes
        </h1>
        <div className="flex flex-col items-center justify-center mb-40 px-4">
          <CollapsibleDemo items={items} />
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-bold text-[#030430] my-40 text-center">
          Equipe JurisControl / Sobre Nós
        </h1>
        <div>
          <div className="flex flex-col items-center justify-center text-center px-4 mb-40">
            <Image
              src={gp}
              alt="Equipe JurisControl"
              className="w-full max-w-4xl h-auto mb-8 rounded-lg shadow-md"
            />
            <div className="max-w-4xl space-y-6 text-justify text-gray-800 text-base leading-relaxed">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                elit dui, accumsan sed est eu, facilisis euismod sem. Cras
                lacinia condimentum nulla, at maximus felis maximus eget. Nulla
                auctor vitae nunc sed ultricies. Duis vehicula vulputate odio ut
                eleifend. In et metus quis est sagittis egestas vitae vitae
                urna. Ut non mauris fermentum, scelerisque dui nec, imperdiet
                augue. Morbi vitae suscipit dui. Nam at massa venenatis,
                molestie mi malesuada, tempor arcu. Vestibulum nisl magna,
                pulvinar vel ullamcorper ut, feugiat sit amet libero. Mauris
                viverra sem arcu, id egestas purus egestas interdum. Sed
                ullamcorper diam ut enim eleifend, dignissim tristique erat
                tristique. Nullam in tortor quis odio blandit posuere. Proin
                vitae massa vel risus tempor tristique.
              </p>
              <p>
                Nullam faucibus enim sit amet mi dignissim cursus. Phasellus
                ultrices imperdiet libero, in consectetur nisi blandit vitae.
                Curabitur rhoncus luctus nibh vel consectetur. Nunc a massa vel
                diam varius consectetur et ut magna. Etiam risus ante, mollis
                sed nulla in, semper sodales dolor. Ut varius libero convallis
                vestibulum convallis. Duis purus ligula, dictum ac cursus eget,
                tristique eget nisi. Sed id porta nisl. Aliquam et velit leo.
                Etiam sit amet luctus velit, vitae porttitor erat. Proin
                bibendum lacus nec orci sollicitudin egestas.
              </p>

              <h3 className="text-xl font-semibold mt-6">Nossa Problemática</h3>
              <p>
                Nullam faucibus enim sit amet mi dignissim cursus. Phasellus
                ultrices imperdiet libero, in consectetur nisi blandit vitae.
                Curabitur rhoncus luctus nibh vel consectetur. Nunc a massa vel
                diam varius consectetur et ut magna. Etiam risus ante, mollis
                sed nulla in, semper sodales dolor. Ut varius libero convallis
                vestibulum convallis. Duis purus ligula, dictum ac cursus eget,
                tristique eget nisi. Sed id porta nisl. Aliquam et velit leo.
                Etiam sit amet luctus velit, vitae porttitor erat. Proin
                bibendum lacus nec orci sollicitudin egestas.
              </p>

              <h3 className="text-xl font-semibold mt-6">
                Nosso Objetivo Geral
              </h3>
              <p>
                Suspendisse suscipit accumsan diam a egestas. Ut sagittis mi
                quam. Nullam dignissim ullamcorper felis, ac efficitur felis
                rutrum at. Donec sem magna, porttitor sed sapien sit amet,
                ullamcorper tincidunt odio. Duis faucibus magna a ipsum
                sollicitudin, ac fermentum odio viverra. Donec consectetur vitae
                enim sed tristique. Quisque vestibulum, nisl in porttitor
                dapibus, eros nulla maximus mauris, eget egestas risus neque eu
                turpis. Vivamus sed nulla ut ante euismod scelerisque vitae sit
                amet risus. Proin tristique dui enim, sit amet volutpat nibh
                dignissim eu. Donec rhoncus suscipit nunc, at semper libero
                posuere vitae. Morbi a mauris sollicitudin, vestibulum nibh
                euismod, mattis neque. Pellentesque nibh velit, viverra vitae
                lectus vel, bibendum dictum erat. Morbi eu sodales nibh. Ut
                turpis ipsum, imperdiet id scelerisque et, tincidunt sit amet
                augue. Sed arcu augue, vestibulum non facilisis eu, varius vitae
                elit.
              </p>

              <h3 className="text-xl font-semibold mt-6">
                Nossos Objetivos Específicos
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Levantar as necessidades reais dos escritórios jurídicos.
                </li>
                <li>
                  Desenvolver uma plataforma digital integrada e funcional.
                </li>
                <li>
                  Criar ferramentas práticas, como controle de prazos e
                  documentos.
                </li>
                <li>Garantir segurança e confidencialidade das informações.</li>
                <li>
                  Validar o sistema com advogados e aperfeiçoar com base em
                  feedbacks.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center mb-40 px-4">
        <CarouselSize items={cardItems} />
      </div>
<div>
  <ProfileForm />
</div>

    </div>
  );
}

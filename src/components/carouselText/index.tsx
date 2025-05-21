"use client";

import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

// const cardItems = [
//   {
//     title: "Missão",
//     content:
//       "Tornar o dia a dia do profissional jurídico mais eficiente, produtivo e simples por meio de tecnologia acessível, inteligente e centrada no usuário.",
//   },
//   {
//     title: "Visão",
//     content:
//       "Ser a principal plataforma de automação e gestão jurídica no Brasil para escritórios depequeno e médio porte,reconhecida pela eficiência,simplicidade e impacto positivo no dia a dia dos profissionais do Direito.  ",
//   },
//   {
//     title: "Valores",
//     content:
//       "Eficiência com simplicidade: valorizamos soluções que economizam tempo sem complicar o processo.Foco no usuário: o sistema é construído ouvindoe observando quem o utiliza.Inovação responsável: utilizamos IA eautomação com ética, transparência esegurança.Acessibilidade e inclusão: criamosferramentas que qualquer advogado pode usar,independentemente de seu domínio tecnológico.Evolução contínua: estamos sempreaprendendo e ajustando com base em dados efeedback real.",
//   },
//   {
//     title: "Geração de Documentos",
//     content:
//       "Crie documentos jurídicos rapidamente utilizando modelos pré-configurados ou nossa IA integrada.",
//   },
//   {
//     title: "Acompanhamento de Processos",
//     content:
//       "Cadastre e monitore facilmente o andamento dos processos dos seus clientes no sistema.",
//   },
//   // Você pode adicionar mais itens aqui
// ];

interface CarouselSizeProps {
  items: { title: string; content?: string; list?: string[] }[];
}

export const CarouselSize: React.FC<CarouselSizeProps> = ({ items }) => {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  useEffect(() => {
    if (swiperInstance && prevRef.current && nextRef.current) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;

      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

  return (
    <div className="container" style={{ maxWidth: "900px", margin: "auto" }}>
      <h1 className="heading mb-8 text-center text-2xl font-bold">
        Explore os Recursos
      </h1>

      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView="auto"
        spaceBetween={30}
        speed={900}
        autoplay={{
          delay: 5000, // tempo entre os slides (em ms)
          disableOnInteraction: false, // continua mesmo com interação do usuário
        }} // ⬅️ aqui define a velocidade da transição
        coverflowEffect={{
          rotate: 0,
          stretch: 50,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onSwiper={setSwiperInstance}
        modules={[EffectCoverflow, Navigation, Autoplay]}
        className="swiper_container"
        style={{ padding: "40px 40px" }}
      >
        {items.map((item, index) => (
          <SwiperSlide
            key={index}
            style={{
              height: "650px",
              width: "500px",
              display: "flex",
              flexDirection: "column", // Organizar o título e o texto verticalmente
              justifyContent: "start",
              alignItems: "center",
              backgroundColor: "#050550",
              borderRadius: "12px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              padding: "20px", // Adicionar um pouco de padding interno
              textAlign: "center",
              userSelect: "none",
            }}
          >
            <h3 className="text-3xl font-semibold mb-2 text-[#D9D9D9]">
              {item.title}
            </h3>
            {item.content && (
              <p className="text-xl text-[#D9D9D9] mt-10">{item.content}</p>
            )}

            {item.list && (
              <ul className="list-disc pl-6 space-y-2 text-left mt-10">
                {item.list.map((listItem, idx) => (
                  <li key={idx} className="text-xl text-[#D9D9D9]">
                    {listItem}
                  </li>
                ))}
              </ul>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

<div className="slider-controler mt-6 flex justify-center items-center gap-6">
  <div ref={prevRef} className="cursor-pointer text-blue-600 hover:text-blue-800">
    <ChevronLeft size={32} />
  </div>
  <div ref={nextRef} className="cursor-pointer text-blue-600 hover:text-blue-800">
    <ChevronRight size={32} />
  </div>
</div>

    </div>
  );
};

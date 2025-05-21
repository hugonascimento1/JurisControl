import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export function Carousell() {
  const images = [
    "/telas/image1.png",
    "/telas/image2.png",
    "/telas/image3.png",
    "/telas/image4.png",
  ];

  return (
    <Carousel
      opts={{
        align: "center",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 3000,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        }),
      ]}
      className="w-[full] max-w-6xl mx-auto px-4"
    >
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem
            key={index}
            className="flex justify-center items-center"
          >
            <img
              src={src}
              alt={`Imagem ${index + 1}`}
              className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-6xl h-auto object-contain rounded-xl shadow-lg"
              style={{ maxHeight: "650px" }}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

const heroSlides = [
  {
    id: 1,
    title: "Summer Collection",
    description: "Discover our latest summer styles with up to 50% off",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop",
    cta: "Shop Now",
    color: "bg-gradient-to-r from-blue-500 to-purple-600",
  },
  {
    id: 2,
    title: "New Arrivals",
    description: "Fresh styles just landed in store",
    image: "https://images.unsplash.com/photo-1558769132-cb1fceda0436?w=1600&auto=format&fit=crop",
    cta: "Explore",
    color: "bg-gradient-to-r from-emerald-500 to-cyan-600",
  },
  {
    id: 3,
    title: "Limited Time Offer",
    description: "End of season sale - don't miss out!",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&auto=format&fit=crop",
    cta: "Save Now",
    color: "bg-gradient-to-r from-rose-500 to-pink-600",
  },
];

export function HeroCarousel() {
  return (
    <Carousel 
      className="w-full"
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
    >
      <CarouselContent>
        {heroSlides.map((slide) => (
          <CarouselItem key={slide.id}>
            <div className={`relative h-[400px] md:h-[500px] overflow-hidden rounded-xl ${slide.color}`}>
              <div className="absolute inset-0 z-0">
                {/* Background image with overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-20"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
              </div>
              
              <div className="relative z-10 flex h-full items-center p-8 md:p-16">
                <div className="max-w-lg">
                  <h1 className="mb-4 text-3xl font-bold text-white md:text-5xl">
                    {slide.title}
                  </h1>
                  <p className="mb-6 text-lg text-white/90">
                    {slide.description}
                  </p>
                  <Button size="lg" className="group">
                    {slide.cta}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4 hidden md:flex" />
      <CarouselNext className="right-4 hidden md:flex" />
    </Carousel>
  );
}

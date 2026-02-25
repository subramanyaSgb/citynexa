import Image from "next/image";

const BUILDER_LOGOS = [
  { file: "casatrance.jpeg", name: "Casatrance" },
  { file: "goyal-hariyana.jpeg", name: "Goyal & Co." },
  { file: "casagrand.jpeg", name: "Casagrand" },
  { file: "modern-spaaces.jpeg", name: "Modern Spaaces" },
  { file: "sumadhura.jpeg", name: "Sumadhura" },
  { file: "lodha.jpeg", name: "Lodha" },
  { file: "sobha.jpeg", name: "Sobha" },
  { file: "ds-max.jpeg", name: "DS Max" },
  { file: "elv-projects.jpeg", name: "ELV Projects" },
  { file: "sowparnika.jpeg", name: "Sowparnika" },
  { file: "sbr-group.jpeg", name: "SBR Group" },
  { file: "m1-homes.jpeg", name: "m1 Homes" },
  { file: "assetz.jpeg", name: "Assetz" },
  { file: "abhinandan-lodha.jpeg", name: "Abhinandan Lodha" },
] as const;

export function BuilderPartners() {
  // Duplicate list for seamless infinite scroll
  const logos = [...BUILDER_LOGOS, ...BUILDER_LOGOS];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Our Trusted Builder Partners
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            We work with top builders in Bangalore to bring you the best properties
          </p>
        </div>
      </div>

      {/* Marquee container */}
      <div className="relative mt-12 overflow-hidden">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />

        {/* Scrolling track */}
        <div
          className="flex items-center gap-12 animate-marquee"
          style={{
            width: "max-content",
          }}
        >
          {logos.map((builder, index) => (
            <div
              key={`${builder.file}-${index}`}
              className="flex shrink-0 flex-col items-center gap-2"
            >
              <div className="flex h-20 w-32 items-center justify-center rounded-lg bg-gray-50 p-3 transition-all duration-300 grayscale hover:grayscale-0 hover:shadow-md">
                <Image
                  src={`/images/builders/${builder.file}`}
                  alt={builder.name}
                  width={120}
                  height={60}
                  className="h-[60px] w-auto object-contain"
                />
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {builder.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

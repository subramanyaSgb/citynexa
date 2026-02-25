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
  const logos = [...BUILDER_LOGOS, ...BUILDER_LOGOS];

  return (
    <section className="border-y border-warm-200 bg-warm-50 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-copper">
            Trusted Partners
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-warm-900 md:text-4xl">
            We work with the best
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-warm-500">
            14+ verified and RERA-registered builders across Bangalore
          </p>
        </div>
      </div>

      <div className="relative mt-12 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-warm-50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-warm-50 to-transparent" />

        <div
          className="flex items-center gap-10 animate-marquee"
          style={{ width: "max-content" }}
        >
          {logos.map((builder, index) => (
            <div
              key={`${builder.file}-${index}`}
              className="flex shrink-0 flex-col items-center gap-2.5"
            >
              <div className="flex h-20 w-32 items-center justify-center rounded-xl border border-warm-200 bg-white p-3 transition-all duration-300 hover:shadow-md hover:border-warm-300">
                <Image
                  src={`/images/builders/${builder.file}`}
                  alt={builder.name}
                  width={120}
                  height={60}
                  className="h-[60px] w-auto object-contain"
                />
              </div>
              <span className="text-xs font-medium text-warm-500">
                {builder.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

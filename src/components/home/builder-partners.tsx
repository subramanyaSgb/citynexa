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
    <section className="bg-white py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <p className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.15em] text-warm-400">
            Trusted by
          </p>
          <div className="h-px flex-1 bg-warm-200/60" />
        </div>
      </div>

      <div className="relative mt-8 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />

        <div
          className="flex items-center gap-8 animate-marquee"
          style={{ width: "max-content" }}
        >
          {logos.map((builder, index) => (
            <div
              key={`${builder.file}-${index}`}
              className="flex h-14 w-28 shrink-0 items-center justify-center rounded-lg bg-warm-50/60 px-3 transition-all duration-300 hover:bg-warm-100"
            >
              <Image
                src={`/images/builders/${builder.file}`}
                alt={builder.name}
                width={100}
                height={48}
                className="h-10 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

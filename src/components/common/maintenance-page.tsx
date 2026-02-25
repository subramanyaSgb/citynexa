import Image from "next/image";

interface MaintenancePageProps {
  message?: string;
}

export function MaintenancePage({ message }: MaintenancePageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="relative mx-auto mb-8 h-16 w-16 overflow-hidden rounded-xl">
          <Image
            src="/images/citynexa-logo.jpeg"
            alt="City Nexa"
            fill
            className="object-cover"
            priority
          />
        </div>

        <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900">
          We&apos;ll Be Back Soon
        </h1>

        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="whitespace-pre-wrap text-slate-600 leading-relaxed">
            {message || "This website is currently undergoing maintenance. Please check back later."}
          </p>
        </div>

        <p className="text-sm text-slate-400">
          City Nexa Networks
        </p>
      </div>
    </div>
  );
}

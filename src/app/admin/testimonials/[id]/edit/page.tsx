import { redirect } from "next/navigation";
import { getTestimonial, updateTestimonial } from "@/lib/actions/testimonials";
import { EditTestimonialClient } from "./edit-testimonial-client";

interface EditTestimonialPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTestimonialPage({ params }: EditTestimonialPageProps) {
  const { id } = await params;
  const testimonial = await getTestimonial(id);

  if (!testimonial) {
    redirect("/admin/testimonials");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Edit Testimonial
        </h2>
        <p className="text-muted-foreground">
          Update the details for {testimonial.name}&apos;s testimonial.
        </p>
      </div>

      <EditTestimonialClient testimonial={testimonial} />
    </div>
  );
}

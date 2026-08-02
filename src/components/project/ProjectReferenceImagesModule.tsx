import Image from "next/image";
import { ko } from "@/messages";

type ProjectReferenceImagesModuleProps = {
  urls: string[];
};

export function ProjectReferenceImagesModule({
  urls,
}: ProjectReferenceImagesModuleProps) {
  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
      <h2 className="text-[15px] font-semibold text-[#0F172A]">
        {ko.project.referenceImages}
      </h2>
      {urls.length === 0 ? (
        <p className="mt-2 text-[13px] text-[#94A3B8]">
          {ko.project.noReferenceImages}
        </p>
      ) : (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {urls.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
            >
              <Image
                src={url}
                alt={`${ko.project.referenceImages} ${index + 1}`}
                fill
                sizes="96px"
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

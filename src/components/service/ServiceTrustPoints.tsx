import { ko } from "@/messages";

const TRUST_POINTS = [
  ko.service.trustProofConfirm,
  ko.service.trustProgress,
  ko.service.trustPsd,
  ko.service.trustShipping,
  ko.service.trustOwnedItemRecord,
] as const;

export function ServiceTrustPoints() {
  return (
    <section>
      <h2 className="text-[17px] font-semibold text-[#0F172A] md:text-[18px]">
        {ko.service.trustSection}
      </h2>
      <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {TRUST_POINTS.map((point) => (
          <li
            key={point}
            className="flex items-start gap-2 rounded-lg bg-[#F8FAFC] px-3 py-2.5 text-[13px] leading-snug text-[#0F172A]"
          >
            <span
              className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[11px] font-bold text-[#15803D]"
              aria-hidden
            >
              ✓
            </span>
            <span className="break-keep">{point}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

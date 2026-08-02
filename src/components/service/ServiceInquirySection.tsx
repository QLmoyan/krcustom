"use client";

import { ServiceOptions } from "@/components/service/ServiceOptions";
import type { Service } from "@/types";

type ServiceInquirySectionProps = {
  service: Service;
};

export function ServiceInquirySection({ service }: ServiceInquirySectionProps) {
  return <ServiceOptions service={service} />;
}

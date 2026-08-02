"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ko } from "@/messages";

type ErrorPageProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function ErrorPage({ error, unstable_retry }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-full bg-[#F8FAFC]">
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <p className="text-[12px] font-semibold tracking-wide text-[#0F766E]">
          {ko.brand.name}
        </p>
        <h1 className="mt-2 text-[22px] font-bold text-[#0F172A]">
          {ko.system.errorTitle}
        </h1>
        <p className="mt-3 max-w-md break-keep text-[14px] leading-relaxed text-[#64748B]">
          {ko.system.errorDescription}
        </p>
        {error.digest ? (
          <p className="mt-2 font-mono text-[11px] text-[#94A3B8]">
            {error.digest}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button type="button" variant="primary" onClick={() => unstable_retry()}>
            {ko.system.errorRetry}
          </Button>
          <Button href="/" variant="outline">
            {ko.system.errorHome}
          </Button>
        </div>
      </Container>
    </div>
  );
}

import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { SignupForm } from "@/components/auth/SignupForm";
import { Container } from "@/components/ui/Container";
import { ko } from "@/messages";

export default function SignupPage() {
  return (
    <div className="min-h-full bg-[#F8FAFC] pb-20 md:pb-8">
      <Header />
      <main>
        <Container className="py-10 md:py-14">
          <div className="mx-auto max-w-md text-center">
            <h1 className="text-[22px] font-bold text-[#0F172A]">
              {ko.auth.signupTitle}
            </h1>
            <p className="mt-2 break-keep text-[14px] leading-relaxed text-[#64748B]">
              {ko.auth.signupSubtitle}
            </p>
          </div>
          <div className="mt-8">
            <Suspense
              fallback={
                <p className="text-center text-[14px] text-[#94A3B8]">
                  {ko.system.loading}
                </p>
              }
            >
              <SignupForm />
            </Suspense>
          </div>
        </Container>
      </main>
      <MobileBottomNav />
    </div>
  );
}

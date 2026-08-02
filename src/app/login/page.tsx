import { DemoPlaceholderPage } from "@/components/demo/DemoPlaceholderPage";

export default function LoginPage() {
  return (
    <DemoPlaceholderPage
      title="로그인"
      description="인증은 Alpha Demo에서 연결되지 않습니다. 판매자 데모 또는 서비스 데모로 바로 이동할 수 있습니다."
      primaryHref="/seller"
      primaryLabel="판매자 데모"
    />
  );
}

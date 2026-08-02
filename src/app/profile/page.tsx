import { DemoPlaceholderPage } from "@/components/demo/DemoPlaceholderPage";
import { DEMO } from "@/data/demoFlow";

export default function ProfilePage() {
  return (
    <DemoPlaceholderPage
      title="마이페이지"
      description="마이페이지는 준비 중입니다. 주문·상담 데모를 먼저 확인해 보세요."
      primaryHref={`/orders/${DEMO.orderId}`}
      primaryLabel="데모 주문 보기"
    />
  );
}

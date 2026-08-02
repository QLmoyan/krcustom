import { DemoPlaceholderPage } from "@/components/demo/DemoPlaceholderPage";
import { DEMO } from "@/data/demoFlow";
import { ko } from "@/messages";

export default function ProfilePage() {
  return (
    <DemoPlaceholderPage
      title={ko.demo.profileTitle}
      description={ko.demo.profileDescription}
      primaryHref={`/orders/${DEMO.orderId}`}
      primaryLabel={ko.demo.profileOrder}
    />
  );
}

import { DemoPlaceholderPage } from "@/components/demo/DemoPlaceholderPage";
import { ko } from "@/messages";

export default function CustomRequestNewPage() {
  return (
    <DemoPlaceholderPage
      title={ko.demo.customRequestTitle}
      description={ko.demo.customRequestDescription}
    />
  );
}

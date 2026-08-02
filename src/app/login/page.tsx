import { DemoPlaceholderPage } from "@/components/demo/DemoPlaceholderPage";
import { ko } from "@/messages";

export default function LoginPage() {
  return (
    <DemoPlaceholderPage
      title={ko.demo.loginTitle}
      description={ko.demo.loginDescription}
      primaryHref="/seller"
      primaryLabel={ko.demo.loginSeller}
    />
  );
}

import { redirect } from "next/navigation";

export default function SellerSettingsRedirect() {
  redirect("/seller/coming-soon?feature=settings");
}

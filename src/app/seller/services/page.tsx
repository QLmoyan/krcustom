import { redirect } from "next/navigation";

export default function SellerServicesRedirect() {
  redirect("/seller/coming-soon?feature=services");
}

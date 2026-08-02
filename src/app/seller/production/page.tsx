import { redirect } from "next/navigation";

export default function SellerProductionRedirect() {
  redirect("/seller/orders");
}

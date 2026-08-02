import { redirect } from "next/navigation";

export default function SellerShipmentsRedirect() {
  redirect("/seller/orders");
}

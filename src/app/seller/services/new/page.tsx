import { redirect } from "next/navigation";

export default function SellerNewServiceRedirect() {
  redirect("/seller/coming-soon?feature=newService");
}

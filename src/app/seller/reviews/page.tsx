import { redirect } from "next/navigation";

export default function SellerReviewsRedirect() {
  redirect("/seller/coming-soon?feature=reviews");
}

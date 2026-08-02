import { DemoPlaceholderPage } from "@/components/demo/DemoPlaceholderPage";
import { ko } from "@/messages";

type SellerComingSoonProps = {
  searchParams: Promise<{ feature?: string }>;
};

export default async function SellerComingSoonPage({
  searchParams,
}: SellerComingSoonProps) {
  const { feature = "" } = await searchParams;
  const titles = ko.demo.sellerFeatureTitles as Record<string, string>;
  const title = titles[feature] || ko.demo.sellerComingSoonFallback;

  return (
    <DemoPlaceholderPage
      title={`${title} ${ko.demo.sellerComingSoonSuffix}`}
      description={ko.demo.sellerComingSoonDescription}
      primaryHref="/seller"
      primaryLabel={ko.demo.sellerComingSoonAction}
    />
  );
}

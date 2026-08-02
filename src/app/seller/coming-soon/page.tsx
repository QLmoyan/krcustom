import { DemoPlaceholderPage } from "@/components/demo/DemoPlaceholderPage";

type SellerComingSoonProps = {
  searchParams: Promise<{ feature?: string }>;
};

const titles: Record<string, string> = {
  services: "서비스 관리",
  messages: "메시지",
  production: "제작 보드",
  shipments: "반송·배송",
  reviews: "리뷰 관리",
  settings: "상점 설정",
  newService: "서비스 등록",
};

export default async function SellerComingSoonPage({
  searchParams,
}: SellerComingSoonProps) {
  const { feature = "" } = await searchParams;
  const title = titles[feature] || "판매자 기능";

  return (
    <DemoPlaceholderPage
      title={`${title} (준비 중)`}
      description="이 메뉴는 데모에서 아직 별도 페이지로 열리지 않습니다. 주문·견적·시안·고객 물품 메뉴에서 데모 흐름을 이어가 주세요."
      primaryHref="/seller"
      primaryLabel="판매자 대시보드"
    />
  );
}

import type { Store } from "@/types";

export const mockStores: Store[] = [
  {
    id: "store-001",
    name: "프린트랩 서울",
    logo: "https://picsum.photos/seed/krcustom-store1/128/128",
    rating: 4.8,
    reviewCount: 594,
    responseTime: "평균 15분",
    completedOrders: 4280,
    verified: true,
    categories: ["의류 인쇄", "스티커"],
  },
  {
    id: "store-002",
    name: "굿즈메이커",
    logo: "https://picsum.photos/seed/krcustom-store2/128/128",
    rating: 4.7,
    reviewCount: 312,
    responseTime: "평균 28분",
    completedOrders: 1960,
    verified: true,
    categories: ["굿즈 제작", "머그컵"],
  },
  {
    id: "store-003",
    name: "아크릴공방",
    logo: "https://picsum.photos/seed/krcustom-store3/128/128",
    rating: 4.9,
    reviewCount: 451,
    responseTime: "평균 12분",
    completedOrders: 3510,
    verified: true,
    categories: ["아크릴 제작", "키링"],
  },
  {
    id: "store-004",
    name: "스티치하우스",
    logo: "https://picsum.photos/seed/krcustom-store4/128/128",
    rating: 4.9,
    reviewCount: 128,
    responseTime: "평균 22분",
    completedOrders: 870,
    verified: true,
    categories: ["자수", "고객 소지품 커스텀"],
  },
];

export function getStoreById(id: string): Store | undefined {
  return mockStores.find((store) => store.id === id);
}

export type SellerTaskPriority = "high" | "medium" | "low";

export type SellerTaskType =
  | "message"
  | "quote"
  | "designProof"
  | "ownedItem"
  | "production"
  | "returnShipment";

export type SellerOrderType =
  | "directPurchase"
  | "quote"
  | "customerOwnedItem";

export interface SellerDashboardStat {
  id: string;
  title: string;
  count: number;
  description: string;
  tone: "brand" | "accent" | "warning" | "success" | "neutral";
  href: string;
}

export interface SellerTodoItem {
  id: string;
  type: SellerTaskType;
  title: string;
  orderNumber: string;
  customerName: string;
  dueTime: string;
  priority: SellerTaskPriority;
  status: string;
  nextAction: string;
}

export interface SellerRecentMessage {
  id: string;
  customerName: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  serviceTitle: string;
  conversationId: string;
}

export type ProductionColumnId =
  | "awaitingItem"
  | "designWork"
  | "inProduction"
  | "inspecting"
  | "awaitingReturn";

export interface ProductionCard {
  id: string;
  orderNumber: string;
  customerName: string;
  serviceTitle: string;
  dueDate: string;
  status: string;
}

export interface ProductionColumn {
  id: ProductionColumnId;
  title: string;
  cards: ProductionCard[];
}

export interface SellerRecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  serviceTitle: string;
  amount: number;
  orderType: SellerOrderType;
  status: string;
  updatedAt: string;
}

export interface SellerDashboardMock {
  storeName: string;
  sellerName: string;
  stats: SellerDashboardStat[];
  todos: SellerTodoItem[];
  recentMessages: SellerRecentMessage[];
  productionBoard: ProductionColumn[];
  recentOrders: SellerRecentOrder[];
}

export const mockSellerDashboard: SellerDashboardMock = {
  storeName: "스티치하우스",
  sellerName: "김판매",
  stats: [
    {
      id: "stat-messages",
      title: "답변 대기 메시지",
      count: 12,
      description: "고객 문의에 응답이 필요합니다.",
      tone: "accent",
      href: "/project/prj-001",
    },
    {
      id: "stat-quotes",
      title: "견적 작성 대기",
      count: 4,
      description: "요청된 견적서를 작성해 주세요.",
      tone: "brand",
      href: "/seller/quotes",
    },
    {
      id: "stat-proofs",
      title: "시안 확인 요청",
      count: 3,
      description: "고객 확인을 기다리는 시안이 있습니다.",
      tone: "warning",
      href: "/seller/design-proofs",
    },
    {
      id: "stat-owned",
      title: "고객 물품 수령 대기",
      count: 2,
      description: "발송된 고객 물품을 확인해 주세요.",
      tone: "warning",
      href: "/seller/customer-items",
    },
    {
      id: "stat-production",
      title: "제작 진행 중",
      count: 8,
      description: "현재 제작·검수 중인 주문입니다.",
      tone: "success",
      href: "/seller/orders",
    },
    {
      id: "stat-return",
      title: "반송 등록 대기",
      count: 5,
      description: "완성 물품의 반송 운송장을 등록하세요.",
      tone: "neutral",
      href: "/seller/orders",
    },
  ],
  todos: [
    {
      id: "todo-01",
      type: "ownedItem",
      title: "고객 물품 수령 확인",
      orderNumber: "ORD-20260714-014",
      customerName: "이서연",
      dueTime: "오늘 11:00",
      priority: "high",
      status: "고객 발송 완료",
      nextAction: "수령 확인",
    },
    {
      id: "todo-02",
      type: "message",
      title: "시안 위치 문의 답변",
      orderNumber: "ORD-20260713-088",
      customerName: "박민준",
      dueTime: "오늘 12:30",
      priority: "high",
      status: "답변 대기",
      nextAction: "바로 답변",
    },
    {
      id: "todo-03",
      type: "quote",
      title: "양면 인쇄 견적 작성",
      orderNumber: "ORD-20260714-021",
      customerName: "최유진",
      dueTime: "오늘 14:00",
      priority: "high",
      status: "견적 요청",
      nextAction: "견적 작성",
    },
    {
      id: "todo-04",
      type: "designProof",
      title: "수정 시안 업로드",
      orderNumber: "ORD-20260712-056",
      customerName: "정하은",
      dueTime: "오늘 16:00",
      priority: "medium",
      status: "수정 요청",
      nextAction: "시안 업로드",
    },
    {
      id: "todo-05",
      type: "returnShipment",
      title: "반송 운송장 등록",
      orderNumber: "ORD-20260710-033",
      customerName: "한지우",
      dueTime: "오늘 17:30",
      priority: "medium",
      status: "제작 완료",
      nextAction: "반송 등록",
    },
    {
      id: "todo-06",
      type: "production",
      title: "제작 진행 사진 업로드",
      orderNumber: "ORD-20260711-019",
      customerName: "오세훈",
      dueTime: "내일 10:00",
      priority: "medium",
      status: "제작 중",
      nextAction: "진행 업로드",
    },
    {
      id: "todo-07",
      type: "ownedItem",
      title: "물품 라벨 출력",
      orderNumber: "ORD-20260714-015",
      customerName: "윤소희",
      dueTime: "내일 11:00",
      priority: "low",
      status: "수령 완료",
      nextAction: "라벨 인쇄",
    },
    {
      id: "todo-08",
      type: "quote",
      title: "기업 단체복 견적 검토",
      orderNumber: "ORD-20260713-102",
      customerName: "김도윤",
      dueTime: "내일 15:00",
      priority: "low",
      status: "견적 초안",
      nextAction: "견적 확인",
    },
  ],
  recentMessages: [
    {
      id: "msg-01",
      customerName: "박민준",
      lastMessage: "시안 위치를 가슴 중앙으로 옮길 수 있을까요?",
      time: "10분 전",
      unreadCount: 3,
      serviceTitle: "티셔츠 맞춤 인쇄",
      conversationId: "prj-001",
    },
    {
      id: "msg-02",
      customerName: "이서연",
      lastMessage: "오늘 오전에 택배를 보냈습니다. 주문번호 첨부했어요.",
      time: "28분 전",
      unreadCount: 2,
      serviceTitle: "고객 소지품 자수",
      conversationId: "conv-1002",
    },
    {
      id: "msg-03",
      customerName: "최유진",
      lastMessage: "50장 기준 단가와 급행 가능 여부를 알려 주세요.",
      time: "1시간 전",
      unreadCount: 1,
      serviceTitle: "기업 판촉물 제작",
      conversationId: "conv-1003",
    },
    {
      id: "msg-04",
      customerName: "정하은",
      lastMessage: "수정 요청드린 부분 반영됐는지 확인해 주세요.",
      time: "2시간 전",
      unreadCount: 4,
      serviceTitle: "아크릴 키링 제작",
      conversationId: "conv-1004",
    },
    {
      id: "msg-05",
      customerName: "한지우",
      lastMessage: "반송 주소가 맞는지 한 번만 더 확인 부탁드립니다.",
      time: "어제",
      unreadCount: 0,
      serviceTitle: "머그컵 사진 제작",
      conversationId: "conv-1005",
    },
  ],
  productionBoard: [
    {
      id: "awaitingItem",
      title: "물품 수령 대기",
      cards: [
        {
          id: "pc-01",
          orderNumber: "ORD-20260714-014",
          customerName: "이서연",
          serviceTitle: "고객 소지품 자수",
          dueDate: "2026.07.15",
          status: "고객 발송 완료",
        },
        {
          id: "pc-02",
          orderNumber: "ORD-20260714-018",
          customerName: "강미래",
          serviceTitle: "고객 소지품 자수",
          dueDate: "2026.07.16",
          status: "고객 발송 대기",
        },
      ],
    },
    {
      id: "designWork",
      title: "시안 작업",
      cards: [
        {
          id: "pc-03",
          orderNumber: "ORD-20260712-056",
          customerName: "정하은",
          serviceTitle: "아크릴 키링 제작",
          dueDate: "2026.07.15",
          status: "수정 요청",
        },
        {
          id: "pc-04",
          orderNumber: "ORD-20260713-088",
          customerName: "박민준",
          serviceTitle: "티셔츠 맞춤 인쇄",
          dueDate: "2026.07.15",
          status: "시안 작성 중",
        },
      ],
    },
    {
      id: "inProduction",
      title: "제작 중",
      cards: [
        {
          id: "pc-05",
          orderNumber: "ORD-20260711-019",
          customerName: "오세훈",
          serviceTitle: "티셔츠 맞춤 인쇄",
          dueDate: "2026.07.16",
          status: "인쇄 진행",
        },
        {
          id: "pc-06",
          orderNumber: "ORD-20260710-041",
          customerName: "배수아",
          serviceTitle: "스티커 소량 인쇄",
          dueDate: "2026.07.15",
          status: "재단 중",
        },
      ],
    },
    {
      id: "inspecting",
      title: "검수 중",
      cards: [
        {
          id: "pc-07",
          orderNumber: "ORD-20260709-027",
          customerName: "송지호",
          serviceTitle: "LED 간판 주문 제작",
          dueDate: "2026.07.15",
          status: "최종 검수",
        },
        {
          id: "pc-08",
          orderNumber: "ORD-20260708-012",
          customerName: "임나래",
          serviceTitle: "행사 현수막 제작",
          dueDate: "2026.07.14",
          status: "색상 확인",
        },
      ],
    },
    {
      id: "awaitingReturn",
      title: "반송 대기",
      cards: [
        {
          id: "pc-09",
          orderNumber: "ORD-20260710-033",
          customerName: "한지우",
          serviceTitle: "머그컵 사진 제작",
          dueDate: "2026.07.15",
          status: "제작 완료",
        },
        {
          id: "pc-10",
          orderNumber: "ORD-20260707-009",
          customerName: "노은별",
          serviceTitle: "고객 소지품 자수",
          dueDate: "2026.07.15",
          status: "라벨 부착 완료",
        },
      ],
    },
  ],
  recentOrders: [
    {
      id: "so-01",
      orderNumber: "ORD-20260714-021",
      customerName: "최유진",
      serviceTitle: "기업 판촉물 제작",
      amount: 480000,
      orderType: "quote",
      status: "견적 요청",
      updatedAt: "2026.07.15 09:40",
    },
    {
      id: "ord-001",
      orderNumber: "ORD-20260714-014",
      customerName: "이서연",
      serviceTitle: "고객 소지품 자수",
      amount: 64800,
      orderType: "customerOwnedItem",
      status: "고객 발송 완료",
      updatedAt: "2026.07.15 09:12",
    },
    {
      id: "so-03",
      orderNumber: "ORD-20260713-088",
      customerName: "박민준",
      serviceTitle: "티셔츠 맞춤 인쇄",
      amount: 120000,
      orderType: "directPurchase",
      status: "시안 확인 대기",
      updatedAt: "2026.07.15 08:55",
    },
    {
      id: "so-04",
      orderNumber: "ORD-20260712-056",
      customerName: "정하은",
      serviceTitle: "아크릴 키링 제작",
      amount: 45500,
      orderType: "quote",
      status: "수정 요청",
      updatedAt: "2026.07.14 21:18",
    },
    {
      id: "so-05",
      orderNumber: "ORD-20260711-019",
      customerName: "오세훈",
      serviceTitle: "티셔츠 맞춤 인쇄",
      amount: 96000,
      orderType: "directPurchase",
      status: "제작 중",
      updatedAt: "2026.07.14 16:40",
    },
    {
      id: "so-06",
      orderNumber: "ORD-20260710-033",
      customerName: "한지우",
      serviceTitle: "머그컵 사진 제작",
      amount: 26700,
      orderType: "directPurchase",
      status: "반송 등록 대기",
      updatedAt: "2026.07.14 11:05",
    },
  ],
};

import { DesignProofStatus } from "@/constants/status";
import type {
  DesignProof,
  DesignProofListItem,
  DesignProofTimeline,
} from "@/types/DesignProof";
import type { TimelineEvent } from "@/types/TimelineEvent";
import type { UploadedFile } from "@/types/UploadedFile";

function previewFile(
  id: string,
  seed: string,
  uploadedAt: string,
  name = "시안 미리보기.jpg",
): UploadedFile {
  const url = `https://picsum.photos/seed/${seed}/960/720`;
  const thumb = `https://picsum.photos/seed/${seed}/320/240`;
  return {
    id,
    name,
    originalName: name,
    mimeType: "image/jpeg",
    extension: "jpg",
    size: 420_000,
    category: "IMAGE",
    url,
    thumbnailUrl: thumb,
    uploadedBy: "스티치하우스",
    uploadedAt,
    status: "READY",
  };
}

function sourceFile(
  id: string,
  name: string,
  category: UploadedFile["category"],
  extension: string,
  mimeType: string,
  uploadedAt: string,
): UploadedFile {
  return {
    id,
    name,
    originalName: name,
    mimeType,
    extension,
    size: 1_250_000,
    category,
    url: "#",
    thumbnailUrl: "",
    uploadedBy: "스티치하우스",
    uploadedAt,
    status: "READY",
  };
}

export const mockDesignProofs: DesignProof[] = [
  {
    id: "dp-prj001-v1",
    proofNumber: "DP-20260711-001",
    projectId: "prj-001",
    projectNumber: "PRJ-20260714-014",
    quoteId: "quote-prj001-v3",
    version: 1,
    status: DesignProofStatus.REVISION_REQUESTED,
    title: "기본 위치 시안",
    description: "왼쪽 가슴 기본 배치 초안",
    changeSummary: "초기 시안 발송",
    files: [
      sourceFile(
        "f-v1-psd",
        "logo-base.psd",
        "PSD",
        "psd",
        "image/vnd.adobe.photoshop",
        "2026.07.11 15:00",
      ),
    ],
    previewImages: [
      previewFile("p-v1-1", "krcustom-dp-v1a", "2026.07.11 15:05"),
      previewFile("p-v1-2", "krcustom-dp-v1b", "2026.07.11 15:06"),
    ],
    sellerNote: "기본 왼쪽 가슴 위치에 로고를 배치한 시안입니다.",
    customerNote: "위치를 조금 더 안으로 옮겨 주세요.",
    revisionReason: "위치 수정 요청",
    createdBy: "스티치하우스",
    confirmedBy: "",
    sentAt: "2026.07.11 15:10",
    confirmedAt: "",
    lockedAt: "",
    createdAt: "2026.07.11 15:00",
    updatedAt: "2026.07.11 18:20",
    serviceName: "고객 소지품 자수",
    customerName: "이서연",
    storeName: "스티치하우스",
    isCurrentConfirmed: false,
  },
  {
    id: "dp-prj001-v2",
    proofNumber: "DP-20260712-002",
    projectId: "prj-001",
    projectNumber: "PRJ-20260714-014",
    quoteId: "quote-prj001-v3",
    version: 2,
    status: DesignProofStatus.REVISION_REQUESTED,
    title: "위치 조정 시안",
    description: "고객 요청에 따라 위치를 안쪽으로 조정",
    changeSummary: "위치 안쪽 이동 반영",
    files: [
      sourceFile(
        "f-v2-psd",
        "logo-pos-v2.psd",
        "PSD",
        "psd",
        "image/vnd.adobe.photoshop",
        "2026.07.12 11:00",
      ),
      sourceFile(
        "f-v2-pdf",
        "proof-v2.pdf",
        "PDF",
        "pdf",
        "application/pdf",
        "2026.07.12 11:02",
      ),
    ],
    previewImages: [
      previewFile("p-v2-1", "krcustom-dp-v2a", "2026.07.12 11:05"),
      previewFile("p-v2-2", "krcustom-dp-v2b", "2026.07.12 11:06"),
      previewFile("p-v2-3", "krcustom-dp-v2c", "2026.07.12 11:07"),
    ],
    sellerNote: "요청하신 위치로 로고를 이동했습니다. 확인해 주세요.",
    customerNote: "로고를 조금 더 크게 해 주세요.",
    revisionReason: "로고 크기 확대 요청",
    createdBy: "스티치하우스",
    confirmedBy: "",
    sentAt: "2026.07.12 11:20",
    confirmedAt: "",
    lockedAt: "",
    createdAt: "2026.07.12 11:00",
    updatedAt: "2026.07.12 14:30",
    serviceName: "고객 소지품 자수",
    customerName: "이서연",
    storeName: "스티치하우스",
    isCurrentConfirmed: false,
  },
  {
    id: "dp-prj001-v3",
    proofNumber: "DP-20260712-003",
    projectId: "prj-001",
    projectNumber: "PRJ-20260714-014",
    quoteId: "quote-prj001-v3",
    version: 3,
    status: DesignProofStatus.CONFIRMED,
    title: "로고 확대 시안",
    description: "로고 크기를 확대한 확인용 시안",
    changeSummary: "로고 크기 확대 반영",
    files: [
      sourceFile(
        "f-v3-psd",
        "logo-size-v3.psd",
        "PSD",
        "psd",
        "image/vnd.adobe.photoshop",
        "2026.07.12 16:00",
      ),
    ],
    previewImages: [
      previewFile("p-v3-1", "krcustom-dp-v3a", "2026.07.12 16:10"),
      previewFile("p-v3-2", "krcustom-dp-v3b", "2026.07.12 16:11"),
    ],
    sellerNote:
      "요청하신 크기로 로고를 확대했습니다. 네이비 실 색상은 유지했습니다.",
    customerNote: "이 시안으로 확인했습니다.",
    revisionReason: "",
    createdBy: "스티치하우스",
    confirmedBy: "이서연",
    sentAt: "2026.07.12 16:20",
    confirmedAt: "2026.07.12 17:05",
    lockedAt: "",
    createdAt: "2026.07.12 16:00",
    updatedAt: "2026.07.12 17:05",
    serviceName: "고객 소지품 자수",
    customerName: "이서연",
    storeName: "스티치하우스",
    isCurrentConfirmed: false,
  },
  {
    id: "dp-prj001-v4",
    proofNumber: "DP-20260712-004",
    projectId: "prj-001",
    projectNumber: "PRJ-20260714-014",
    quoteId: "quote-prj001-v3",
    version: 4,
    status: DesignProofStatus.LOCKED,
    title: "최종 제작 시안",
    description: "고객 확인본을 최종 제작용으로 잠근 버전",
    changeSummary: "최종 제작 시안 잠금",
    files: [
      sourceFile(
        "f-v4-psd",
        "logo-final-v4.psd",
        "PSD",
        "psd",
        "image/vnd.adobe.photoshop",
        "2026.07.12 17:15",
      ),
      sourceFile(
        "f-v4-pdf",
        "proof-final-v4.pdf",
        "PDF",
        "pdf",
        "application/pdf",
        "2026.07.12 17:16",
      ),
    ],
    previewImages: [
      previewFile("p-v4-1", "krcustom-dp-v4a", "2026.07.12 17:18"),
      previewFile("p-v4-2", "krcustom-dp-v4b", "2026.07.12 17:19"),
    ],
    sellerNote:
      "V3 확인본을 최종 제작 시안으로 잠갔습니다. 이후 변경은 새 버전이 필요합니다.",
    customerNote: "최종 제작 시안으로 확정되었습니다.",
    revisionReason: "",
    createdBy: "스티치하우스",
    confirmedBy: "이서연",
    sentAt: "2026.07.12 17:20",
    confirmedAt: "2026.07.12 17:05",
    lockedAt: "2026.07.12 17:25",
    createdAt: "2026.07.12 17:15",
    updatedAt: "2026.07.12 17:25",
    serviceName: "고객 소지품 자수",
    customerName: "이서연",
    storeName: "스티치하우스",
    isCurrentConfirmed: true,
  },
  {
    id: "dp-prj002-v1",
    proofNumber: "DP-20260714-010",
    projectId: "prj-002",
    projectNumber: "PRJ-20260713-088",
    quoteId: "quote-prj002-v1",
    version: 1,
    status: DesignProofStatus.CONFIRMATION_PENDING,
    title: "단체 티셔츠 시안",
    description: "20장 단체 주문용 첫 시안",
    changeSummary: "초안 발송",
    files: [],
    previewImages: [
      previewFile("p-p2-1", "krcustom-dp-p2a", "2026.07.14 16:30"),
    ],
    sellerNote: "가슴 중앙 배치 초안입니다. 확인해 주세요.",
    customerNote: "",
    revisionReason: "",
    createdBy: "프린트랩 서울",
    confirmedBy: "",
    sentAt: "2026.07.14 16:40",
    confirmedAt: "",
    lockedAt: "",
    createdAt: "2026.07.14 16:30",
    updatedAt: "2026.07.14 16:40",
    serviceName: "티셔츠 맞춤 인쇄",
    customerName: "박민준",
    storeName: "프린트랩 서울",
    isCurrentConfirmed: false,
  },
  {
    id: "dp-prj003-v1",
    proofNumber: "DP-20260715-021",
    projectId: "prj-003",
    projectNumber: "PRJ-20260715-021",
    quoteId: "",
    version: 1,
    status: DesignProofStatus.DRAFT,
    title: "작성 중 시안",
    description: "판매자 작성 중인 초안",
    changeSummary: "임시 저장",
    files: [],
    previewImages: [
      previewFile("p-p3-1", "krcustom-dp-p3a", "2026.07.15 09:10"),
    ],
    sellerNote: "초안 작업 중입니다.",
    customerNote: "",
    revisionReason: "",
    createdBy: "스티치하우스",
    confirmedBy: "",
    sentAt: "",
    confirmedAt: "",
    lockedAt: "",
    createdAt: "2026.07.15 09:10",
    updatedAt: "2026.07.15 09:10",
    serviceName: "에코백 인쇄",
    customerName: "최유진",
    storeName: "스티치하우스",
    isCurrentConfirmed: false,
  },
];

export const mockDesignProofTimelineByProject: Record<
  string,
  DesignProofTimeline
> = {
  "prj-001": [
    {
      id: "dpt-1",
      type: "design_proof",
      title: "시안 V1 발송",
      description: "기본 위치 시안을 고객에게 보냈습니다.",
      status: "COMPLETED",
      actorType: "SELLER",
      actorName: "스티치하우스",
      occurredAt: "2026.07.11 15:10",
    },
    {
      id: "dpt-2",
      type: "design_proof",
      title: "고객 수정 요청",
      description: "위치 이동을 요청했습니다.",
      status: "COMPLETED",
      actorType: "CUSTOMER",
      actorName: "이서연",
      occurredAt: "2026.07.11 18:20",
    },
    {
      id: "dpt-3",
      type: "design_proof",
      title: "시안 V2 발송",
      description: "위치 조정본을 발송했습니다.",
      status: "COMPLETED",
      actorType: "SELLER",
      actorName: "스티치하우스",
      occurredAt: "2026.07.12 11:20",
    },
    {
      id: "dpt-4",
      type: "design_proof",
      title: "고객 수정 요청",
      description: "로고 확대를 요청했습니다.",
      status: "COMPLETED",
      actorType: "CUSTOMER",
      actorName: "이서연",
      occurredAt: "2026.07.12 14:30",
    },
    {
      id: "dpt-5",
      type: "design_proof",
      title: "시안 V3 발송",
      description: "로고 확대본을 발송했습니다.",
      status: "COMPLETED",
      actorType: "SELLER",
      actorName: "스티치하우스",
      occurredAt: "2026.07.12 16:20",
    },
    {
      id: "dpt-6",
      type: "design_proof",
      title: "고객 시안 확인",
      description: "V3 시안을 확인했습니다.",
      status: "COMPLETED",
      actorType: "CUSTOMER",
      actorName: "이서연",
      occurredAt: "2026.07.12 17:05",
    },
    {
      id: "dpt-7",
      type: "design_proof",
      title: "최종 시안 잠금",
      description: "V4가 최종 제작 시안으로 잠겼습니다.",
      status: "CURRENT",
      actorType: "SELLER",
      actorName: "스티치하우스",
      occurredAt: "2026.07.12 17:25",
    },
  ],
  "prj-002": [
    {
      id: "dpt-p2-1",
      type: "design_proof",
      title: "시안 V1 발송",
      description: "고객 확인을 기다리는 중입니다.",
      status: "CURRENT",
      actorType: "SELLER",
      actorName: "프린트랩 서울",
      occurredAt: "2026.07.14 16:40",
    },
  ],
};

export function getDesignProofById(id: string): DesignProof | undefined {
  return mockDesignProofs.find((proof) => proof.id === id);
}

export function getDesignProofsByProjectId(projectId: string): DesignProof[] {
  return mockDesignProofs
    .filter((proof) => proof.projectId === projectId)
    .sort((a, b) => b.version - a.version);
}

export function getLatestDesignProof(
  projectId: string,
): DesignProof | undefined {
  return getDesignProofsByProjectId(projectId)[0];
}

export function getCurrentConfirmedDesignProof(
  projectId: string,
): DesignProof | undefined {
  return getDesignProofsByProjectId(projectId).find(
    (proof) => proof.isCurrentConfirmed,
  );
}

export function getDesignProofTimeline(
  projectId: string,
): TimelineEvent[] {
  return mockDesignProofTimelineByProject[projectId] ?? [];
}

export function getDesignProofListItems(): DesignProofListItem[] {
  const byProject = new Map<string, DesignProof[]>();
  for (const proof of mockDesignProofs) {
    const list = byProject.get(proof.projectId) ?? [];
    list.push(proof);
    byProject.set(proof.projectId, list);
  }

  return [...byProject.entries()]
    .map(([, proofs]) => {
      const sorted = [...proofs].sort((a, b) => b.version - a.version);
      const latest = sorted[0];
      if (!latest) return null;
      return {
        id: latest.id,
        projectId: latest.projectId,
        projectNumber: latest.projectNumber,
        serviceName: latest.serviceName,
        customerName: latest.customerName,
        storeName: latest.storeName,
        latestVersion: latest.version,
        latestProofId: latest.id,
        status: latest.status,
        recentFeedback: latest.customerNote || latest.revisionReason || "-",
        updatedAt: latest.updatedAt,
        thumbnailUrl: latest.previewImages[0]?.thumbnailUrl ?? "",
      } satisfies DesignProofListItem;
    })
    .filter((item): item is DesignProofListItem => item != null)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getDesignProofStats(
  items: DesignProofListItem[] = getDesignProofListItems(),
) {
  const allProofs = mockDesignProofs;
  return {
    drafting: allProofs.filter((p) => p.status === DesignProofStatus.DRAFT)
      .length,
    awaitingCustomer: allProofs.filter(
      (p) =>
        p.status === DesignProofStatus.SENT ||
        p.status === DesignProofStatus.CONFIRMATION_PENDING,
    ).length,
    revisionRequested: allProofs.filter(
      (p) => p.status === DesignProofStatus.REVISION_REQUESTED,
    ).length,
    confirmed: allProofs.filter(
      (p) => p.status === DesignProofStatus.CONFIRMED,
    ).length,
    locked: allProofs.filter((p) => p.status === DesignProofStatus.LOCKED)
      .length,
    projects: items.length,
  };
}

export function isDesignProofLocked(proof: DesignProof): boolean {
  return proof.status === DesignProofStatus.LOCKED;
}

export function canEditDesignProof(proof: DesignProof): boolean {
  return !isDesignProofLocked(proof);
}

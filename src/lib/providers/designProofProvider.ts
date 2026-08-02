import { DesignProofStatus } from "@/constants/status";
import {
  getDesignProofById as getMockDesignProofById,
  getDesignProofListItems as getMockDesignProofListItems,
  getDesignProofsByProjectId as getMockDesignProofsByProjectId,
  getDesignProofStats as getMockDesignProofStats,
  getDesignProofTimeline as getMockDesignProofTimeline,
  getLatestDesignProof as getMockLatestDesignProof,
} from "@/data/mockDesignProofs";
import { formatKoreanDateTime } from "@/lib/format";
import * as designProofRepository from "@/repositories/designProof";
import type { DesignProofWithVersions } from "@/repositories/designProof";
import type {
  DesignProof,
  DesignProofListItem,
} from "@/types/DesignProof";
import type { DesignProofVersionRow } from "@/types/database";
import type { TimelineEvent } from "@/types/TimelineEvent";
import type { UploadedFile } from "@/types/UploadedFile";

export type DesignProofDataSource = "supabase" | "mock";

export type DesignProofsResult = {
  proofs: DesignProof[];
  source: DesignProofDataSource;
};

export type DesignProofResult = {
  proof: DesignProof | undefined;
  source: DesignProofDataSource;
};

export type DesignProofListResult = {
  items: DesignProofListItem[];
  source: DesignProofDataSource;
};

function displayOrEmpty(value: string | null | undefined): string {
  if (!value) return "";
  return formatKoreanDateTime(value);
}

function parseNotes(notes: string): {
  changeSummary: string;
  title: string;
  sellerNote: string;
  customerNote: string;
  revisionReason: string;
} {
  const parts = notes.split("|");
  return {
    changeSummary: parts[0]?.trim() ?? "",
    title: parts[1]?.trim() ?? "",
    sellerNote: parts[2]?.trim() ?? "",
    customerNote: parts[3]?.trim() ?? "",
    revisionReason: parts[4]?.trim() ?? "",
  };
}

function previewFromVersion(
  version: DesignProofVersionRow,
  uploadedAt: string,
): UploadedFile[] {
  if (!version.image_url) return [];
  return [
    {
      id: version.demo_key ? `${version.demo_key}-img` : version.id,
      name: "시안 미리보기.jpg",
      originalName: "시안 미리보기.jpg",
      mimeType: "image/jpeg",
      extension: "jpg",
      size: 420_000,
      category: "IMAGE",
      url: version.image_url,
      thumbnailUrl: version.thumbnail_url || version.image_url,
      uploadedBy: "스티치하우스",
      uploadedAt,
      status: "READY",
    },
  ];
}

function versionStatus(
  versionNo: number,
  proof: DesignProofWithVersions,
  mock?: DesignProof,
): DesignProof["status"] {
  if (mock?.status) return mock.status;
  if (versionNo === proof.current_version) {
    return proof.status as DesignProof["status"];
  }
  if (versionNo < proof.current_version) {
    return DesignProofStatus.REVISION_REQUESTED;
  }
  return DesignProofStatus.SENT;
}

/**
 * Map DB proof + one version row to frontend DesignProof.
 * Keeps demo_key as DesignProof.id / project demo_key as projectId for routes.
 */
export function mapVersionToDesignProof(
  proof: DesignProofWithVersions,
  version: DesignProofVersionRow,
): DesignProof {
  const projectDemoKey = proof.projects?.demo_key ?? null;
  const demoId = version.demo_key ?? proof.demo_key ?? version.id;
  const mock = getMockDesignProofById(demoId);
  const notes = parseNotes(version.notes ?? "");
  const createdAt = displayOrEmpty(version.created_at);
  const updatedAt = displayOrEmpty(proof.updated_at);
  const status = versionStatus(version.version_no, proof, mock);
  const isCurrent = version.version_no === proof.current_version;
  const approvedDisplay = displayOrEmpty(proof.approved_at);

  return {
    id: demoId,
    proofNumber: mock?.proofNumber ?? `DP-${version.version_no}`,
    projectId: projectDemoKey ?? proof.project_id,
    projectNumber:
      mock?.projectNumber ??
      proof.projects?.project_number ??
      "",
    quoteId: mock?.quoteId ?? "",
    version: version.version_no,
    status,
    title: notes.title || mock?.title || `시안 V${version.version_no}`,
    description: mock?.description ?? notes.changeSummary,
    changeSummary: notes.changeSummary || mock?.changeSummary || "",
    files: mock?.files ?? [],
    previewImages:
      previewFromVersion(version, createdAt).length > 0
        ? previewFromVersion(version, createdAt)
        : (mock?.previewImages ?? []),
    sellerNote:
      (isCurrent ? proof.seller_comment : "") ||
      notes.sellerNote ||
      mock?.sellerNote ||
      "",
    customerNote:
      (isCurrent ? proof.customer_comment : "") ||
      notes.customerNote ||
      mock?.customerNote ||
      "",
    revisionReason: notes.revisionReason || mock?.revisionReason || "",
    createdBy: mock?.createdBy ?? "스티치하우스",
    confirmedBy:
      status === DesignProofStatus.CONFIRMED ||
      status === DesignProofStatus.LOCKED
        ? (mock?.confirmedBy ?? "이서연")
        : "",
    sentAt: createdAt || mock?.sentAt || "",
    confirmedAt:
      isCurrent && proof.approved_at
        ? approvedDisplay
        : (mock?.confirmedAt ?? ""),
    lockedAt: mock?.lockedAt ?? "",
    createdAt: createdAt || mock?.createdAt || "",
    updatedAt: isCurrent ? updatedAt : createdAt || mock?.updatedAt || "",
    serviceName: mock?.serviceName ?? "고객 소지품 자수",
    customerName: mock?.customerName ?? "이서연",
    storeName: mock?.storeName ?? "스티치하우스",
    isCurrentConfirmed:
      isCurrent &&
      (proof.status === DesignProofStatus.CONFIRMED ||
        proof.status === DesignProofStatus.LOCKED),
  };
}

function mapProofToDesignProofs(proof: DesignProofWithVersions): DesignProof[] {
  return (proof.design_proof_versions ?? [])
    .slice()
    .sort((a, b) => b.version_no - a.version_no)
    .map((version) => mapVersionToDesignProof(proof, version));
}

/**
 * Merge DB versions with mock extras (e.g. V4 LOCKED) so demo routes keep working.
 */
function mergeProjectProofs(
  fromDb: DesignProof[],
  projectIdentifier: string,
): DesignProof[] {
  const keys = new Set(fromDb.map((p) => p.id));
  const versionNos = new Set(fromDb.map((p) => p.version));
  const extras = getMockDesignProofsByProjectId(projectIdentifier).filter(
    (p) => !keys.has(p.id) && !versionNos.has(p.version),
  );

  // When DB current is CONFIRMED, demote mock LOCKED "current confirmed" if DB V3 is present
  const hasDbCurrent = fromDb.some((p) => p.isCurrentConfirmed);
  const mergedExtras = hasDbCurrent
    ? extras.map((p) =>
        p.isCurrentConfirmed ? { ...p, isCurrentConfirmed: false } : p,
      )
    : extras;

  return [...fromDb, ...mergedExtras].sort((a, b) => b.version - a.version);
}

function proofsToListItems(proofs: DesignProof[]): DesignProofListItem[] {
  const byProject = new Map<string, DesignProof[]>();
  for (const proof of proofs) {
    const list = byProject.get(proof.projectId) ?? [];
    list.push(proof);
    byProject.set(proof.projectId, list);
  }

  return [...byProject.entries()]
    .map(([, list]) => {
      const sorted = [...list].sort((a, b) => b.version - a.version);
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

function mergeSellerListItems(
  fromDb: DesignProofListItem[],
): DesignProofListItem[] {
  const projectIds = new Set(fromDb.map((i) => i.projectId));
  const extras = getMockDesignProofListItems().filter(
    (i) => !projectIds.has(i.projectId),
  );
  return [...fromDb, ...extras].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
}

/**
 * Design proofs for a project workspace.
 * Resolves project UUID or demo_key (prj-001); falls back to mockDesignProofs.
 */
export async function getDesignProofsByProjectId(
  projectIdentifier: string,
): Promise<DesignProofsResult> {
  try {
    const rows = await designProofRepository.listByProject(projectIdentifier);
    if (rows.length > 0) {
      const mapped = rows.flatMap(mapProofToDesignProofs);
      const projectKey = rows[0]?.projects?.demo_key ?? projectIdentifier;
      return {
        proofs: mergeProjectProofs(mapped, projectKey),
        source: "supabase",
      };
    }
  } catch {
    // Supabase unavailable / missing tables / RLS → mock
  }

  return {
    proofs: getMockDesignProofsByProjectId(projectIdentifier),
    source: "mock",
  };
}

export async function getLatestDesignProof(
  projectIdentifier: string,
): Promise<DesignProofResult> {
  const { proofs, source } = await getDesignProofsByProjectId(projectIdentifier);
  if (proofs.length > 0) {
    return { proof: proofs[0], source };
  }

  return {
    proof: getMockLatestDesignProof(projectIdentifier),
    source: "mock",
  };
}

export async function getDesignProofById(
  identifier: string,
): Promise<DesignProofResult> {
  try {
    const row = await designProofRepository.getById(identifier);
    if (row) {
      const mapped = mapProofToDesignProofs(row);
      const match =
        mapped.find((p) => p.id === identifier) ??
        mapped.find((p) => p.version === row.current_version) ??
        mapped[0];
      if (match) {
        return { proof: match, source: "supabase" };
      }
    }
  } catch {
    // fall through
  }

  return {
    proof: getMockDesignProofById(identifier),
    source: "mock",
  };
}

/**
 * Seller design-proof list. Prefers Supabase; merges mock projects so the
 * seller list stays complete. Empty/fail → mock.
 * Signed-in SELLER filters by profile.id via projects.seller_id.
 */
export async function listForSeller(): Promise<DesignProofListResult> {
  try {
    const { getCurrentActorContext } = await import(
      "@/lib/providers/authProvider"
    );
    const actor = await getCurrentActorContext();
    const filter =
      actor?.role === "SELLER" ? { sellerId: actor.profileId } : undefined;

    const rows = await designProofRepository.listForSeller(filter);
    if (rows.length === 0) {
      return { items: getMockDesignProofListItems(), source: "mock" };
    }

    const fromDb = proofsToListItems(rows.flatMap(mapProofToDesignProofs));
    return {
      items: mergeSellerListItems(fromDb),
      source: "supabase",
    };
  } catch {
    return { items: getMockDesignProofListItems(), source: "mock" };
  }
}

/** Stats chips for seller list; uses mock version catalogue + live project count. */
export function getDesignProofStats(items: DesignProofListItem[]) {
  return getMockDesignProofStats(items);
}

/** Timeline stays mock until a later sprint. */
export async function getDesignProofTimeline(
  projectIdentifier: string,
): Promise<TimelineEvent[]> {
  return getMockDesignProofTimeline(projectIdentifier);
}

export async function createVersion(
  input: Parameters<typeof designProofRepository.createVersion>[0],
) {
  return designProofRepository.createVersion(input);
}

export async function approve(
  identifier: string,
  customerComment?: string,
) {
  return designProofRepository.approve(identifier, customerComment);
}

export async function reject(
  identifier: string,
  customerComment?: string,
) {
  return designProofRepository.reject(identifier, customerComment);
}

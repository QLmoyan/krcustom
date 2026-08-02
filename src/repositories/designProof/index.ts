import { createClient } from "@/lib/supabase/server";
import { isProjectUuid } from "@/repositories/project";
import type {
  DesignProofInsert,
  DesignProofRow,
  DesignProofUpdate,
  DesignProofVersionInsert,
  DesignProofVersionRow,
} from "@/types/database";

export { isProjectUuid as isDesignProofUuid };

export type DesignProofWithVersions = DesignProofRow & {
  design_proof_versions: DesignProofVersionRow[];
  projects: { id: string; demo_key: string | null; project_number: string } | null;
};

const PROOF_SELECT = `
  *,
  design_proof_versions (*),
  projects ( id, demo_key, project_number )
`;

async function resolveProjectUuid(identifier: string): Promise<string | null> {
  const supabase = await createClient();
  if (isProjectUuid(identifier)) {
    return identifier;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("id")
    .eq("demo_key", identifier)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.id ?? null;
}

/**
 * Load a design proof by UUID primary key, or by demo_key
 * (proof: dp-prj001, or version: dp-prj001-v3).
 */
export async function getById(
  identifier: string,
): Promise<DesignProofWithVersions | null> {
  const supabase = await createClient();

  if (isProjectUuid(identifier)) {
    const { data, error } = await supabase
      .from("design_proofs")
      .select(PROOF_SELECT)
      .eq("id", identifier)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as DesignProofWithVersions | null;
  }

  const { data: byProofKey, error: proofError } = await supabase
    .from("design_proofs")
    .select(PROOF_SELECT)
    .eq("demo_key", identifier)
    .maybeSingle();

  if (proofError) {
    throw proofError;
  }

  if (byProofKey) {
    return byProofKey as DesignProofWithVersions;
  }

  const { data: versionRow, error: versionError } = await supabase
    .from("design_proof_versions")
    .select("proof_id")
    .eq("demo_key", identifier)
    .maybeSingle();

  if (versionError) {
    throw versionError;
  }

  if (!versionRow) {
    return null;
  }

  const { data, error } = await supabase
    .from("design_proofs")
    .select(PROOF_SELECT)
    .eq("id", versionRow.proof_id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as DesignProofWithVersions | null;
}

/**
 * List design proofs for a project (UUID id or demo_key like prj-001).
 */
export async function listByProject(
  projectIdentifier: string,
): Promise<DesignProofWithVersions[]> {
  const projectId = await resolveProjectUuid(projectIdentifier);
  if (!projectId) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("design_proofs")
    .select(PROOF_SELECT)
    .eq("project_id", projectId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as DesignProofWithVersions[];
}

export type DesignProofSellerFilter = {
  sellerId?: string;
};

/** Seller design-proof list — newest first; optional seller via project ids. */
export async function listForSeller(
  filter?: DesignProofSellerFilter,
): Promise<DesignProofWithVersions[]> {
  const supabase = await createClient();

  let projectIds: string[] | null = null;
  if (filter?.sellerId) {
    const { data: projects, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("seller_id", filter.sellerId);

    if (projectError) {
      throw projectError;
    }

    projectIds = (projects ?? []).map((p) => p.id);
    if (projectIds.length === 0) {
      return [];
    }
  }

  let query = supabase
    .from("design_proofs")
    .select(PROOF_SELECT)
    .order("updated_at", { ascending: false });

  if (projectIds) {
    query = query.in("project_id", projectIds);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as DesignProofWithVersions[];
}

/** Current (latest) version row for a project proof, or null. */
export async function getCurrentVersion(
  projectIdentifier: string,
): Promise<DesignProofVersionRow | null> {
  const proofs = await listByProject(projectIdentifier);
  const proof = proofs[0];
  if (!proof) {
    return null;
  }

  const versions = proof.design_proof_versions ?? [];
  return (
    versions.find((v) => v.version_no === proof.current_version) ??
    versions.slice().sort((a, b) => b.version_no - a.version_no)[0] ??
    null
  );
}

/** Historical versions for a project, newest first. */
export async function getHistoryVersions(
  projectIdentifier: string,
): Promise<DesignProofVersionRow[]> {
  const proofs = await listByProject(projectIdentifier);
  const proof = proofs[0];
  if (!proof) {
    return [];
  }

  return (proof.design_proof_versions ?? [])
    .slice()
    .sort((a, b) => b.version_no - a.version_no);
}

/** Review status for the project's design proof. */
export async function getStatus(
  projectIdentifier: string,
): Promise<string | null> {
  const proofs = await listByProject(projectIdentifier);
  return proofs[0]?.status ?? null;
}

type CreateVersionInput = {
  projectId: string;
  imageUrl: string;
  thumbnailUrl?: string;
  notes?: string;
  demoKey?: string | null;
  sellerComment?: string;
  status?: string;
};

/**
 * Append a new design proof version. Does not overwrite existing versions.
 * Creates the parent proof row if missing.
 */
export async function createVersion(
  input: CreateVersionInput,
): Promise<DesignProofWithVersions> {
  const projectId = await resolveProjectUuid(input.projectId);
  if (!projectId) {
    throw new Error(`Project not found: ${input.projectId}`);
  }

  const supabase = await createClient();
  const existingList = await listByProject(projectId);
  let proof = existingList[0] ?? null;

  if (!proof) {
    const insert: DesignProofInsert = {
      project_id: projectId,
      current_version: 1,
      status: input.status ?? "SENT",
      seller_comment: input.sellerComment ?? "",
      customer_comment: "",
      demo_key: null,
    };

    const { data: created, error } = await supabase
      .from("design_proofs")
      .insert(insert)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    proof = {
      ...created,
      design_proof_versions: [],
      projects: null,
    };
  }

  const nextVersion =
    Math.max(0, ...(proof.design_proof_versions ?? []).map((v) => v.version_no)) +
    1;

  const versionInsert: DesignProofVersionInsert = {
    proof_id: proof.id,
    version_no: nextVersion,
    image_url: input.imageUrl,
    thumbnail_url: input.thumbnailUrl ?? "",
    notes: input.notes ?? "",
    demo_key: input.demoKey ?? null,
  };

  const { error: versionError } = await supabase
    .from("design_proof_versions")
    .insert(versionInsert);

  if (versionError) {
    throw versionError;
  }

  const patch: DesignProofUpdate = {
    current_version: nextVersion,
    status: input.status ?? "SENT",
    seller_comment: input.sellerComment ?? proof.seller_comment,
    approved_at: null,
    rejected_at: null,
  };

  const { error: updateError } = await supabase
    .from("design_proofs")
    .update(patch)
    .eq("id", proof.id);

  if (updateError) {
    throw updateError;
  }

  const full = await getById(proof.id);
  if (!full) {
    throw new Error("Created design proof version could not be reloaded");
  }
  return full;
}

/**
 * In-place status change for workflow transitions.
 */
export async function updateStatus(
  identifier: string,
  status: string,
): Promise<DesignProofWithVersions> {
  const existing = await getById(identifier);
  if (!existing) {
    throw new Error(`Design proof not found: ${identifier}`);
  }

  const supabase = await createClient();
  const patch: DesignProofUpdate = { status };
  const { error } = await supabase
    .from("design_proofs")
    .update(patch)
    .eq("id", existing.id);

  if (error) {
    throw error;
  }

  const full = await getById(existing.id);
  if (!full) {
    throw new Error("Updated design proof could not be reloaded");
  }
  return full;
}

export async function approve(
  identifier: string,
  customerComment?: string,
): Promise<DesignProofWithVersions> {
  const existing = await getById(identifier);
  if (!existing) {
    throw new Error(`Design proof not found: ${identifier}`);
  }

  const supabase = await createClient();
  const patch: DesignProofUpdate = {
    status: "CONFIRMED",
    approved_at: new Date().toISOString(),
    rejected_at: null,
    customer_comment:
      customerComment !== undefined
        ? customerComment
        : existing.customer_comment,
  };

  const { error } = await supabase
    .from("design_proofs")
    .update(patch)
    .eq("id", existing.id);

  if (error) {
    throw error;
  }

  const full = await getById(existing.id);
  if (!full) {
    throw new Error("Approved design proof could not be reloaded");
  }
  return full;
}

export async function reject(
  identifier: string,
  customerComment?: string,
): Promise<DesignProofWithVersions> {
  const existing = await getById(identifier);
  if (!existing) {
    throw new Error(`Design proof not found: ${identifier}`);
  }

  const supabase = await createClient();
  const patch: DesignProofUpdate = {
    status: "REVISION_REQUESTED",
    rejected_at: new Date().toISOString(),
    approved_at: null,
    customer_comment:
      customerComment !== undefined
        ? customerComment
        : existing.customer_comment,
  };

  const { error } = await supabase
    .from("design_proofs")
    .update(patch)
    .eq("id", existing.id);

  if (error) {
    throw error;
  }

  const full = await getById(existing.id);
  if (!full) {
    throw new Error("Rejected design proof could not be reloaded");
  }
  return full;
}

import { DEMO } from "@/data/demoFlow";
import {
  getProjectById as getMockProjectById,
  mockProjects,
} from "@/data/mockProject";
import * as projectRepository from "@/repositories/project";
import type { ProjectInsert, ProjectRow, ProjectUpdate } from "@/types/database";
import type { ProjectWorkspace } from "@/types/Project";

export type ProjectDataSource = "supabase" | "mock";

export type ProjectListResult = {
  projects: ProjectRow[];
  source: ProjectDataSource;
};

export type ProjectWorkspaceResult = {
  project: ProjectWorkspace | undefined;
  source: ProjectDataSource;
};

const MOCK_FALLBACK_UUID = "00000000-0000-4000-8000-000000000001";

function mockWorkspaceToRow(workspace: ProjectWorkspace): ProjectRow {
  return {
    id: MOCK_FALLBACK_UUID,
    service_id: "00000000-0000-4000-8000-000000000002",
    customer_id: "00000000-0000-4000-8000-000000000003",
    seller_id: "00000000-0000-4000-8000-000000000004",
    status: workspace.status.currentStatus,
    title: workspace.status.title,
    description: workspace.status.serviceTitle,
    project_number: workspace.status.projectNumber,
    demo_key: workspace.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function mergeRowIntoWorkspace(
  workspace: ProjectWorkspace,
  row: ProjectRow,
): ProjectWorkspace {
  return {
    ...workspace,
    // Keep frontend / route demo id (prj-001); DB PK stays on row.id
    id: workspace.id,
    status: {
      ...workspace.status,
      projectNumber: row.project_number || workspace.status.projectNumber,
      title: row.title || workspace.status.title,
      currentStatus: row.status || workspace.status.currentStatus,
      serviceTitle: row.description || workspace.status.serviceTitle,
    },
  };
}

/**
 * Project Workspace for /project/[id].
 * Resolves UUID or demo_key via repository; falls back to mockProject.
 * Nested modules (chat / quote / proofs) still use mock until later sprints.
 */
export async function getProjectById(
  identifier: string,
): Promise<ProjectWorkspaceResult> {
  try {
    const exists = await projectRepository.existsProject(identifier);
    if (exists) {
      const row = await projectRepository.getProjectById(identifier);
      if (row) {
        const mockKey = row.demo_key ?? identifier;
        const mock =
          getMockProjectById(mockKey) ??
          getMockProjectById(identifier) ??
          getMockProjectById(DEMO.projectId);
        if (mock) {
          return {
            project: mergeRowIntoWorkspace(mock, row),
            source: "supabase",
          };
        }
      }
    }
  } catch {
    // Supabase unavailable / missing columns / RLS → mock
  }

  return {
    project: getMockProjectById(identifier),
    source: "mock",
  };
}

/**
 * Project list for seller surfaces.
 * Prefers Supabase rows; empty or failed reads fall back to mock-derived rows.
 */
export async function listProjects(): Promise<ProjectListResult> {
  try {
    const projects = await projectRepository.listProjects();
    if (projects.length === 0) {
      return {
        projects: mockProjects.map(mockWorkspaceToRow),
        source: "mock",
      };
    }
    return { projects, source: "supabase" };
  } catch {
    return {
      projects: mockProjects.map(mockWorkspaceToRow),
      source: "mock",
    };
  }
}

export async function createProject(
  input: ProjectInsert,
): Promise<ProjectRow> {
  return projectRepository.createProject(input);
}

export async function updateProject(
  id: string,
  input: ProjectUpdate,
): Promise<ProjectRow> {
  return projectRepository.updateProject(id, input);
}

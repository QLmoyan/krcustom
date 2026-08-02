/**
 * Korean copy for workflow side-effects (timeline / notification / chat).
 * Kept here (not ko.ts UI surface) so status engines stay self-contained.
 */

import type { WorkflowDomain } from "@/constants/workflow";
import { getStatusLabel } from "@/constants/status";
import type { NotificationTypeCode } from "@/lib/providers/notificationProvider";

export function workflowTimelineTitle(
  domain: WorkflowDomain,
  toStatus: string,
): string {
  const label = getStatusLabel(domain, toStatus, toStatus);
  switch (domain) {
    case "project":
      return label;
    case "quote":
      return label;
    case "designProof":
      return label;
    case "order":
      return label;
  }
}

export function workflowTimelineDescription(
  domain: WorkflowDomain,
  fromStatus: string,
  toStatus: string,
): string {
  const fromLabel = getStatusLabel(domain, fromStatus, fromStatus);
  const toLabel = getStatusLabel(domain, toStatus, toStatus);
  return `${fromLabel} → ${toLabel}`;
}

export function workflowNotificationTitle(
  domain: WorkflowDomain,
  toStatus: string,
): string {
  return workflowTimelineTitle(domain, toStatus);
}

export function workflowNotificationBody(
  domain: WorkflowDomain,
  fromStatus: string,
  toStatus: string,
): string {
  return workflowTimelineDescription(domain, fromStatus, toStatus);
}

export function workflowChatBody(
  domain: WorkflowDomain,
  fromStatus: string,
  toStatus: string,
): string {
  return workflowTimelineDescription(domain, fromStatus, toStatus);
}

/** Map domain + target status onto existing notification type constraint. */
export function resolveNotificationType(
  domain: WorkflowDomain,
  toStatus: string,
): NotificationTypeCode {
  if (domain === "quote") return "QUOTE_UPDATED";
  if (domain === "designProof") {
    if (toStatus === "CONFIRMED" || toStatus === "LOCKED") {
      return "DESIGN_APPROVED";
    }
    return "DESIGN_UPLOADED";
  }
  if (domain === "order") {
    switch (toStatus) {
      case "PAID":
        return "ORDER_PAID";
      case "IN_PRODUCTION":
        return "PRODUCTION_STARTED";
      case "SHIPPED":
        return "SHIPPED";
      case "DELIVERED":
      case "COMPLETED":
        return "DELIVERED";
      default:
        return "ORDER_CREATED";
    }
  }
  // project
  switch (toStatus) {
    case "PAID":
      return "ORDER_PAID";
    case "IN_PRODUCTION":
      return "PRODUCTION_STARTED";
    case "RETURN_SHIPPED":
      return "SHIPPED";
    case "COMPLETED":
      return "DELIVERED";
    case "DESIGN_PROOF_CONFIRMED":
      return "DESIGN_APPROVED";
    case "QUOTE_SENT":
    case "QUOTE_ACCEPTED":
      return "QUOTE_UPDATED";
    default:
      return "ORDER_CREATED";
  }
}

export function defaultLinkPath(
  domain: WorkflowDomain,
  entityId: string,
  projectId?: string | null,
): string {
  const projectKey = projectId ?? "prj-001";
  switch (domain) {
    case "project":
      return `/project/${entityId}`;
    case "quote":
      return `/project/${projectKey}/quote`;
    case "designProof":
      return `/design-proofs/${entityId}`;
    case "order":
      return `/orders/${entityId}`;
  }
}

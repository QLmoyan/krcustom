export {
  canTransition,
  getAllowedTransitions,
  PROJECT_TRANSITIONS,
  QUOTE_TRANSITIONS,
  DESIGN_PROOF_TRANSITIONS,
  ORDER_TRANSITIONS,
  WORKFLOW_TRANSITIONS,
  type TransitionMap,
  type WorkflowDomain,
} from "@/constants/workflow";

export {
  applyWorkflowEvent,
  transitionProject,
  transitionQuote,
  transitionDesignProof,
  transitionOrder,
  type WorkflowDataSource,
  type WorkflowEventInput,
  type WorkflowTransitionInput,
  type WorkflowTransitionResult,
} from "@/lib/workflow/service";

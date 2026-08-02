import { redirect } from "next/navigation";
import { DEMO } from "@/data/demoFlow";

export default function MessagesPage() {
  redirect(`/project/${DEMO.projectId}`);
}

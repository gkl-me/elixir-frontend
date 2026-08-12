"use client";

import { use } from "react";
import { SingleProjectView } from "@/components/workspace/views/projects/SingleProjectView";

export default function SingleProjectPage({
  params,
}: {
  params: Promise<{ slug: string; projectId: string; view?: string[] }>;
}) {
  const resolvedParams = use(params);
  const activeView = resolvedParams.view?.[0] || "overview";

  return <SingleProjectView activeView={activeView} />;
}

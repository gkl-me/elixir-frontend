"use client";

import {
  useWorkspaceStore,
  WorkspaceContext,
} from "@/store/useWorkspaceContext";
import { useRef } from "react";

export function WorkspaceContextProvider({
  context,
  children,
}: {
  context: WorkspaceContext;
  children: React.ReactNode;
}) {
  // Use getState() to avoid creating a reactive subscription here —
  // we just need the setter, not a re-render trigger.
  const setContext = useWorkspaceStore.getState().setContext;

  // Set context synchronously on the very first render so children
  // never see a null context. The ref guard prevents re-setting on
  // subsequent re-renders of this provider.
  const initialized = useRef(false);
  if (!initialized.current) {
    setContext(context);
    initialized.current = true;
  }

  return <>{children}</>;
}

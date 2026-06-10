import { create } from "zustand";

export type WorkspaceContext = {
  name: string;
  email: string;
  avatarUrl: string;
  workspaceId: string;
  workspaceName: string;
  workspaceSlug: string;
  isOwner: boolean;
  hasOwnWorkspace: boolean;
  memberId: string;
  roleId: string;
  roleKey: string;
  permissions: string[];
  allPermissions?: string[];
  permissionDependencies?: Record<string, string[]>;
  builtinRoles?: Record<string, string[]>;
};

interface WorkspaceStore {
  context: WorkspaceContext | null;
  setContext: (context: WorkspaceContext) => void;
  clearContext: () => void;

  updateUser: (user: {
    name?: string;
    avatarUrl?: string;
    email?: string;
  }) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  context: null,
  setContext: (context) => set({ context }),

  clearContext: () => set({ context: null }),

  updateUser: (user) =>
    set((state) => {
      if (!state.context) {
        return state;
      }
      return {
        context: {
          ...state.context,
          name: user.name ?? state.context.name,
          email: user.email ?? state.context.email,
          avatarUrl: user.avatarUrl ?? state.context.avatarUrl,
        },
      };
    }),
}));

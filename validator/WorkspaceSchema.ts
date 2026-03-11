import { z } from "zod";

export const WorkspaceSchema = z.object({
  workspaceName: z
    .string()
    .trim()
    .min(2, "Workspace name must be at least 2 characters")
    .max(100, "Workspace name cannot exceed 100 characters")
    .refine((val) => val.trim().length > 0, {
      message: "Workspace name cannot be empty",
    }),
});
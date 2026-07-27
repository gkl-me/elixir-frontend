import { JWTPayload } from "jose";

export interface ITokenPayload extends JWTPayload {
  id: string;
  role: string;
}

export interface IAuthSession {
  accessToken?: string;
  hasWorkspace?: boolean;
  workspaceSlug?: string;
}

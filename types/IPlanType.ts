import { PlanType } from "./IOnboardingTypes";

export interface IPlan {
  id: string;
  type: "Free" | "Pro" | "Enterprice";
  name: string;
  price: number;
  limits: {
    projects: number;
    teams: number;
    members: number;
    customRoles: number;
    storageBytes: number;
  };
  features: {
    githubAutomation: boolean;
    automationScripts: boolean;
  };
  isActive: boolean;
}

export interface ICreatePlanData {
  name: string;
  type: PlanType;
  price?: number;
  limits?: {
    projects?: number;
    teams?: number;
    members?: number;
    customRoles?: number;
    storageBytes?: number;
  };
  features?: {
    githubAutomation?: boolean;
    automationScripts?: boolean;
  };
}

export interface ITogglePlanStatusData {
  planId: string;
}

export interface IGetPlanData {
  limit?: number;
  page?: number;
}

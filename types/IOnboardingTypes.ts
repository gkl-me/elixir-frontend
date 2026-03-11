export type PlanType = "Free" | "Pro" | "Enterprice";

export interface IOnboardingState {
  currentStep: number;
  isCompleted: boolean;

  paymentStatus: "pending" | "incomplete" | "failed" | "success";

  planType: PlanType;
  planId: string;
  planPrice: number;

  workspaceName?: string;

  company?: {
    name: string;
    type: string;
    email: string;
    phone: string;
    size: number;
  };
}

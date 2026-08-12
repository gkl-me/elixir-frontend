export interface IVerifyPaymentData {
  sessionId?: string;
}

export interface BillingInfoData {
  workspaceId: string;
}

export interface ICustomerPortalData {
  workspaceId: string;
}

export interface UpgradeCheckoutData {
  workspaceId: string;
  planId: string;
  company?: {
    name: string;
    email: string;
    type: string;
    size: number;
    phone: string | number;
  };
}

export interface GetAllCompanyData {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
}

export interface ToggleCompanyStatusData {
  companyId: string;
}

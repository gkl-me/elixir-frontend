export interface GetAllCompanyData {
  page?: string;
  limit?: string;
  search?: string;
}

export interface ToggleCompanyStatusData {
  companyId: string
}

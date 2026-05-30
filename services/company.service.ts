import { COMPANY_API_ROUTES } from "@/constants/apiRoutes";
import api from "@/lib/api";
import { GetAllCompanyData } from "@/types/ICompanyType";

export const companyService = {
  getAllCompany: async (params: GetAllCompanyData) => {
    return api.get(COMPANY_API_ROUTES.GET_ALL_COMPANY, {
      params: params,
    });
  },
};

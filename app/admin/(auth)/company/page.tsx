export const dynamic = "force-dynamic";

import CompanyDataTable from "@/components/company/CompanyDataTable";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { companyService } from "@/services/company.service";



export default async function CompanyPage(){

    let data;

    try {
        const res = await companyService.getAllCompany({})
        data = res.data.data
        // console.log("server res",res.data.data)
    } catch (error) {
        throw new Error(AxiosErrorHandler(error).message)
    }

    return (
     <div className="space-y-6">
       <CompanyDataTable initialData={data.companies} initialTotalCount={data.totalCount}  />
    </div>
    )
}
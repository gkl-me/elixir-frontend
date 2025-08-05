import { RegisterCompanySchema } from "@/validator/company/CompanySchema";
import CustomForm, { CustomFormProps } from "../forms/CustomForm";
import { z } from "zod";



const fields:CustomFormProps<typeof RegisterCompanySchema>['fields'] = [
    {
        name:'name',
        label:'Company Name',
        type:'text',
        placeholder:'Enter your company name'
    },{
        name:'email',
        label:'Company Email',
        type:'text',
        placeholder:'Enter your company email'
    },{
        name:'website',
        label:'Company Webite',
        type:'text',
        placeholder:'Enter your company website'
    },{
        name:'industry',
        label:'Industry',
        type:'text',
        placeholder:'Enter your company industry'
    },{
        name:'totalEmployees',
        label:'Total Employees',
        type:'text',
        placeholder:'Enter your total employee count'
    },{
        name:'country',
        label:'Country',
        type:'text',
        placeholder:'Enter your country'
    }
]


export  default function RegisterCompanyForm(){

    const handleSubmit = async (data:z.infer<typeof RegisterCompanySchema>) => {
        console.log(data)
    }

    return (
        <CustomForm
            buttonText="Subscribe"
            defaultValues={{
                name:"",
                email:"",
                website:"",
                industry:"",
                totalEmployees:0,
                country:""
            }}
            fields={fields}
            onSubmit={handleSubmit}
            schema={RegisterCompanySchema}
            isLoading={false}
        />
    )

}
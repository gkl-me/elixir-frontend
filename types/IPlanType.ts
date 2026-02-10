







export interface IPlan{
    id:string
    name:string
    price:number,
    limits:{
        projects:number,
        teams:number,
        members:number,
        customRoles:number,
        storageBytes:number
    },
    features:{
        githubAutomation:boolean,
        automationScripts:boolean
    }
}




export interface IUpdatePlanData{
    price?:number,
    limits?:{
        projects?:number,
        teams?:number,
        members?:number,
        customRoles?:number,
        storageBytes?:number
    },
    features?:{
        githubAutomation?:boolean,
        automationScripts?:boolean
    }
}
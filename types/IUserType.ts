

export interface GetAllUsersData{
    search?:string,
    status?:string,
    page?:string,
    limit?:string,
    sortBy?:string,
    sortOrder?:string
}


export interface ToggleUserStatusData {
    userId:string
}
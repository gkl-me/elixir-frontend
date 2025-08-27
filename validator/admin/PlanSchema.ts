import {z} from 'zod'

export const CreatePlanSchema =  z.object({
    name:z.enum(['Free','Pro','Enterprice'],{}),
    price:z.coerce.number({required_error:'Price is required'}).min(0).max(200),
    limits:z.object({
        maxProjects:z.coerce.number({required_error:"Number of projects is required"}).min(0).max(100),
        maxTeams:z.coerce.number({required_error:"Number of teams is required"}).min(0).max(100),
        maxUsersPerTeam:z.coerce.number({required_error:"Number of users is required"}).min(0).max(100)
    }),
    isActive:z.boolean()
})

export const UpdatePlanSchema = CreatePlanSchema.partial()
export type UpdatePlanType = z.infer<typeof UpdatePlanSchema>
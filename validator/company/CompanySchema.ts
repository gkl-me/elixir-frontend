import { z } from 'zod';

export const RegisterCompanySchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Company name must be at least 2 characters' })
    .max(100, { message: 'Company name must be under 100 characters' }),
  
  email: z
    .string()
    .email({ message: 'Invalid email address' }),

  website: z
    .string()
    .transform((val) => {
      if (!/^https?:\/\//i.test(val)) {
        return `https://${val}`
      }
      return val
    })
    .refine((val) => {
      try {
        new URL(val)
        return true
      } catch {
        return false
      }
    }, { message: "Invalid website URL" }),

  industry: z
    .string()
    .min(2, { message: 'Industry must be specified' }),

  totalEmployees: 
    z.coerce.number({ invalid_type_error: 'Total employees must be a number' })
    .min(1, { message: 'Must have at least 1 employee' }),

  country: z
    .string()
    .min(2, { message: 'Country is required' }),
});

import { z } from 'zod'

// Password validation schema
const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password must be less than 128 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')

// Email validation schema
const emailSchema = z
    .string()
    .email('Please provide a valid email address')
    .transform((email) => email.toLowerCase())

// Register schema
export const registerSchema = z.object({
    body: z.object({
        email: emailSchema,
        password: passwordSchema,
        firstName: z
            .string()
            .min(1, 'First name cannot be empty')
            .max(50, 'First name must be less than 50 characters')
            .optional(),
        lastName: z
            .string()
            .min(1, 'Last name cannot be empty')
            .max(50, 'Last name must be less than 50 characters')
            .optional(),
    })
})

// Login schema
export const loginSchema = z.object({
    body: z.object({
        email: emailSchema,
        password: z.string().min(1, 'Password is required'),
    })
})

// Refresh token schema
export const refreshTokenSchema = z.object({
    body: z.object({
        refreshToken: z.string().min(1, 'Refresh token is required'),
    })
})

// Change password schema
export const changePasswordSchema = z.object({
    body: z.object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: passwordSchema,
    })
})

// Type exports for TypeScript
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
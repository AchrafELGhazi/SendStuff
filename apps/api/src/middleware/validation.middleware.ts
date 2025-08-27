import type { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'

export const validate = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            })

            next()
        } catch (error) {
            if (error instanceof ZodError) {
                const errors: Record<string, string[]> = {}

                error.issues.forEach((issue) => {
                    const path = issue.path.slice(1).join('.') || issue.path.join('.')
                    if (!errors[path]) {
                        errors[path] = []
                    }
                    errors[path].push(issue.message)
                })

                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors
                })
            }

            return res.status(400).json({
                success: false,
                message: 'Invalid request data'
            })
        }
    }
}
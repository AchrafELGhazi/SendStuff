import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt'

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string
                email: string
                organizationId?: string
                role?: string
            }
        }
    }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        const token = extractTokenFromHeader(authHeader)

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            })
        }

        const decoded = verifyAccessToken(token)

        req.user = {
            id: decoded.userId,
            email: decoded.email,
            organizationId: decoded.organizationId,
            role: decoded.role,
        }

        next()
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Authentication failed'

        return res.status(401).json({
            success: false,
            message
        })
    }
}

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        const token = extractTokenFromHeader(authHeader)

        if (token) {
            const decoded = verifyAccessToken(token)
            req.user = {
                id: decoded.userId,
                email: decoded.email,
                organizationId: decoded.organizationId,
                role: decoded.role,
            }
        }

        next()
    } catch (error) {
        next()
    }
}

export const requireRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            })
        }

        if (!req.user.role || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            })
        }

        next()
    }
}

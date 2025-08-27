import jwt from 'jsonwebtoken'

interface JwtPayload {
    userId: string
    email: string
    organizationId?: string
    role?: string
}

interface TokenPair {
    accessToken: string
    refreshToken: string
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production'
const ACCESS_TOKEN_EXPIRES_IN = '15m'
const REFRESH_TOKEN_EXPIRES_IN = '7d'

export const generateTokenPair = (payload: JwtPayload): TokenPair => {
    const accessToken = jwt.sign(payload, JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    })

    const refreshToken = jwt.sign(
        { userId: payload.userId },
        JWT_REFRESH_SECRET,
        {
            expiresIn: REFRESH_TOKEN_EXPIRES_IN,
        }
    )

    return { accessToken, refreshToken }
}

export const verifyAccessToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Access token expired')
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid access token')
        }
        throw new Error('Token verification failed')
    }
}

export const verifyRefreshToken = (token: string): { userId: string } => {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Refresh token expired')
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid refresh token')
        }
        throw new Error('Token verification failed')
    }
}

export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null
    }
    return authHeader.substring(7)
}

export const getTokenExpirationTime = (token: string): Date | null => {
    try {
        const decoded = jwt.decode(token) as any
        if (decoded && decoded.exp) {
            return new Date(decoded.exp * 1000)
        }
        return null
    } catch {
        return null
    }
}
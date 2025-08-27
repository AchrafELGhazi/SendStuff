import bcrypt from 'bcrypt'
import { prisma, UserStatus, UserRole } from '@sendstuff/database'
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt'

export interface RegisterData {
    email: string
    password: string
    firstName?: string
    lastName?: string
}

export interface LoginData {
    email: string
    password: string
}

export interface AuthResponse {
    user: {
        id: string
        email: string
        firstName: string | null
        lastName: string | null
        status: UserStatus
    }
    tokens: {
        accessToken: string
        refreshToken: string
    }
    organization?: {
        id: string
        name: string
        slug: string
        role: UserRole
    }
}

const SALT_ROUNDS = 12

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase() }
    })

    if (existingUser) {
        throw new Error('User already exists with this email')
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)

    const user = await prisma.user.create({
        data: {
            email: data.email.toLowerCase(),
            password: hashedPassword,
            firstName: data.firstName,
            lastName: data.lastName,
            status: UserStatus.PENDING_VERIFICATION,
        }
    })

    const tokens = generateTokenPair({
        userId: user.id,
        email: user.email,
    })

    return {
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            status: user.status,
        },
        tokens
    }
}

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
    const user = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase() },
        include: {
            organizationMembers: {
                include: {
                    organization: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        }
                    }
                },
                take: 1,
                orderBy: {
                    joinedAt: 'asc'
                }
            }
        }
    })

    if (!user) {
        throw new Error('Invalid email or password')
    }

    if (user.status === UserStatus.SUSPENDED) {
        throw new Error('Account is suspended')
    }

    if (user.status === UserStatus.INACTIVE) {
        throw new Error('Account is inactive')
    }

    if (!user.password) {
        throw new Error('Invalid email or password')
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password)
    if (!isValidPassword) {
        throw new Error('Invalid email or password')
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
    })

    const primaryOrg = user.organizationMembers[0]

    const tokens = generateTokenPair({
        userId: user.id,
        email: user.email,
        organizationId: primaryOrg?.organizationId,
        role: primaryOrg?.role,
    })

    return {
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            status: user.status,
        },
        tokens,
        organization: primaryOrg ? {
            id: primaryOrg.organization.id,
            name: primaryOrg.organization.name,
            slug: primaryOrg.organization.slug,
            role: primaryOrg.role,
        } : undefined
    }
}

export const refreshUserToken = async (refreshToken: string): Promise<{ accessToken: string }> => {
    try {
        const decoded = verifyRefreshToken(refreshToken)

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                organizationMembers: {
                    include: {
                        organization: true
                    },
                    take: 1,
                    orderBy: {
                        joinedAt: 'asc'
                    }
                }
            }
        })

        if (!user) {
            throw new Error('User not found')
        }

        if (user.status !== UserStatus.ACTIVE && user.status !== UserStatus.PENDING_VERIFICATION) {
            throw new Error('User account is not active')
        }

        const primaryOrg = user.organizationMembers[0]

        const { accessToken } = generateTokenPair({
            userId: user.id,
            email: user.email,
            organizationId: primaryOrg?.organizationId,
            role: primaryOrg?.role,
        })

        return { accessToken }
    } catch (error) {
        throw new Error('Invalid refresh token')
    }
}

export const getCurrentUser = async (userId: string): Promise<AuthResponse['user'] & { organization?: AuthResponse['organization'] }> => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            organizationMembers: {
                include: {
                    organization: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        }
                    }
                },
                take: 1,
                orderBy: {
                    joinedAt: 'asc'
                }
            }
        }
    })

    if (!user) {
        throw new Error('User not found')
    }

    const primaryOrg = user.organizationMembers[0]

    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
        organization: primaryOrg ? {
            id: primaryOrg.organization.id,
            name: primaryOrg.organization.name,
            slug: primaryOrg.organization.slug,
            role: primaryOrg.role,
        } : undefined
    }
}

export const verifyUserEmail = async (userId: string): Promise<void> => {
    await prisma.user.update({
        where: { id: userId },
        data: {
            status: UserStatus.ACTIVE,
            emailVerified: new Date(),
        }
    })
}

export const changeUserPassword = async (userId: string, oldPassword: string, newPassword: string): Promise<void> => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    })

    if (!user || !user.password) {
        throw new Error('User not found')
    }

    const isValidPassword = await bcrypt.compare(oldPassword, user.password)
    if (!isValidPassword) {
        throw new Error('Current password is incorrect')
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)

    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
    })
}
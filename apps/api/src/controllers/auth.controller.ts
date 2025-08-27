import type { Request, Response } from 'express'
import {
    registerUser,
    loginUser,
    refreshUserToken,
    getCurrentUser,
    verifyUserEmail,
    changeUserPassword
} from '../services/auth.service'

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, firstName, lastName } = req.body

        const result = await registerUser({
            email,
            password,
            firstName,
            lastName
        })

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed'
        res.status(400).json({
            success: false,
            message
        })
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body

        const result = await loginUser({ email, password })

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed'
        res.status(401).json({
            success: false,
            message
        })
    }
}

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body

        const result = await refreshUserToken(refreshToken)

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: result
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Token refresh failed'
        res.status(401).json({
            success: false,
            message
        })
    }
}

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            })
            return
        }

        const user = await getCurrentUser(req.user.id)

        res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            data: user
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to get user'
        res.status(404).json({
            success: false,
            message
        })
    }
}

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(200).json({
            success: true,
            message: 'Logout successful'
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Logout failed'
        res.status(500).json({
            success: false,
            message
        })
    }
}

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            })
            return
        }

        await verifyUserEmail(req.user.id)

        res.status(200).json({
            success: true,
            message: 'Email verified successfully'
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Email verification failed'
        res.status(400).json({
            success: false,
            message
        })
    }
}

export const changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            })
            return
        }

        const { currentPassword, newPassword } = req.body

        await changeUserPassword(req.user.id, currentPassword, newPassword)

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Password change failed'
        res.status(400).json({
            success: false,
            message
        })
    }
}
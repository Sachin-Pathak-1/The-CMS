import { z } from 'zod';
import prisma from '../utils/prisma.js';
import { sendError, sendSuccess } from '../utils/response.js';

const settingsSchema = z.object({
    notificationsEmail: z.boolean().optional(),
    notificationsSMS: z.boolean().optional(),
    gradeNotifications: z.boolean().optional(),
    assignmentReminders: z.boolean().optional(),
    weeklyDigest: z.boolean().optional(),
    profileVisibility: z.string().max(20).optional(),
    showEmail: z.boolean().optional(),
    showPhone: z.boolean().optional(),
    allowMessaging: z.boolean().optional(),
    theme: z.string().max(10).optional(),
    compactMode: z.boolean().optional(),
    language: z.string().max(50).optional(),
    timezone: z.string().max(100).optional(),
    twoFactorEnabled: z.boolean().optional(),
});

export const getMySettings = async (req, res) => {
    try {
        const settings = await prisma.userSettings.findUnique({
            where: { userId: req.user.id },
        });
        const withDefaults = settings ?? {
            notificationsEmail: true,
            notificationsSMS: false,
            gradeNotifications: true,
            assignmentReminders: true,
            weeklyDigest: true,
            profileVisibility: "college",
            showEmail: false,
            showPhone: false,
            allowMessaging: true,
            theme: "light",
            compactMode: false,
            language: "English",
            timezone: "Asia/Kolkata",
            twoFactorEnabled: false,
        };
        return sendSuccess(res, withDefaults);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Failed to fetch settings', 500);
    }
};

export const upsertMySettings = async (req, res) => {
    try {
        const data = settingsSchema.parse(req.body);
        const result = await prisma.userSettings.upsert({
            where: { userId: req.user.id },
            create: { userId: req.user.id, ...data },
            update: { ...data },
        });
        return sendSuccess(res, result, 'Settings saved');
    } catch (error) {
        if (error.name === 'ZodError') {
            return sendError(res, 'Validation failed', 400, error.errors.map(e => ({ field: e.path.join('.'), message: e.message })));
        }
        console.error(error);
        return sendError(res, 'Failed to save settings', 500);
    }
};

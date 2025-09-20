import { triggerReminders } from '@/lib/reminders';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    // This is a simplified check for a cron secret.
    // In a production app, you'd want to use a more secure method.
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        await triggerReminders();
        return NextResponse.json({ success: true, message: 'Reminders triggered successfully.' });
    } catch (error) {
        console.error('Error triggering reminders:', error);
        return new NextResponse(JSON.stringify({ success: false, message: 'Failed to trigger reminders.' }), { status: 500 });
    }
}

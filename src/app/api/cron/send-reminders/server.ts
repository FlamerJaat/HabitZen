
import { triggerReminders } from '@/lib/reminders';
import * as http from 'http';

const server = http.createServer(async (req, res) => {
    if (req.url === '/api/send-reminders' && req.method === 'GET') {
        if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
            res.writeHead(401, { 'Content-Type': 'text/plain' });
            res.end('Unauthorized');
            return;
        }

        try {
            await triggerReminders();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Reminders triggered successfully.' }));
        } catch (error) {
            console.error('Error triggering reminders:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Failed to trigger reminders.' }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`Cron server listening on port ${port}`);
});

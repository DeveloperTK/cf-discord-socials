const WorkersSentry = require('workers-sentry/worker');

const fetchHandler = require('./events/fetch');
const scheduledHandler = require('./events/scheduled');

/**
 * Listens on HTTP calls
 */
addEventListener('fetch', (event) => {
    const sentry = new WorkersSentry(event, process.env.SENTRY_DSN);
    sentry.addBreadcrumb({
        message: JSON.stringify(event),
        category: "event-log"
    });

    return event.respondWith(
        fetchHandler(event, sentry)
        .catch(err => {
            sentry.captureException(err);
            throw err;
        })
    );
});

/**
 * Listens on cron job executions
 */
addEventListener('scheduled', (event) => {
    const sentry = new WorkersSentry(event, process.env.SENTRY_DSN);
    sentry.addBreadcrumb({
        message: JSON.stringify(event),
        category: "event-log"
    });

    return event.waitUntil(
        scheduledHandler(event, sentry)
        .catch(err => {
            sentry.captureException(err);
            throw err;
        })
    );
});

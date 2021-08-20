# YouTube Notifications for Discord using [Cloudflare Workers](https://workers.dev)

## How to Deploy

1. Clone this repo (Assuming you have NodeJS + npm installed) run `npm install`
2. Make a Cloudflare account and [set up wrangler](https://developers.cloudflare.com/workers/cli-wrangler)
3. Make a [Sentry](https://sentry.io) account and get your DSN and keys 
4. Rename `production.env.example` to `production.env` and enter your secrets 
5. Deploy using `npm run publish:production`

## Debugging

Since the cron jobs on Cloudflare Workers take a solid 30 Minutes to warm up, you can always run the worker 
inside a test environment using miniflare.

Run `npm run miniflare` to start your test environment.

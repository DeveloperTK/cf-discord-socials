const WorkersSentry = require('workers-sentry/worker');
const RSSParser = require('rss-parser');
const rss = new RSSParser();
const feedURL = `https://www.youtube.com/feeds/videos.xml?channel_id=${process.env.YOUTUBE_CHANNEL_ID}`;

const publish = async (entry) => {
    fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: `@everyone New Video from **${entry.author}**, check it out! ${entry.link}`
        })
    });
}

const checkItem = async (entry, sentry) => {
    const kvKey = "latest-upload-date:" + process.env.YOUTUBE_CHANNEL_ID;
    const latestPublishedDate = await DATA.get(kvKey);

    let published = false;

    if (latestPublishedDate === null) {
        DATA.put(kvKey, entry.pubDate);
        publish(entry);
        published = true;
    } else {
        const dbDate = new Date(latestPublishedDate);
        const feedDate = new Date(entry.pubDate);
        if (feedDate.getTime() > dbDate.getTime()) {
            DATA.put(kvKey, entry.pubDate);
            publish(entry);
            published = true;
        }
    }

    console.log("YouTube action was executed. published = " + published);
    if (published) {
        sentry.captureMessage("YouTube PUBLISHED for date " + entry.pubDate);
    } else {
        sentry.captureMessage("YouTube did not publish (video already published)");
    }

    return new Response(JSON.stringify({
        status: published ? 200 : 202,
        wasPublished: published,
        latestRSSEntry: entry
    }), {
        status: published ? 200 : 202,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

/**
 * Handles the Cloudflare scheduled event.
 * 
 * @param event the scheduled event
 * @param {WorkersSentry} sentry
 * @returns {undefined}
 */
module.exports = async function(event, sentry) {
    console.log("executed scheduled event!" + JSON.stringify(event));
    sentry.setRequestBody(event);

    const data = await fetch(feedURL).then(response => response.text());
    const feed = await rss.parseString(data);
    return checkItem(feed.items[0], sentry);
}
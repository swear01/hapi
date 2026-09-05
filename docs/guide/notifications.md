# Notifications

Get notified when sessions need input, request permissions, fail, or complete — via Telegram, Server酱 (ServerChan), WxPusher App, a generic Webhook, Web Push, or voice.

Web Push works out of the box once you [install the PWA](./pwa.md); no configuration needed. The channels below are optional.

## Telegram Setup

Enable Telegram notifications and Mini App access:

1. Message [@BotFather](https://t.me/BotFather) and create a bot
2. Set the bot token and public URL
3. Start the hub and bind your account

```bash
export TELEGRAM_BOT_TOKEN="your-bot-token"
export HAPI_PUBLIC_URL="https://your-public-url"

hapi hub
```

Then message your bot with `/start`, open the app, and enter your `CLI_API_TOKEN`.

Related environment variables:

- `TELEGRAM_NOTIFICATION` - Enable/disable Telegram notifications (default: `true`)

**Troubleshooting:**

- If binding fails, verify `HAPI_PUBLIC_URL` is accessible from the internet
- Telegram Mini App requires HTTPS (not HTTP)

## ServerChan (Server酱) Setup

Server酱 pushes notifications to WeChat and other channels. The hub sends ServerChan messages when a session is ready for input, requests a permission, a task fails, or a session completes.

1. Get a SendKey from [sct.ftqq.com](https://sct.ftqq.com/)
2. Set the SendKey and start the hub:

```bash
export SERVERCHAN_SENDKEY="your-sendkey"
export HAPI_PUBLIC_URL="https://your-public-url"

hapi hub
```

Messages include a link back to the session, built from `HAPI_PUBLIC_URL`.

Related environment variables:

- `SERVERCHAN_NOTIFICATION` - Enable/disable ServerChan notifications (default: `true`)
- `SERVERCHAN_BACKGROUND_ONLY` - Only send ServerChan notifications when the namespace has no visible HAPI connection (default: `false`)

When `SERVERCHAN_BACKGROUND_ONLY=true`, a visible HAPI connection suppresses ServerChan for the entire namespace. Hidden, disconnected, or closed HAPI pages do not count as visible, so ServerChan can act as a background fallback. This is namespace-wide and does not select a particular device.

These values can also be set in `settings.json` (`serverChanSendKey`, `serverChanNotification`, `serverChanBackgroundOnly`).

## WxPusher App Setup

WxPusher sends notifications to its own Android, iOS, and desktop clients. This integration targets the standard WxPusher App/client delivery path, not the separate WeChat ClawBot channel.

1. Create a WxPusher application and copy its `appToken`
2. Install a WxPusher client, subscribe to the application, and copy your UID
3. Set the token and recipient before starting the hub:

```bash
export WXPUSHER_APP_TOKEN="AT_your-app-token"
export WXPUSHER_UIDS="UID_your-uid"
export HAPI_PUBLIC_URL="https://your-public-url"

hapi hub
```

Multiple UIDs can be separated by commas. Topic recipients can be configured with `WXPUSHER_TOPIC_IDS` instead:

```bash
export WXPUSHER_TOPIC_IDS="123,456"
```

The current WxPusher channel sends session completion notifications only. It remains disabled unless an app token and at least one UID or topic ID are configured.

Related environment variables:

- `WXPUSHER_APP_TOKEN` - WxPusher application token
- `WXPUSHER_UIDS` - Comma-separated recipient UIDs
- `WXPUSHER_TOPIC_IDS` - Comma-separated topic IDs
- `WXPUSHER_NOTIFICATION` - Enable/disable WxPusher notifications (default: `true`)
- `WXPUSHER_BACKGROUND_ONLY` - Only send WxPusher notifications when the namespace has no visible HAPI connection (default: `false`)

When `WXPUSHER_BACKGROUND_ONLY=true`, a visible HAPI connection suppresses WxPusher for the entire namespace. Hidden, disconnected, or closed HAPI pages do not count as visible, so WxPusher can act as a background fallback. This is namespace-wide and does not select a particular device.

These values can also be set in `settings.json` (`wxPusherAppToken`, `wxPusherUids`, `wxPusherTopicIds`, `wxPusherNotification`, `wxPusherBackgroundOnly`).

## Webhook setup

Send notifications to a relay you control — a self-hosted HTTP endpoint, a serverless function, or a Worker that forwards the payload onward (Telegram, Server酱, Bark, PushPlus, …). The hub posts **HAPI's own JSON**; Bark / PushPlus / WxPusher will not accept this body as a drop-in. Use a relay if the hub cannot reach `api.telegram.org` / `sctapi.ftqq.com` directly.

1. Stand up an HTTP(S) endpoint that accepts `POST` with the JSON below and returns a `2xx` status
2. Set the webhook URL and start the hub:

```bash
export HAPI_WEBHOOK_URL="https://your-endpoint.example.com/hook"
export HAPI_PUBLIC_URL="https://your-public-url"

hapi hub
```

The hub POSTs a JSON body to `HAPI_WEBHOOK_URL` for the same events as the other channels:

```json
{
  "event": "ready",
  "title": "HAPI Ready for input · my-session",
  "content": "Claude 正在等待输入",
  "url": "https://your-public-url/sessions/abc123",
  "sessionId": "abc123"
}
```

`event` is one of `ready`, `permission`, `task_failed`, or `completed`. Map `title`, `content`, and `url` in your relay to whatever the downstream gateway expects.

Requests time out after 10 seconds and do not follow redirects (so a `key` query param / `X-HAPI-Webhook-Key` header cannot leak to a different host).

Related environment variables:

- `HAPI_WEBHOOK_KEY` - Optional shared key. When set, it is sent both as a `key` query parameter on the URL and as an `X-HAPI-Webhook-Key` header, so it works whether your endpoint reads credentials from the query string (matching the Server酱/PushPlus convention) or from headers
- `HAPI_WEBHOOK_NOTIFICATION` - Enable/disable webhook notifications (default: `true`)
- `HAPI_WEBHOOK_BACKGROUND_ONLY` - Only send webhook notifications when the namespace has no visible HAPI connection (default: `false`), same semantics as `SERVERCHAN_BACKGROUND_ONLY`

These values can also be set in `settings.json` (`webhookUrl`, `webhookKey`, `webhookNotification`, `webhookBackgroundOnly`).

## Voice assistant setup

Enable voice control:

1. Get an API key from [elevenlabs.io](https://elevenlabs.io/app/settings/api-keys)
2. Set the environment variable:

```bash
export ELEVENLABS_API_KEY="your-api-key"
hapi hub --relay
```

See [Voice Assistant](./voice-assistant.md) for usage details.

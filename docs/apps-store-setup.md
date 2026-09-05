# App store setup

Three steps. The store is already deployed and browsable before any of them —
until Stripe is connected, checkout returns a clear "not connected yet" message
rather than failing.

## 1. Create the tables

Paste `docs/security/supabase-apps-store.sql` into the Supabase SQL editor and
run it. It is idempotent, so running it twice is safe. Until this is done
`/apps` renders its empty state.

## 2. Connect Stripe

In the Stripe dashboard, **Developers → API keys**, then add to Vercel:

| Variable | Where it comes from |
|---|---|
| `STRIPE_SECRET_KEY` | Developers → API keys → Secret key (`sk_...`) |
| `STRIPE_WEBHOOK_SECRET` | Created in step 3 (`whsec_...`) |

Start with **test mode** keys. Nothing charges a real card until the live keys
are in.

## 3. Point Stripe at the webhook

**Developers → Webhooks → Add endpoint**

- URL: `https://admov.io/api/stripe/webhook`
- Event: `checkout.session.completed`

Copy the signing secret it gives you into `STRIPE_WEBHOOK_SECRET`.

The webhook is what actually fulfils an order — it records the sale, generates
the licence key or download token, and pings Telegram. Without it a customer
can pay and receive nothing, so do not skip it.

## Adding an app

`/admin` → **Apps & Store**. The delivery kind decides what the buyer gets:

- **store_link** — links to the App Store, Google Play or a website. No price.
  Apple and Google do not allow selling their apps anywhere else, so this is
  the only option for iOS and Android.
- **download** — paid once. The buyer gets a private link, valid 14 days or
  five downloads.
- **subscription** — recurring through Stripe.
- **license** — paid once, then a key. Your app checks it by POSTing
  `{"key": "ADMOV-..."}` to `/api/license/verify`, which replies
  `{"valid": true, "app": "slug"}`. It never returns the buyer's email.

### Large download files

Vercel caps a request body at 4.5 MB, so a `.dmg` or a big `.zip` cannot be
uploaded through the admin form. Upload it straight to the private R2 bucket
and paste the object key (e.g. `downloads/myapp-1.2.dmg`) into **File
location**. The download route streams it through the server, so the bucket
stays private.

## Testing before going live

With test keys, use card `4242 4242 4242 4242`, any future expiry and any CVC.
Check that the order appears in `app_orders` and that Telegram pings.

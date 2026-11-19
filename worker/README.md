# Forms service

A small Cloudflare Worker that receives the website's two forms and emails them out through Resend:

- **Contact form** on the home page → an email to contact@thecodeconsortium.com, and a copy to the sender.
- **Project brief** at `/brief/` → an email with the brief as a PDF, the answers as JSON and any files they attached, and a copy of the PDF to the customer.

Nothing is stored. Spam is kept out by Cloudflare Turnstile (checked on the server), a hidden trap field, a minimum time on the page, a limit of 4 sends a minute per connection and per email address, and checks on file types and sizes.

It runs at `https://forms.thecodeconsortium.com`. Everything here fits the free tiers: Workers (100,000 requests a day), Turnstile (free), Resend (3,000 emails a month, 100 a day).

## Setting it up (once)

Accounts and keys are created by a person, not by the code.

1. **Resend**: sign up at resend.com, add the domain `thecodeconsortium.com`, and let it add its DNS records to Cloudflare (it offers to do this automatically). Wait until the domain shows as verified. Then create an API key with *Sending access* for that domain.
2. **Turnstile**: in the Cloudflare dashboard, open *Turnstile*, add a widget named "TCC forms", set the mode to *Managed*, and add the hostnames `thecodeconsortium.com`, `www.thecodeconsortium.com`, `omaar-thecodeconsortium.github.io` and `localhost`. Copy the **site key** and the **secret key**.
3. **Deploy the Worker** from this folder:

   ```bash
   cd worker
   npm install
   npx wrangler login
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put TURNSTILE_SECRET
   npx wrangler deploy
   ```

   `wrangler deploy` also creates `forms.thecodeconsortium.com` in Cloudflare DNS.
4. **Put the site key in the website**: set `TURNSTILE_SITE_KEY` in `src/forms/config.js` to the Turnstile site key (it is public by design), then rebuild and deploy the site.
5. **Test**: send the contact form and a short brief, and check that both emails and both copies arrive.

## Changing things

- Who receives the forms, and the sender name: `TO_EMAIL` and `FROM_EMAIL` in `wrangler.toml`.
- Which sites may send forms: `ALLOWED_ORIGINS` in `wrangler.toml`. A new domain also needs adding to the Turnstile widget.
- Size and file-type limits: the top of `src/index.js`, and the matching list in `src/brief/questions.js`.
- After any change here: `npx wrangler deploy`.

## Trying it locally

`npx wrangler dev` runs the Worker at `http://localhost:8787`. Create `worker/.dev.vars` (ignored by git) with

```
DRY_RUN=1
TURNSTILE_SECRET=1x0000000000000000000000000000000AA
```

so emails are printed instead of sent and Cloudflare's test secret is used. Then run the website with `VITE_FORMS_URL=http://localhost:8787 npm run dev`.

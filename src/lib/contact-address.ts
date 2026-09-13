/**
 * The contact address for the click-to-reveal fallback, stored ONLY as Base64.
 *
 * The readable address appears nowhere in the source, the server-rendered HTML,
 * or the JS bundle — `RevealEmail` decodes it in the browser after a click. This
 * is deliberately kept out of `site.ts`: that object is imported by client
 * components, which would bundle a readable copy.
 *
 * The address that actually receives form messages is configured separately,
 * server-side, via the CONTACT_TO_EMAIL environment variable.
 *
 * To change it: `printf '%s' 'you@example.com' | base64`
 */
export const emailEncoded = "b2xpdmllci5sdWV0aHlAZ214Lm5ldA==";

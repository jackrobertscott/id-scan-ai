import {brwConf} from "../brwConf"

export async function getStripeClient() {
  // don't load (lazy load) stripe until you need it
  // why? because stripe is filled with annoying api requests that
  // load as soon as it mounts to the client, we want to avoid that
  // until its essential
  const {loadStripe} = await import("@stripe/stripe-js")
  const client = await loadStripe(brwConf.VITE_STRIPE_KEY)
  if (!client) throw new Error("Failed to load stripe.")
  return client
}

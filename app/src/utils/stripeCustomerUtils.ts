import Stripe from "stripe"
import {VenueStore} from "../mods/venue/venue_store"
import {VenueType} from "../mods/venue/venue_storeDef.iso"
import {stripeServer} from "./stripeServer"

export const getStripeCustomerOfVenue = async (
  venue: VenueType
): Promise<Stripe.Customer> => {
  if (venue.stripeCustomerId) {
    const stripeCustomer = await stripeServer.customers.retrieve(
      venue.stripeCustomerId
    )
    if (stripeCustomer.deleted)
      throw new Error("Stripe customer has been deleted")
    return stripeCustomer
  } else {
    return upsertStripeCustomerOfVenue(venue)
  }
}

export const upsertStripeCustomerOfVenue = async (
  venue: VenueType
): Promise<Stripe.Customer> => {
  if (venue.stripeCustomerId) {
    return stripeServer.customers.update(venue.stripeCustomerId, {
      name: venue.name,
      // email: venue.invoiceEmail,
      // address: {
      //   line1: venue.address.line1,
      //   line2: venue.address.line2 ?? undefined,
      //   city: venue.address.suburb,
      //   postal_code: venue.address.postCode,
      //   state: venue.address.state,
      //   country: "AU",
      // },
    })
  } else {
    const stripeCustomer = await stripeServer.customers.create({
      name: venue.name,
      // email: venue.invoiceEmail,
      // address: {
      //   line1: venue.address.line1,
      //   line2: venue.address.line2 ?? undefined,
      //   city: venue.address.suburb,
      //   postal_code: venue.address.postCode,
      //   state: venue.address.state,
      // },
      metadata: {
        venueId: venue.id,
      },
    })

    await VenueStore.updateOneById(venue.id, {
      stripeCustomerId: stripeCustomer.id,
    })

    return stripeCustomer
  }
}

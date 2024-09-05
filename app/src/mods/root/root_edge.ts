import {createEdgeGroup} from "../../utils/server/createEdge"
import {stripeServer} from "../../utils/stripeServer"
import {ensureUser} from "../auth/auth_jwt"
import {root_eDef} from "./root_eDef.iso"

export default createEdgeGroup(root_eDef, {
  ping: async ({body}) => {
    return {
      timeAndOne: body.time + 1,
    }
  },

  getStripeCardIntent: async ({request}) => {
    await ensureUser(request)

    const intent = await stripeServer.setupIntents.create({
      payment_method_types: ["card"],
    })

    if (!intent.client_secret)
      throw new Error("Failed to load stripe on server")

    return {
      intent: intent.client_secret,
    }
  },
})

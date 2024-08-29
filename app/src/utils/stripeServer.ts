import Stripe from "stripe"
import {srvConf} from "../srvConf"

export const stripeServer = new Stripe(srvConf.STRIPE_SECRET_KEY)

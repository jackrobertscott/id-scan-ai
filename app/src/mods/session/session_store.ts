import {createMongoStore} from "../../utils/mongo/mongoStore"
import {parseUserAgent} from "../../utils/parseUserAgent"
import {SessionDef} from "./session_storeDef.iso"

export const SessionStore = createMongoStore({
  def: SessionDef,
  extend: (store) => ({
    async createOne(...args: Parameters<typeof store.createOne>) {
      args[0] = {...args[0], ...parseUserAgent(args[0].userAgent)}
      return store.createOne(...args)
    },
  }),
})

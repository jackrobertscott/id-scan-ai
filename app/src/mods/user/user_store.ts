import {z} from "zod"
import {createMongoStore} from "../../utils/mongo/mongoStore"
import {createRandomNumberString} from "../../utils/randomString"
import {normalizeRegex} from "../../utils/regexUtils"
import {UserDef, UserType} from "./user_storeDef.iso"

export const UserStore = createMongoStore({
  def: UserDef,
  extend: (store) => ({
    async maybeOneByEmail(email: string) {
      z.string().email().parse(email)
      return store.maybeOne({email: normalizeRegex(email)})
    },

    createVerification() {
      return UserDef.schema.shape.emailVerif.parse({
        code: createRandomNumberString(6),
        updatedDate: new Date(),
      })
    },

    async upsertOneByEmail(email: string, data?: Partial<UserType>) {
      let user = await this.maybeOneByEmail(email)
      const emailVerif = this.createVerification()
      if (user) {
        ;[user] = await store.updateOne({id: user.id}, {...data, emailVerif})
      } else {
        user = await store.createOne({...data, email, emailVerif})
      }
      return user
    },

    async safeCreateOne(...args: Parameters<typeof store.createOne>) {
      if (await this.maybeOneByEmail(args[0].email)) {
        throw new Error("User with this email already exists")
      }
      return store.createOne(...args)
    },
  }),
})

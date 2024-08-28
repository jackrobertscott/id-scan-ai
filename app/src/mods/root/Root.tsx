import {useEffect} from "react"
import {z} from "zod"
import {useEdge} from "../../utils/server/useEdge"
import {useZodForm} from "../../utils/useZodForm"
import {Field} from "../cmps/Field"
import {Input} from "../cmps/Input"
import {PageCenter} from "../cmps/PageCenter"
import {UserDef} from "../user/user_storeDef.iso"
import {root_eDef} from "./root_eDef.iso"

export type RootProps = {}

export const Root = ({}: RootProps) => {
  const $ping = useEdge(root_eDef.ping)
  useEffect(() => {
    $ping.fetch({time: Date.now()}).then(console.log)
  }, [])
  const form = useZodForm({
    schema: z.object({
      email: UserDef.schema.shape.email,
      passcode: UserDef.schema.shape.emailVerif.unwrap().unwrap().shape.code,
    }),
  })
  return (
    <PageCenter title="Hello">
      <Field label="Email">
        <Input {...form.getPropsOf("email")} />
      </Field>
      <Field label="Passcode">
        <Input {...form.getPropsOf("email")} />
      </Field>
    </PageCenter>
  )
}

import {css} from "@emotion/css"
import {StripeCardElement, Token} from "@stripe/stripe-js"
import {FC, MutableRefObject, useEffect, useRef} from "react"
import {createCns} from "../utils/classNames"

export const InputStripeCard: FC<{
  getTokenCbRef: MutableRefObject<
    (() => Promise<Token | undefined>) | undefined
  >
}> = ({getTokenCbRef}) => {
  // const $getIntent = useEdge(GetCardIntentByUserDef)
  const cardDivRef = useRef<HTMLDivElement>(null)
  const cardElementRef = useRef<StripeCardElement | null>(null)

  useEffect(() => {
    // $getIntent.fetch().then(async ({intent}) => {
    //   if (!cardDivRef.current) return
    //   // load the client
    //   const stripeClient = await getStripeClient()
    //   // This is a hack to get the font to load
    //   const fontCssSrc =
    //     "https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap"
    //   const stripeElements = stripeClient.elements({
    //     clientSecret: intent,
    //     fonts: [{cssSrc: fontCssSrc}],
    //   })
    //   // This is a hack to get the card element to mount
    //   cardElementRef.current = stripeElements.create("card", {
    //     hidePostalCode: true,
    //     style: {
    //       base: {
    //         fontSize: "16px",
    //         fontFamily: "Play",
    //         color: "#ffffff",
    //         "::placeholder": {color: "#ffffff40"},
    //       },
    //     },
    //   })
    //   // This is a hack to get the card element to mount
    //   cardElementRef.current.mount(cardDivRef.current)
    //   // This is a hack to get the token from the card element
    //   getTokenCbRef.current = async () => {
    //     if (!cardElementRef.current) {
    //       // alerter.error("Failed to load stripe.")
    //       return
    //     }
    //     const {token, error} = await stripeClient.createToken(
    //       cardElementRef.current
    //     )
    //     if (error || !token) {
    //       // alerter.error(error.message ?? "Failed to create token.")
    //       return
    //     }
    //     return token
    //   }
    // })
  }, [])

  return (
    <div ref={cardDivRef} className={cn_isc.root}>
      <div className={cn_isc.placeholder} />
    </div>
  )
}

const cn_isc = createCns("InputStripeCard", {
  root: css`
    flex-grow: 1;
    padding: var(--padding-regular);
  `,
  placeholder: css`
    height: calc(var(--line-height) * 1rem);
  `,
})

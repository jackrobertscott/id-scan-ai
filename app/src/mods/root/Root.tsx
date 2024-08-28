import {PageCenter} from "../cmps/PageCenter"

export type RootProps = {}

export const Root = ({}: RootProps) => {
  return (
    <PageCenter title="Hello">
      <h1>Root</h1>
    </PageCenter>
  )
}

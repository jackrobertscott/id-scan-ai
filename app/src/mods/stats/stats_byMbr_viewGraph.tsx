import {mdiChartBar} from "@mdi/js"
import {Poster} from "../../theme/Poster"
import {Spacer} from "../../theme/Spacer"
import {TitleBar} from "../../theme/TitleBar"

export const GraphStatsByMemberView = () => {
  return (
    <Spacer>
      <TitleBar title="Statistics" />

      <Poster
        icon={mdiChartBar}
        title="Venue Statistics"
        desc="This feature is not yet available"
      />
    </Spacer>
  )
}

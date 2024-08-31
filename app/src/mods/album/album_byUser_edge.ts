import {createListOptions} from "../../utils/mongo/listOptionUtils"
import {createListSearchQuery} from "../../utils/mongo/listSearchQueryUtils"
import {normalizeRegex} from "../../utils/regexUtils"
import {createEdgeGroup} from "../../utils/server/createEdge"
import {ensureUser} from "../auth/authUtils"
import {VenueStore} from "../venue/venue_store"
import {album_byUser_eDef} from "./album_byUser_eDef.iso"
import {AlbumStore} from "./album_store"
import {AlbumType} from "./album_storeDef.iso"

export default createEdgeGroup(album_byUser_eDef, {
  list: async ({request, body}) => {
    const auth = await ensureUser(request)

    const query = createListSearchQuery<AlbumType>({
      ...body,
      searchKeys: ["name", "emails"],
      filter: {
        emails: normalizeRegex(auth.user.email), // ensure only user's albums
        isActive: true, // ensure only active albums
      },
    })

    const [total, albums] = await Promise.all([
      AlbumStore.count(query),
      AlbumStore.getMany(query, createListOptions(body)),
    ])

    const venueIds = albums.map((album) => album.venueId)
    const venues = await VenueStore.getMany({id: {$in: venueIds}})

    const albumsWithVenue = albums.map((album) => {
      const venue = venues.find((venue) => venue.id === album.venueId)
      if (!venue) throw new Error("Venue not found")
      return {...album, venue}
    })

    return {
      total,
      albums: albumsWithVenue,
    }
  },
})

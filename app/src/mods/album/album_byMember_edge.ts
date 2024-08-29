import {createListOptions} from "../../utils/mongo/listOptionUtils"
import {createListSearchQuery} from "../../utils/mongo/listSearchQueryUtils"
import {createEdgeGroup} from "../../utils/server/createEdge"
import {ensureMemberOfVenue} from "../auth/authUtils"
import {LogEventStore} from "../logEvent/logEvent_store"
import {
  LOG_EVENT_CATEGORY_OBJ,
  LOG_EVENT_TABLES_OBJ,
} from "../logEvent/logEvent_storeDef.iso"
import {MEMBER_PERMISSIONS_OBJ} from "../member/member_storeDef.iso"
import {album_byMember_eDef} from "./album_byMember_eDef.iso"
import {AlbumStore} from "./album_store"
import {AlbumType} from "./album_storeDef.iso"

export default createEdgeGroup(album_byMember_eDef, {
  create: async ({request, body}) => {
    const auth = await ensureMemberOfVenue(request, [
      MEMBER_PERMISSIONS_OBJ.ALBUM_CREATE,
    ])

    const album = await AlbumStore.createOne({
      ...body,
      venueId: auth.venue.id,
      createdByUserId: auth.user.id,
    })

    LogEventStore.createOne({
      venueId: auth.venue.id,
      triggeredByUserId: auth.user.id,
      category: LOG_EVENT_CATEGORY_OBJ.CREATE,
      table: LOG_EVENT_TABLES_OBJ.ALBUM,
      dataId: album.id,
    })

    return album
  },

  get: async ({request, body: {albumId}}) => {
    const auth = await ensureMemberOfVenue(request)

    // Ensure the album is from the user's venue
    const album = await AlbumStore.getOne({
      id: albumId,
      venueId: auth.venue.id,
    })

    return {album}
  },

  update: async ({request, body: {albumId, ...body}}) => {
    const auth = await ensureMemberOfVenue(request, [
      MEMBER_PERMISSIONS_OBJ.ALBUM_UPDATE,
    ])

    // Ensure the album is from the user's venue
    await AlbumStore.updateOne(
      {
        id: albumId,
        venueId: auth.venue.id,
      },
      {...body}
    )

    LogEventStore.createOne({
      venueId: auth.venue.id,
      triggeredByUserId: auth.user.id,
      category: LOG_EVENT_CATEGORY_OBJ.UPDATE,
      table: LOG_EVENT_TABLES_OBJ.ALBUM,
      dataId: albumId,
    })
  },

  list: async ({request, body}) => {
    const auth = await ensureMemberOfVenue(request)

    const query = createListSearchQuery<AlbumType>({
      ...body,
      searchKeys: ["name", "emails"],
      filter: {
        venueId: auth.venue.id, // ensure only from user's venue
      },
    })

    switch (body.status) {
      case "active":
        query.$and.push({isActive: true})
        break
      case "disabled":
        query.$and.push({isActive: {$ne: true}}) // false and undefined
        break
    }

    const [total, albums] = await Promise.all([
      AlbumStore.count(query),
      AlbumStore.getMany(query, createListOptions(body)),
    ])

    return {
      total,
      albums,
    }
  },

  delete: async ({request, body: {albumId}}) => {
    const auth = await ensureMemberOfVenue(request, [
      MEMBER_PERMISSIONS_OBJ.ALBUM_DELETE,
    ])

    // Ensure the album is from the user's venue
    await AlbumStore.deleteOne({
      id: albumId,
      venueId: auth.venue.id,
    })

    LogEventStore.createOne({
      venueId: auth.venue.id,
      triggeredByUserId: auth.user.id,
      category: LOG_EVENT_CATEGORY_OBJ.DELETE,
      table: LOG_EVENT_TABLES_OBJ.ALBUM,
      dataId: albumId,
    })
  },
})

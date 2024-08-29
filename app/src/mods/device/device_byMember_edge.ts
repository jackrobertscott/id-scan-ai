import {createListOptions} from "../../utils/mongo/listOptionUtils"
import {createListSearchQuery} from "../../utils/mongo/listSearchQueryUtils"
import {createRandomNumberString} from "../../utils/randomString"
import {createEdgeGroup} from "../../utils/server/createEdge"
import {ensureMemberOfVenue} from "../auth/authUtils"
import {LogEventStore} from "../logEvent/logEvent_store"
import {
  LOG_EVENT_CATEGORY_OBJ,
  LOG_EVENT_TABLES_OBJ,
} from "../logEvent/logEvent_storeDef.iso"
import {MEMBER_PERMISSIONS_OBJ} from "../member/member_storeDef.iso"
import {device_byMember_eDef} from "./device_byMember_eDef.iso"
import {DeviceStore} from "./device_store"
import {DeviceType} from "./device_storeDef.iso"

export default createEdgeGroup(device_byMember_eDef, {
  create: async ({request, body}) => {
    const auth = await ensureMemberOfVenue(request, [
      MEMBER_PERMISSIONS_OBJ.DEVICE_CREATE,
    ])

    const device = await DeviceStore.createOne({
      ...body,
      venueId: auth.venue.id,
      createdByUserId: auth.user.id,
      deviceKey: [
        createRandomNumberString(4),
        createRandomNumberString(4),
      ].join("-"),
    })

    LogEventStore.createOne({
      venueId: auth.venue.id,
      triggeredByUserId: auth.user.id,
      category: LOG_EVENT_CATEGORY_OBJ.CREATE,
      table: LOG_EVENT_TABLES_OBJ.DEVICE,
      dataId: device.id,
    })

    return device
  },

  get: async ({request, body: {deviceId}}) => {
    const auth = await ensureMemberOfVenue(request)

    // Ensure the device is from the user's venue
    const device = await DeviceStore.getOne({
      id: deviceId,
      venueId: auth.venue.id,
    })

    return {device}
  },

  update: async ({request, body: {deviceId, ...body}}) => {
    const auth = await ensureMemberOfVenue(request, [
      MEMBER_PERMISSIONS_OBJ.DEVICE_UPDATE,
    ])

    // Ensure the device is from the user's venue
    await DeviceStore.updateOne(
      {
        id: deviceId,
        venueId: auth.venue.id,
      },
      {...body}
    )

    LogEventStore.createOne({
      venueId: auth.venue.id,
      triggeredByUserId: auth.user.id,
      category: LOG_EVENT_CATEGORY_OBJ.UPDATE,
      table: LOG_EVENT_TABLES_OBJ.DEVICE,
      dataId: deviceId,
    })
  },

  list: async ({request, body}) => {
    const auth = await ensureMemberOfVenue(request)

    const query = createListSearchQuery<DeviceType>({
      ...body,
      searchKeys: ["name", "desc"],
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

    const [total, devices] = await Promise.all([
      DeviceStore.count(query),
      DeviceStore.getMany(query, createListOptions(body)),
    ])

    return {
      total,
      devices,
    }
  },

  delete: async ({request, body: {deviceId}}) => {
    const auth = await ensureMemberOfVenue(request, [
      MEMBER_PERMISSIONS_OBJ.DEVICE_DELETE,
    ])

    // Ensure the device is from the user's venue
    await DeviceStore.deleteOne({
      id: deviceId,
      venueId: auth.venue.id,
    })

    LogEventStore.createOne({
      venueId: auth.venue.id,
      triggeredByUserId: auth.user.id,
      category: LOG_EVENT_CATEGORY_OBJ.DELETE,
      table: LOG_EVENT_TABLES_OBJ.DEVICE,
      dataId: deviceId,
    })
  },
})

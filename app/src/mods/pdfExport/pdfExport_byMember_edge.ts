import path, {join} from "path"
import {Readable} from "stream"
import {BUCKET_FOLDERS} from "../../consts/BUCKET_FOLDERS"
import {srvConf} from "../../srvConf"
import {createPdf} from "../../utils/createPdf"
import {createListOptions} from "../../utils/mongo/listOptionUtils"
import {createListSearchQuery} from "../../utils/mongo/listSearchQueryUtils"
import {
  downloadBucketObject,
  getSignedUrlOfBucketObject,
  uploadBucketObject,
} from "../../utils/s3BucketUtils"
import {s3FileSchema} from "../../utils/s3SchemaUtils"
import {createEdgeGroup} from "../../utils/server/createEdge"
import {ensureMemberOfVenue} from "../auth/auth_jwt"
import {LogEventStore} from "../logEvent/logEvent_store"
import {
  LOG_EVENT_CATEGORY_OBJ,
  LOG_EVENT_TABLES_OBJ,
} from "../logEvent/logEvent_storeDef.iso"
import {MEMBER_PERMISSIONS_OBJ} from "../member/member_storeDef.iso"
import {pdfExport_byMember_eDef} from "./pdfExport_byMember_eDef.iso"
import {PdfExportStore} from "./pdfExport_store"
import {PdfExportType} from "./pdfExport_storeDef.iso"

export default createEdgeGroup(pdfExport_byMember_eDef, {
  /**
   * Create a pdfExport and generate the pdf using puppeteer.
   */
  create: async ({request, body}) => {
    const auth = await ensureMemberOfVenue(request, [
      MEMBER_PERMISSIONS_OBJ.STRIPE_CARD_CREATE,
    ])

    // Create the pdfExport without the s3File
    const pdfExport = await PdfExportStore.createOne({
      ...body,
      venueId: auth.venue.id,
      createdByUserId: auth.user.id,
    })

    try {
      // Create the pdf
      const printUrl = path.join(
        srvConf.URL_CLIENT,
        "pdf/scan",
        pdfExport.id.slice(4)
      )
      const url = new URL(printUrl)
      url.searchParams.set("token", auth.token)
      const pdf = await createPdf(url.toString())

      // Upload the pdf to s3
      const dateKey = new Date().toISOString().split("T")[0]
      const s3File = s3FileSchema().parse({
        bucket: srvConf.AWS_S3_BUCKET,
        key: join(BUCKET_FOLDERS.PDF_EXPORT, dateKey, `${pdfExport.id}.pdf`),
        bytes: pdf.length,
        region: srvConf.AWS_DEFAULT_REGION,
      })
      await uploadBucketObject({
        ...s3File,
        data: pdf,
      })

      // Update the pdfExport with the s3File
      const [updatedPdf] = await PdfExportStore.updateOneById(pdfExport.id, {
        s3PdfFile: s3File,
      })

      LogEventStore.createOne({
        venueId: auth.venue.id,
        triggeredByUserId: auth.user.id,
        category: LOG_EVENT_CATEGORY_OBJ.CREATE,
        table: LOG_EVENT_TABLES_OBJ.PDF_EXPORT,
        dataId: pdfExport.id,
      })

      return updatedPdf
    } catch (error) {
      // Delete the pdfExport if there is an error
      await PdfExportStore.deleteOneById(pdfExport.id)

      throw error
    }
  },

  /**
   * Get the pdf document and return the signed url to the s3 file.
   */
  get: async ({request, body: {pdfExportId}}) => {
    const auth = await ensureMemberOfVenue(request)

    // Ensure the pdfExport is from the user's venue
    const pdfExport = await PdfExportStore.getOne({
      id: pdfExportId,
      venueId: auth.venue.id,
    })

    const pdfUrl = pdfExport.s3PdfFile
      ? await getSignedUrlOfBucketObject(pdfExport.s3PdfFile)
      : undefined

    return {
      pdfExport: {
        ...pdfExport,
        pdfUrl,
      },
    }
  },

  /**
   * Send the pdf file to the client as a readable stream.
   */
  download: async ({request, body: {pdfExportId}, response}) => {
    const auth = await ensureMemberOfVenue(request)

    // Ensure the pdfExport is from the user's venue
    const pdfExport = await PdfExportStore.getOne({
      id: pdfExportId,
      venueId: auth.venue.id,
    })

    const pdfUrl = pdfExport.s3PdfFile
      ? await downloadBucketObject(pdfExport.s3PdfFile)
      : undefined

    if (!pdfUrl || !(pdfUrl instanceof Readable)) {
      throw new Error("PDF file not found.")
    }
    response.setHeader("Content-Type", "application/pdf")
    pdfUrl.pipe(response) // ends automatically after sending the file

    return response
  },

  /**
   * List all pdfExports from the user's venue.
   */
  list: async ({request, body}) => {
    const auth = await ensureMemberOfVenue(request)

    const query = createListSearchQuery<PdfExportType>({
      ...body,
      // keys: [],
      filter: {
        venueId: auth.venue.id, // ensure only from user's venue
      },
    })

    const [total, pdfExports] = await Promise.all([
      PdfExportStore.count(query),
      PdfExportStore.getMany(query, createListOptions(body)),
    ])

    return {
      total,
      pdfExports,
    }
  },

  /**
   * Delete the pdfExport.
   */
  delete: async ({request, body: {pdfExportId}}) => {
    const auth = await ensureMemberOfVenue(request, [
      MEMBER_PERMISSIONS_OBJ.PDF_EXPORT_DELETE,
    ])

    // Ensure the pdfExport is from the user's venue
    await PdfExportStore.deleteOne({
      id: pdfExportId,
      venueId: auth.venue.id,
    })

    LogEventStore.createOne({
      venueId: auth.venue.id,
      triggeredByUserId: auth.user.id,
      category: LOG_EVENT_CATEGORY_OBJ.DELETE,
      table: LOG_EVENT_TABLES_OBJ.PDF_EXPORT,
      dataId: pdfExportId,
    })
  },
})

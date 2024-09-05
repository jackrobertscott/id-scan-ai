import {FC} from "react"
import {Navigate, Route, Routes} from "react-router-dom"
import {CenterLayout} from "../../theme/CenterLayout"
import {DashboardLayout} from "../../theme/DashboardLayout"
import {HomePage} from "../../theme/HomePage"
import {ListAlbumByMemberView} from "../album/album_byMember_viewList"
import {ListAlbumByUserView} from "../album/album_byUser_viewList"
import {AdminGate, AuthGate} from "../auth/auth_gate"
import {AuthDeviceByMemberView} from "../auth/auth_loginDevice"
import {AuthFaceByUserView} from "../auth/auth_loginDeviceFace"
import {AuthEmailByUserView} from "../auth/auth_loginEmail"
import {AuthLoginRoot} from "../auth/auth_viewRoot"
import {ListDeviceByMemberView} from "../device/device_byMember_viewList"
import {ListTagByMemberView} from "../faceTag/faceTag_byMbr_viewList"
import {ListInvoiceByMemberView} from "../invoice/inv_byMbr_viewList"
import {ListSimilarPatronByMemberView} from "../livePhoto/livePhoto_byMbr_viewListSimilar"
import {ListLoggedEventByMemberView} from "../logEvent/logEvt_byMbr_viewList"
import {ListMemberByMemberView} from "../member/mbr_byMbr_viewList"
import {ListPayCardByMemberView} from "../payCard/payCard_byMbr_viewList"
import {ListPdfExportByMemberView} from "../pdfExport/pdfExp_byMbr_viewList"
import {ListScanByAlbumView} from "../scan/scan_byAlb_viewList"
import {CreateScanByMemberView} from "../scan/scan_byMbr_viewCreate"
import {ListScanByMemberView} from "../scan/scan_byMbr_viewList"
import {ListScanByPdfView} from "../scan/scan_byPdf_viewList"
import {ListSessionByUserView} from "../session/ssn_byUsr_viewList"
import {ListUserByAdminView} from "../user/usr_byAdm_viewList"
import {UpdateUserBySelfView} from "../user/usr_bySlf_viewUpdate"
import {UpdateVenueByMemberView} from "../venue/ven_byMbr_viewUpdate"
import {ListVenueByUserView} from "../venue/ven_byUsr_viewList"
import {VenueGate} from "../venue/ven_gate"
import {ListVenueByAdminView} from "../venue/venue_byAdm_viewList"
import {OnlineGate} from "./root_gate_online"
import {RefresherGate} from "./root_gate_refresher"
import {Page404} from "./root_page404"

export const Root: FC = () => {
  return (
    <Routes>
      {/* website */}
      <Route path="/" index element={<HomePage />} />

      {/* pdf routes */}
      <Route path="pdf/scan/:pdfExportId" element={<ListScanByPdfView />} />

      <Route element={<OnlineGate />}>
        {/* unauthenticated routes */}
        <Route element={<CenterLayout width="20rem" />}>
          <Route path="login" element={<AuthLoginRoot />} />
          <Route path="login-email" element={<AuthEmailByUserView />} />
          <Route path="login-device" element={<AuthDeviceByMemberView />} />
          <Route path="login-face" element={<AuthFaceByUserView />} />
          <Route path="404" element={<Page404 />} />
        </Route>

        {/* authenticated routes */}
        <Route element={<DashboardLayout />}>
          <Route element={<RefresherGate />}>
            <Route element={<AuthGate redirect="/login" />}>
              {/* Current Account */}
              <Route path="my-account" element={<UpdateUserBySelfView />} />
              <Route path="select-venue" element={<ListVenueByUserView />} />

              {/* Sessions */}
              <Route path="my-sessions" element={<ListSessionByUserView />} />

              {/* Albums shared with me */}
              <Route path="my-albums" element={<ListAlbumByUserView />} />
              <Route path="album/:albumId" element={<ListScanByAlbumView />} />

              {/* venue required routes */}
              <Route element={<VenueGate redirect="/select-venue" />}>
                {/* Current Venue */}
                <Route
                  path="venue-settings"
                  element={
                    <UpdateVenueByMemberView
                      onClose={() => {
                        location.href = "/select-venue"
                      }}
                    />
                  }
                />

                {/* Scans */}
                <Route path="new-scan" element={<CreateScanByMemberView />} />
                <Route path="scan-history" element={<ListScanByMemberView />} />
                <Route
                  path="find-by-face"
                  element={<ListSimilarPatronByMemberView />}
                />

                {/* Tags */}
                <Route
                  path="tagged-patrons"
                  element={<ListTagByMemberView />}
                />

                {/* Members */}
                <Route
                  path="venue-members"
                  element={<ListMemberByMemberView />}
                />

                {/* Devices */}
                <Route
                  path="venue-devices"
                  element={<ListDeviceByMemberView />}
                />

                {/* PDF Exports */}
                <Route
                  path="pdf-exports"
                  element={<ListPdfExportByMemberView />}
                />

                {/* Albums */}
                <Route
                  path="shared-albums"
                  element={<ListAlbumByMemberView />}
                />

                {/* Event History */}
                <Route
                  path="event-history"
                  element={<ListLoggedEventByMemberView />}
                />

                {/* Invoices */}
                <Route path="invoices" element={<ListInvoiceByMemberView />} />

                {/* Pay Cards */}
                <Route path="pay-cards" element={<ListPayCardByMemberView />} />
              </Route>

              {/* admin only routes */}
              <Route element={<AdminGate redirect="/" />}>
                {/* Users */}
                <Route path="all-users" element={<ListUserByAdminView />} />

                {/* Venues */}
                <Route path="all-venues" element={<ListVenueByAdminView />} />
              </Route>
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  )
}

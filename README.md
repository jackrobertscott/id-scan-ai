# id-scan-ai

- [ ] Old data import
- [ ] Sentry error monitoring
- [ ] Analytics pages
- [ ] Rate limiter (cloudflare?)
- [ ] Per-venue AWS rekog cols?
- [ ] Popup comps should first appear within window bounds
- [ ] Venue address with google maps

## E2E

Test checks:
- Check list filters work
- Check access failed when permissions missing
- Check event log created

Auth -> Email
- [ ] Auth by email
- [ ] 404 Page

W'out Venue
- [ ] Update self
- [ ] Save face ID to self
- [ ] Create venue
- [ ] Switch venue
- [ ] List albums shared with me
- [ ] View scans from shared album
- [ ] Logout (and try to access protected page)
- When no current venue
  - [ ] Ensure no venue menu options are shown
  - [ ] Ensure redirect on venue screens

W'out Venue -> Sessions
- [ ] List user sessions
- [ ] Deactivate session

With Venue
- [ ] Update venue
- [ ] Set business hours (optional)

With Venue -> Members
- [ ] Add new member
- [ ] Prevent access to venue assets prior to member approval
- [ ] List venue members (only of current venue)
- [ ] Update member
- [ ] Delete member (prevented if not full access member)

With Venue -> Scans
- [ ] New scan with new doc photo
- [ ] New scan with old (existing) doc photo
- [ ] New scan with image file select input (full access only)
- [ ] Fail to upload face if non-existent or obscured
- [ ] Auto fix orientation of photos with upside down faces
- [ ] Skip doc photo select page if no similar scans exist
- [ ] List scan history (only of current venue)
- [ ] Find scans by face photo
- [ ] Show modal if pay card not connected
- [ ] Show modal if creating scan outside of business hours
- [ ] Show modal if payment status failed
- [ ] Delete scan

With Venue -> Tags
- [ ] Create tag on scan
- [ ] Assert tags appear on future scans
- [ ] List all tags (only of current venue)
- [ ] Update a tag
- [ ] Delete tag
- [ ] View previous history of tagged patron

With Venue -> Devices
- [ ] Create device
- [ ] List devices
- [ ] Update device
- [ ] Allow device passkey to be "rolled"
- [ ] Delete device

Auth -> Device
- [ ] Login as venue device
- [ ] Logout of device
- [ ] Login via face id (and passcode) to device
- [ ] Select user from member dropdown
- [ ] Ensure only device menu options are shown
- [ ] Ensure redirect on non-device screens
- [ ] Auto-logout user after 10 minutes of inactivity

With Venue -> Albums
- [ ] Create album
- [ ] List albums
- [ ] View album & download PDF
- [ ] Delete album
- [ ] Deactivate album

Auth -> Album
- [ ] Login as regular user
- [ ] Ensure url redirects to correct album screen on login
- [ ] List all albums (only shared with self)
- [ ] Ensure scans are only those in album
- [ ] Ensure only authorized fields (specified by album) are shown
- [ ] Ensure album can not be viewed after expiry date

With Venue -> PDF Exports
- [ ] Create PDF
- [ ] List PDFs
- [ ] View PDF summary and download
- [ ] Web view of PDF
- [ ] Delete PDF

With Venue -> Log Events
- [ ] List
- [ ] Read

With Venue -> Pay cards
- [ ] Create pay card
- [ ] List cards
- [ ] Change default card
- [ ] Validate against stripe db
- [ ] Delete pay card

With Venue -> Invoices
- [ ] List invoices
- [ ] View
- [ ] Download

With Venue -> Scheduled Delete
- [ ] List past delete jobs
- [ ] View next scheduled job time
- [ ] View number amount of data deleted by job
- [ ] Manually trigger delete job (full access only)

Moderator -> Users
- [ ] Create
- [ ] List
- [ ] Update
- [ ] Delete

Moderator -> Venues
- [ ] Create
- [ ] List
- [ ] Update
- [ ] Delete

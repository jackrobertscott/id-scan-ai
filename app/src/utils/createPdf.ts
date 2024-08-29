import puppeteer from "puppeteer"

export const createPdf = async (printUrl: string) => {
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    args: ["--no-sandbox"],
  })
  const browserPage = await browser.newPage()
  await browserPage.goto(printUrl, {
    waitUntil: ["networkidle0", "networkidle2"],
  })

  // Store buffer in variable
  const buffer = await browserPage.pdf({
    format: "A4",
    margin: {top: 96, bottom: 96},
    displayHeaderFooter: true,
    headerTemplate: `
      <style>
        html {-webkit-print-color-adjust: exact;}
        #header, #footer {margin: 0;padding: 0;}
      </style>
      <div style="background-color: transparent;margin: 0;height: 96px;width: 100%;"></div>
    `,
    footerTemplate: `
      <style></style>
      <div></div>
    `,
  })

  // Close the after the PDF is created
  await browser.close()

  // Return the PDF buffer
  return buffer
}

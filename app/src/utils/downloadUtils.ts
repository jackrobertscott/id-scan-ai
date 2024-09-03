export const downloadPdf = async (url: string, filename?: string) => {
  // Create a new anchor element
  const link = document.createElement("a")

  // Set the href attribute to the URL of the PDF file
  link.href = url

  if (filename) {
    // Set the download attribute to specify the desired filename
    link.download = filename
  }

  // Append the anchor element to the document body
  document.body.appendChild(link)

  // Simulate a click on the anchor element to trigger the download
  link.click()

  // Remove the anchor element from the document body
  document.body.removeChild(link)
}

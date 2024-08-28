import {SESv2Client, SendEmailCommand} from "@aws-sdk/client-sesv2"
import {srvConf} from "../srvConf"

export const sesClient = new SESv2Client({
  region: srvConf.AWS_DEFAULT_REGION,
})

export async function sendHtmlEmail({
  to,
  from = srvConf.AWS_SES_FROM_EMAIL,
  subject,
  html,
}: {
  to: string[]
  from?: string
  subject: string
  html: string
}): Promise<void> {
  await sesClient.send(
    new SendEmailCommand({
      FromEmailAddress: from,
      Destination: {ToAddresses: to},
      Content: {
        Simple: {
          Subject: {Data: subject.trim() + " | " + srvConf.APP_NAME},
          Body: {Html: {Data: html}},
        },
      },
    })
  )
}

export async function sendTextEmail({
  to,
  from = srvConf.AWS_SES_FROM_EMAIL,
  subject,
  text,
}: {
  to: string[]
  from?: string
  subject: string
  text: string
}): Promise<void> {
  await sesClient.send(
    new SendEmailCommand({
      FromEmailAddress: from,
      Destination: {ToAddresses: to},
      Content: {
        Simple: {
          Subject: {Data: subject.trim() + " | " + srvConf.APP_NAME},
          Body: {Text: {Data: text}},
        },
      },
    })
  )
}

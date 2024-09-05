import {css} from "@emotion/css"
import {Link} from "react-router-dom"
import {prettyCns} from "../utils/classNames"

const PRICE_PER_SCAN = 0.025

export const HomePage = () => {
  return (
    <div className={cn_hp.root}>
      <h1>ID Scan AI</h1>
      <div>Developed by Jack Scott, 2024</div>
      <br />
      <Link to="/login">{">>"} Login</Link>
      <br />
      <div>
        <h2>Features</h2>
        <ul>
          {FEATURE_LIST.map((f, i) => {
            return (
              <li key={i}>
                <strong>{f.title}</strong>
                <br />
                {f.desc}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

const cn_hp = prettyCns("HomePage", {
  root: css`
    padding: 1rem;
    a {
      text-decoration: underline;
    }
    strong {
      font-weight: bold;
    }
    li {
      margin: 1rem 0;
    }
  `,
})

const FEATURE_LIST: Array<{
  title: string
  desc: string
}> = [
  {
    title: "Facial AI Verification",
    desc: "Compare patrons to their ID documents using advanced facial recognition technology for enhanced accuracy.",
  },
  {
    title: "Multi-Venue Support",
    desc: "Manage multiple venues from a single account, with the ability to switch between them seamlessly.",
  },
  {
    title: "Patron Tagging",
    desc: "Add custom tags to patron profiles for managing bans or tracking lost and found items.",
  },
  {
    title: "ID Storage",
    desc: "Optionally store patron IDs for a configurable period to expedite future entry processes.",
  },
  {
    title: "Patron History",
    desc: "View a patron's entry history to quickly recall their last visit to the venue.",
  },
  {
    title: "Secure Data Sharing",
    desc: "Share scanned data securely with law enforcement agencies, with options for filtered searches or PDF exports.",
  },
  {
    title: "Granular Access Control",
    desc: "Enable or disable specific features for each staff member to maintain data security and prevent unauthorized access.",
  },
  {
    title: "Pay-Per-Scan Pricing",
    desc: `Flexible pricing model charged at $${PRICE_PER_SCAN} AUD per scan, ensuring you only pay for what you use.`,
  },
  {
    title: "Cross-Platform Compatibility",
    desc: "Use the software across multiple platforms and devices for seamless integration into your venue's operations.",
  },
  {
    title: "Real-time Verification",
    desc: "Perform quick and accurate ID checks using a single photo when a patron's information is already in the system.",
  },
]

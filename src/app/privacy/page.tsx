import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Orbita",
  description: "Orbita privacy policy for Drufiy A.I. Private Limited.",
};

const sections = [
  {
    title: "1. Scope",
    body: [
      "This Policy applies to Orbita and related services operated by Drufiy. It does not govern LinkedIn, X, Reddit, OpenAI, Vercel, Neon, or other third-party services, which process information under their own terms and privacy policies.",
    ],
  },
  {
    title: "2. Information we may collect",
    body: [
      "Account and contact information, such as your name, email address, profile image, access credentials created for Orbita, and support communications.",
      "Profile and preference information, including your goals, interests, target audiences, writing preferences, rejected writing patterns, operating mode, and other settings you choose to save.",
      "Content and instructions, including prompts, ideas, drafts, edits, campaign details, notes, uploaded material, and content you approve for publication.",
      "Relationship and opportunity records that you enter or explicitly save, such as names, roles, organizations, profile links, interaction notes, relationship stages, and suggested next actions.",
      "If you connect a third-party account, we receive only the information and permissions that you authorize and that the platform makes available to Orbita. For a LinkedIn connection, this may include your LinkedIn member identifier, basic profile information, email address, profile image, OAuth tokens, and the ability to publish content on your behalf where the w_member_social permission is granted.",
      "Orbita does not claim access to your complete LinkedIn feed, private messages, connection list, arbitrary member profiles, or personal-post analytics unless LinkedIn separately authorizes such access and you expressly consent.",
      "Device and browser information, IP address, timestamps, diagnostic events, error logs, security events, and approximate location derived from an IP address.",
      "Product activity, such as pages visited, features used, content status, approvals, campaigns, exports, resets, and integration health.",
      "During demo operation, Orbita may store working state locally in your browser using localStorage. Clearing browser data or using another device may remove or make this data unavailable.",
    ],
  },
  {
    title: "3. How we use personal data",
    body: [
      "Provide, secure, maintain, and troubleshoot Orbita.",
      "Authenticate users and connect accounts that users choose to authorize.",
      "Generate, rewrite, organize, and recommend content, campaigns, research steps, relationships, and opportunities.",
      "Prepare or publish content only after the user takes or confirms the relevant action, unless the user has clearly enabled another permitted operating mode.",
      "Remember user-approved goals and preferences so recommendations become more relevant.",
      "Measure product performance, prevent abuse, maintain audit records, and improve reliability.",
      "Respond to support, privacy, security, and legal requests.",
      "Comply with applicable law and enforce our agreements.",
    ],
  },
  {
    title: "4. Legal grounds and consent",
    body: [
      "We process personal data when necessary to provide a service you request, based on your consent, for legitimate interests such as security and product reliability where permitted, or to comply with legal obligations. Where consent is the applicable basis, you may withdraw it at any time. Withdrawal does not affect processing already lawfully completed.",
      "For users in India, we aim to process digital personal data consistently with the Digital Personal Data Protection Act, 2023 and applicable rules as they come into force. Nothing in this Policy limits rights available under applicable law.",
    ],
  },
  {
    title: "5. AI-assisted processing",
    body: [
      "Orbita may use AI service providers to process prompts, drafts, preferences, and other information needed to generate requested outputs. We will configure providers and data flows according to the features offered and our agreements with them. Do not submit highly sensitive information that is unnecessary for the task.",
      "AI output may be incomplete or inaccurate. Users should review generated content, factual claims, recommendations, and external actions before relying on or publishing them.",
    ],
  },
  {
    title: "6. Publishing and external actions",
    body: [
      "Connecting an account does not give Orbita unlimited control over it. Orbita is designed to keep genuine external interactions under user control. When a user approves publishing through a supported platform API, Orbita may transmit the approved content and the minimum necessary account identifiers or tokens to that platform.",
      "Orbita does not support spam, fake engagement, deceptive automation, CAPTCHA bypasses, unauthorized scraping, mass messaging, or attempts to evade platform protections.",
    ],
  },
  {
    title: "7. How we share information",
    body: [
      "We may share personal data only as reasonably necessary with infrastructure and hosting providers; AI service providers when an AI-powered feature is used; connected platforms when you authorize a connection or external action; professional advisers, auditors, insurers, or potential transaction counterparties subject to appropriate confidentiality obligations; and government authorities, courts, or other parties when disclosure is required by law or reasonably necessary to protect rights, safety, security, or the integrity of the service.",
      "We do not sell or rent personal data. We do not share personal data for third-party behavioural advertising.",
    ],
  },
  {
    title: "8. Data storage, retention, and deletion",
    body: [
      "Data may be stored in your browser, in Orbita's managed databases, or by service providers acting for us. We retain personal data only for as long as reasonably necessary to provide Orbita, satisfy the purposes described in this Policy, maintain security and audit records, resolve disputes, and comply with legal obligations.",
      "OAuth tokens are retained only while required to provide the connected feature or until the connection is revoked, subject to platform requirements. When an account is disconnected or deletion is requested, we will delete or de-identify associated data within a reasonable period unless retention is required by law, security needs, dispute resolution, or a valid platform requirement.",
    ],
  },
  {
    title: "9. Security",
    body: [
      "We use reasonable technical and organizational safeguards appropriate to the nature of the data, including access controls, secret management, encrypted network transport, restricted production access, validation, logging, and user approval for external actions. No online service or storage system can guarantee absolute security.",
      "Never place passwords, OAuth client secrets, private API keys, or other credentials into public repositories, ordinary prompts, or publicly accessible fields.",
    ],
  },
  {
    title: "10. International processing",
    body: [
      "Orbita and its service providers may process information in countries other than your own. Where required, we will use appropriate contractual or legal safeguards for international transfers. Third-party platforms may independently transfer data under their own policies.",
    ],
  },
  {
    title: "11. Your choices and rights",
    body: [
      "Depending on applicable law, you may have rights to access, correct, delete, export, withdraw consent, object to certain processing, disconnect platform integrations, raise a grievance, and, where applicable, nominate another person to exercise rights on your behalf.",
      "To exercise a privacy right, email drufiyai0001@gmail.com from the address associated with your account. We may request reasonable verification before acting. You may also revoke LinkedIn authorization through LinkedIn's permitted-services settings; revocation may prevent connected features from working.",
    ],
  },
  {
    title: "12. Cookies and local storage",
    body: [
      "Orbita may use essential cookies or similar technologies for authentication, security, preferences, and service operation. Demo mode currently uses browser localStorage to preserve working state. If non-essential analytics or advertising technologies are introduced, we will provide any notice or consent controls required by law before using them.",
    ],
  },
  {
    title: "13. Children's privacy",
    body: [
      "Orbita is not directed to children under 18. We do not knowingly collect personal data from children under 18. If you believe a child has provided personal data, contact us so we can investigate and take appropriate action.",
    ],
  },
  {
    title: "14. Third-party links and services",
    body: [
      "Orbita may display links to profiles, posts, opportunities, websites, or services not controlled by Drufiy. We are not responsible for the privacy, security, availability, or content of third-party services. Review their policies before providing information or authorizing access.",
    ],
  },
  {
    title: "15. Changes to this Policy",
    body: [
      "We may update this Policy to reflect product, legal, security, or operational changes. The updated version will display a revised effective date. Where required, we will provide additional notice or request renewed consent.",
    ],
  },
  {
    title: "16. Contact and grievance requests",
    body: [
      "Data Fiduciary / Operator: Drufiy A.I. Private Limited",
      "Product: Orbita",
      "Privacy and grievance email: drufiyai0001@gmail.com",
      "Please use the subject line 'Orbita Privacy Request' and describe the request sufficiently for us to identify the relevant account and respond.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#1e1d1a]">
      <div className="mx-auto w-full max-w-4xl px-6 py-10 sm:py-14">
        <header className="border-b border-black/10 pb-8">
          <Link href="/" className="text-sm font-medium opacity-70 transition hover:opacity-100">
            Orbita
          </Link>
          <h1 className="mt-8 text-4xl font-semibold tracking-normal sm:text-5xl">Orbita Privacy Policy</h1>
          <p className="mt-4 text-sm leading-6 opacity-70">Effective date: 9 August 2026 | Last updated: 9 August 2026</p>
          <p className="mt-6 max-w-3xl text-base leading-8 opacity-80">
            Orbita is operated by Drufiy A.I. Private Limited (&quot;Drufiy&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). This Privacy Policy explains how Orbita collects,
            uses, stores, shares, and protects personal data when you use its website, applications, AI-assisted tools, and integrations.
          </p>
        </header>

        <div className="mt-8 space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="rounded-lg border border-black/10 bg-white/60 p-5 shadow-sm">
              <h2 className="text-xl font-semibold tracking-normal">{section.title}</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 opacity-80">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

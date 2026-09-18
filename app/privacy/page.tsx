export default function PrivacyPage() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Privacy Policy — SporkIt</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <style dangerouslySetInnerHTML={{ __html: `
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html, body { background: #0F0F0F; color: #FFFFFF; font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }
          .page { max-width: 680px; margin: 0 auto; padding: 48px 24px 80px; }
          .logo-link { display: flex; align-items: center; gap: 12px; text-decoration: none; margin-bottom: 48px; }
          .logo-circle { width: 40px; height: 40px; border-radius: 50%; background: #FF8C00; display: flex; align-items: flex-start; justify-content: center; overflow: visible; flex-shrink: 0; }
          .logo-circle svg { margin-top: -1px; }
          .wordmark { font-size: 22px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; }
          .wordmark span { color: #FF8C00; }
          h1 { font-size: 32px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; margin-bottom: 8px; }
          .meta { font-size: 14px; color: #888888; margin-bottom: 48px; }
          h2 { font-size: 18px; font-weight: 700; color: #FF8C00; margin-top: 40px; margin-bottom: 12px; }
          p { font-size: 15px; line-height: 1.7; color: #CCCCCC; margin-bottom: 16px; }
          ul { padding-left: 20px; margin-bottom: 16px; }
          li { font-size: 15px; line-height: 1.7; color: #CCCCCC; margin-bottom: 6px; }
          a { color: #FF8C00; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .footer { margin-top: 64px; padding-top: 24px; border-top: 1px solid #222222; font-size: 13px; color: #555555; }
        `}} />
      </head>
      <body>
        <div className="page">
          <a href="https://sporkitapp.com" className="logo-link">
            <div className="logo-circle">
              <svg width="21" height="34" viewBox="0 0 78 127" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M38.4995 0C42.968 0 45.9579 0.4931 45.9995 0.5C44.4995 4.99985 43.9995 15.5 43.9995 15.5C43.9985 15.5168 43.5 24.0034 43.9995 27.5C44.8545 30.0718 45.7997 32.0001 49.9995 35C58.5534 41.1099 70.4995 45.5001 75.9995 66.5C81.011 85.6347 68.4995 113 53.4995 122C53.3328 113.167 52.7995 94.6 51.9995 93C51.3327 92.5 49.8992 91.8002 47.4995 93L45.9995 125.5C45.6659 125.833 44.4991 126.5 42.4995 126.5L41.4995 93C41.17 92.8354 40.1265 92.5093 38.561 92.501C36.9958 92.5095 35.9526 92.8355 35.6235 93L34.6235 126.5C32.6236 126.5 31.4569 125.833 31.1235 125.5L29.6235 93C27.2236 91.8 25.7902 92.5 25.1235 93C24.3235 94.6 23.7902 113.167 23.6235 122C8.62353 113 -3.88793 85.6347 1.12352 66.5C6.62353 45.5 18.5696 41.1099 27.1235 35C31.3235 32 32.2685 30.0719 33.1235 27.5C33.6233 24.0015 33.1239 15.5072 33.1235 15.5C33.1235 15.5 32.6235 4.99985 31.1235 0.5C31.1431 0.496743 34.0832 0.00901329 38.4995 0Z" fill="#0F0F0F"/>
              </svg>
            </div>
            <div className="wordmark">Spork<span>It</span></div>
          </a>

          <h1>Privacy Policy</h1>
          <p className="meta">Last updated: September 2026</p>

          <p>SporkIt ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information when you use the SporkIt app and website (sporkitapp.com).</p>

          <h2>1. Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul>
            <li><strong>Phone number</strong> — required to create an account and verify your identity via one-time password (OTP).</li>
            <li><strong>Profile information</strong> — your display name, username, profile photo, and optional bio.</li>
            <li><strong>Location data</strong> — if you grant permission, we use your location to show nearby restaurants and calculate distances. Location is never stored on our servers without your explicit action.</li>
            <li><strong>Content you create</strong> — videos, photos, reviews, sporks, and dish preferences you submit through the app.</li>
            <li><strong>Usage data</strong> — how you interact with the app, including which screens you visit and features you use, to improve the product.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To create and manage your account</li>
            <li>To personalise your feed based on your spork history and dish preferences</li>
            <li>To show restaurant distances and nearby recommendations</li>
            <li>To display your public profile, reviews, and sporks to other users</li>
            <li>To send you OTP verification codes via SMS (Twilio)</li>
            <li>To detect and prevent spam, abuse, and policy violations</li>
            <li>To improve and develop SporkIt features</li>
          </ul>

          <h2>3. What We Share</h2>
          <p>We do not sell your personal information. We share data only in the following circumstances:</p>
          <ul>
            <li><strong>Service providers</strong> — we use Supabase (database), Twilio (SMS), Bunny.net (video hosting), and Google (Places API, Cloud Vision) to operate the app. These providers process data on our behalf under strict agreements.</li>
            <li><strong>Public content</strong> — your username, profile photo, reviews, and sporks are visible to other SporkIt users. Videos you post are public by default.</li>
            <li><strong>Legal requirements</strong> — we may disclose information if required by law or to protect the safety of our users.</li>
          </ul>

          <h2>4. Your Phone Number</h2>
          <p>Your phone number is used solely for account verification. We never share your phone number with other users, advertisers, or third parties. It is stored securely and used only to send you OTP codes when you log in.</p>

          <h2>5. Location Data</h2>
          <p>Location access is optional. If granted, your device location is used in-session to show nearby restaurants and distances. We do not continuously track your location in the background. You can revoke location permission at any time in your device settings.</p>

          <h2>6. Content Moderation</h2>
          <p>Videos and photos you upload may be scanned by Google Cloud Vision API for safety compliance before being published. This is an automated process to detect inappropriate content. Images are not stored by Google beyond the scan.</p>

          <h2>7. Data Retention</h2>
          <p>We retain your account data for as long as your account is active. If you delete your account, your personal information is removed within 30 days. Public content (reviews, sporks) may be retained in anonymised form to preserve the integrity of restaurant ratings.</p>

          <h2>8. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and personal data</li>
            <li>Withdraw location permission at any time</li>
          </ul>
          <p>To exercise these rights, contact us at <a href="mailto:contact@sporkitapp.com">contact@sporkitapp.com</a>.</p>

          <h2>9. Children</h2>
          <p>SporkIt is not intended for users under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us and we will delete it promptly.</p>

          <h2>10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. When we do, we will update the date at the top of this page. Continued use of SporkIt after changes constitutes acceptance of the updated policy.</p>

          <h2>11. Contact</h2>
          <p>If you have questions about this Privacy Policy, contact us at <a href="mailto:contact@sporkitapp.com">contact@sporkitapp.com</a>.</p>
          <p>SporkIt is operated by Zak Sanguanshua, Bangkok, Thailand.</p>

          <div className="footer">
            <p>© 2026 SporkIt · <a href="https://sporkitapp.com">sporkitapp.com</a> · <a href="https://sporkitapp.com/terms">Terms of Service</a></p>
          </div>
        </div>
      </body>
    </html>
  )
}

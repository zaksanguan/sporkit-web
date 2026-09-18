export default function TermsPage() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Terms of Service — SporkIt</title>
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

          <h1>Terms of Service</h1>
          <p className="meta">Last updated: September 2026</p>

          <p>Welcome to SporkIt. By downloading, installing, or using the SporkIt app or website (sporkitapp.com), you agree to be bound by these Terms of Service. If you do not agree, do not use SporkIt.</p>

          <h2>1. Who Can Use SporkIt</h2>
          <p>You must be at least 13 years old to use SporkIt. By creating an account, you confirm that you meet this requirement. SporkIt is currently available in Thailand and is operated by Zak Sanguanshua, Bangkok, Thailand.</p>

          <h2>2. Your Account</h2>
          <p>You register using your phone number. You are responsible for all activity that occurs under your account. Keep your access secure and do not share your OTP codes with anyone.</p>
          <p>You may only create one account per phone number. Creating multiple accounts to circumvent bans or restrictions is prohibited.</p>

          <h2>3. What You Can Post</h2>
          <p>SporkIt is a food diary and restaurant discovery platform. You may post:</p>
          <ul>
            <li>Videos and photos of food and restaurants</li>
            <li>Reviews and verdicts about restaurants and dishes</li>
            <li>Sporks (ratings) for places you have visited or want to visit</li>
          </ul>
          <p>All content must be honest, relevant to food or dining, and your own. Do not post content you do not have the right to share.</p>

          <h2>4. Prohibited Content</h2>
          <p>You may not post content that:</p>
          <ul>
            <li>Is false, misleading, or fabricated (fake sporks or reviews)</li>
            <li>Is sexually explicit, violent, or otherwise inappropriate</li>
            <li>Harasses, threatens, or targets other users</li>
            <li>Infringes on any third party's copyright, trademark, or other rights</li>
            <li>Promotes illegal activity</li>
            <li>Is spam or repetitive low-quality content</li>
            <li>Has nothing to do with food or restaurants</li>
          </ul>
          <p>We use automated screening and manual review to enforce these rules. Content that violates these terms may be removed without notice.</p>

          <h2>5. Your Content — Licence to SporkIt</h2>
          <p>You own the content you post. By posting on SporkIt, you grant us a non-exclusive, royalty-free, worldwide licence to store, display, and distribute your content within the SporkIt platform. We will not sell your content to third parties.</p>
          <p>If you delete your content or your account, your licence ends. However, copies may persist in backups for a limited period.</p>

          <h2>6. Restaurant Information</h2>
          <p>Restaurant data on SporkIt is sourced from Google Places API, user submissions, and restaurant owners who claim their listings. We do not guarantee the accuracy, completeness, or currency of restaurant information including hours, addresses, and menus. Always verify with the restaurant directly before visiting.</p>

          <h2>7. Restaurant Accounts</h2>
          <p>Restaurant owners may claim their listing by creating a Restaurant account. Claiming a listing does not give ownership over user-submitted sporks or reviews. Restaurant owners may not remove or alter genuine user reviews.</p>

          <h2>8. Spork Authenticity</h2>
          <p>Sporks are personal verdicts about real dining experiences. Posting fake sporks — including self-promotion, competitor sabotage, or incentivised reviews — violates these Terms and may result in account suspension.</p>

          <h2>9. Intellectual Property</h2>
          <p>SporkIt, the SporkIt logo, and all related brand assets are the property of SporkIt. You may not use our name, logo, or trademarks without prior written permission.</p>

          <h2>10. Termination</h2>
          <p>We may suspend or terminate your account at any time if you violate these Terms or for any other reason at our discretion. You may delete your account at any time from Settings.</p>

          <h2>11. Disclaimers</h2>
          <p>SporkIt is provided "as is" without warranties of any kind. We do not guarantee that the app will be available at all times or that restaurant information will be accurate. SporkIt is not responsible for any dining experience based on content posted on the platform.</p>

          <h2>12. Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, SporkIt is not liable for any indirect, incidental, or consequential damages arising from your use of the app or reliance on any content posted by users.</p>

          <h2>13. Governing Law</h2>
          <p>These Terms are governed by the laws of Thailand. Any disputes shall be resolved in the courts of Bangkok, Thailand.</p>

          <h2>14. Changes to These Terms</h2>
          <p>We may update these Terms from time to time. We will notify you of significant changes through the app. Continued use of SporkIt after changes constitutes acceptance of the updated Terms.</p>

          <h2>15. Contact</h2>
          <p>For questions about these Terms, contact us at <a href="mailto:hello@sporkitapp.com">hello@sporkitapp.com</a>.</p>

          <div className="footer">
            <p>© 2026 SporkIt · <a href="https://sporkitapp.com">sporkitapp.com</a> · <a href="https://sporkitapp.com/privacy">Privacy Policy</a></p>
          </div>
        </div>
      </body>
    </html>
  )
}

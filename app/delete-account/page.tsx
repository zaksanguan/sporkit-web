export default function DeleteAccountPage() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Delete your account — SporkIt</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <style dangerouslySetInnerHTML={{ __html: `
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html, body { background: #0F0F0F; color: #FFFFFF; font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }
          .page { max-width: 680px; margin: 0 auto; padding: 48px 24px 80px; }
          .logo-link { display: flex; align-items: center; gap: 4px; text-decoration: none; margin-bottom: 48px; }
          .logo-circle { width: 36px; height: 36px; border-radius: 50%; background: #FF8C00; display: flex; align-items: flex-start; justify-content: center; overflow: visible; flex-shrink: 0; }
          .logo-circle svg { margin-top: -1px; }
          .wordmark { font-size: 32px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.7px; }
          .wordmark span { color: #FF8C00; }
          h1 { font-size: 32px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; margin-bottom: 8px; }
          .meta { font-size: 14px; color: #888888; margin-bottom: 48px; }
          h2 { font-size: 18px; font-weight: 700; color: #FF8C00; margin-top: 40px; margin-bottom: 12px; }
          p { font-size: 15px; line-height: 1.7; color: #CCCCCC; margin-bottom: 16px; }
          ul, ol { padding-left: 20px; margin-bottom: 16px; }
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
              <svg width="18" height="30" viewBox="0 0 78 127" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M38.4995 0C42.968 0 45.9579 0.4931 45.9995 0.5C44.4995 4.99985 43.9995 15.5 43.9995 15.5C43.9985 15.5168 43.5 24.0034 43.9995 27.5C44.8545 30.0718 45.7997 32.0001 49.9995 35C58.5534 41.1099 70.4995 45.5001 75.9995 66.5C81.011 85.6347 68.4995 113 53.4995 122C53.3328 113.167 52.7995 94.6 51.9995 93C51.3327 92.5 49.8992 91.8002 47.4995 93L45.9995 125.5C45.6659 125.833 44.4991 126.5 42.4995 126.5L41.4995 93C41.17 92.8354 40.1265 92.5093 38.561 92.501C36.9958 92.5095 35.9526 92.8355 35.6235 93L34.6235 126.5C32.6236 126.5 31.4569 125.833 31.1235 125.5L29.6235 93C27.2236 91.8 25.7902 92.5 25.1235 93C24.3235 94.6 23.7902 113.167 23.6235 122C8.62353 113 -3.88793 85.6347 1.12352 66.5C6.62353 45.5 18.5696 41.1099 27.1235 35C31.3235 32 32.2685 30.0719 33.1235 27.5C33.6233 24.0015 33.1239 15.5072 33.1235 15.5C33.1235 15.5 32.6235 4.99985 31.1235 0.5C31.1431 0.496743 34.0832 0.00901329 38.4995 0Z" fill="#0F0F0F"/>
              </svg>
            </div>
            <div className="wordmark">Spork<span>It</span></div>
          </a>

          <h1>Delete your SporkIt account</h1>
          <p className="meta">Last updated: October 2026</p>

          <p>SporkIt is an app by SporkIt (sporkitapp.com). You can ask us to delete your account and the data linked to it at any time.</p>

          <h2>How to request deletion</h2>
          <ol>
            <li>Send an email to <a href="mailto:contact@sporkitapp.com">contact@sporkitapp.com</a> with the subject "Delete my account".</li>
            <li>Write the phone number you use to log in to SporkIt (including country code, for example +66...). We use it to find your account.</li>
            <li>We reply to confirm, then delete your account within 30 days.</li>
          </ol>

          <h2>What we delete</h2>
          <ul>
            <li>Your profile (name, username, bio, profile photo)</li>
            <li>Your phone number and login</li>
            <li>Your sporks, saved places and reviews</li>
            <li>Videos and photos you posted</li>
            <li>Your dish preferences</li>
          </ul>

          <h2>What we keep</h2>
          <ul>
            <li>Nothing linked to you after deletion, except copies in encrypted backups, which are removed within 30 days of deletion.</li>
            <li>Reports about content that broke our rules may be kept for safety, without your profile details.</li>
          </ul>

          <div className="footer">
            <p>Questions? Email <a href="mailto:contact@sporkitapp.com">contact@sporkitapp.com</a>.</p>
            <p>© 2026 SporkIt · <a href="https://sporkitapp.com">sporkitapp.com</a> · <a href="https://sporkitapp.com/privacy">Privacy Policy</a> · <a href="https://sporkitapp.com/terms">Terms of Service</a></p>
          </div>
        </div>
      </body>
    </html>
  )
}

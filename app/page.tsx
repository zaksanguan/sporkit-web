export default function Home() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="SporkIt — Your food diary starts here" />
        <meta property="og:description" content="Discover dishes worth trying. Share your honest verdict. Because every meal has a story." />
        <meta property="og:image" content="https://sporkitapp.com/og-image.jpg" />
        <meta property="og:url" content="https://sporkitapp.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="SporkIt" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SporkIt — Your food diary starts here" />
        <meta name="twitter:description" content="Discover dishes worth trying. Share your honest verdict. Because every meal has a story." />
        <meta name="twitter:image" content="https://sporkitapp.com/og-image.jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <style dangerouslySetInnerHTML={{ __html: `
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          :root { --bg: #0F0F0F; --orange: #FF8C00; --text: #FFFFFF; --muted: #888888; --secondary: #AAAAAA; }
          html, body { background: var(--bg); color: var(--text); font-family: 'Plus Jakarta Sans', sans-serif; min-height: 100vh; -webkit-font-smoothing: antialiased; }
          .page { max-width: 480px; margin: 0 auto; padding: 0 24px; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 40px; text-align: center; }
          .logo-wrap { display: flex; flex-direction: column; align-items: center; gap: 16px; }
          .logo-circle { width: 96px; height: 96px; border-radius: 50%; background: var(--orange); display: flex; align-items: flex-start; justify-content: center; overflow: visible; }
          .logo-circle svg { margin-top: -2px; }
          .wordmark { font-size: 36px; font-weight: 800; letter-spacing: -1px; }
          .wordmark span { color: var(--orange); }
          .hero { display: flex; flex-direction: column; gap: 12px; }
          .hero h1 { font-size: 28px; font-weight: 800; line-height: 1.2; letter-spacing: -0.5px; }
          .hero p { font-size: 15px; color: var(--secondary); line-height: 1.6; }
          .tagline { font-size: 20px; font-weight: 800; color: var(--text); letter-spacing: -0.3px; }
          .cta-group { display: flex; flex-direction: column; gap: 12px; width: 100%; }
          .btn { display: flex; align-items: center; justify-content: center; padding: 16px 24px; border-radius: 999px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 17px; font-weight: 700; cursor: pointer; text-decoration: none; transition: opacity 0.15s; }
          .btn:hover { opacity: 0.85; }
          .btn-primary { background: var(--orange); color: #0F0F0F; }
          .btn-secondary { background: transparent; color: var(--text); border: 1px solid #333; }
          footer { font-size: 13px; color: var(--muted); padding-bottom: 32px; }
        `}} />
      </head>
      <body>
        <div className="page">
          <div className="logo-wrap">
            <div className="logo-circle">
              <svg width="49" height="80" viewBox="0 0 78 127" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M38.4995 0C42.968 0 45.9579 0.4931 45.9995 0.5C44.4995 4.99985 43.9995 15.5 43.9995 15.5C43.9985 15.5168 43.5 24.0034 43.9995 27.5C44.8545 30.0718 45.7997 32.0001 49.9995 35C58.5534 41.1099 70.4995 45.5001 75.9995 66.5C81.011 85.6347 68.4995 113 53.4995 122C53.3328 113.167 52.7995 94.6 51.9995 93C51.3327 92.5 49.8992 91.8002 47.4995 93L45.9995 125.5C45.6659 125.833 44.4991 126.5 42.4995 126.5L41.4995 93C41.17 92.8354 40.1265 92.5093 38.561 92.501C36.9958 92.5095 35.9526 92.8355 35.6235 93L34.6235 126.5C32.6236 126.5 31.4569 125.833 31.1235 125.5L29.6235 93C27.2236 91.8 25.7902 92.5 25.1235 93C24.3235 94.6 23.7902 113.167 23.6235 122C8.62353 113 -3.88793 85.6347 1.12352 66.5C6.62353 45.5 18.5696 41.1099 27.1235 35C31.3235 32 32.2685 30.0719 33.1235 27.5C33.6233 24.0015 33.1239 15.5072 33.1235 15.5C33.1235 15.5 32.6235 4.99985 31.1235 0.5C31.1431 0.496743 34.0832 0.00901329 38.4995 0Z" fill="#0F0F0F"/>
              </svg>
            </div>
            <div className="wordmark">Spork<span>It</span></div>
          </div>
          <div className="hero">
            <h1>Your food diary starts here</h1>
            <p>Discover dishes worth trying. Share your honest verdict. Because every meal has a story.</p>
          </div>
          <div className="tagline">Worth it? Spork it.</div>
          <div className="cta-group">
            <a href="#" className="btn btn-primary">Download on the App Store</a>
            <a href="#" className="btn btn-secondary">Coming to Android</a>
          </div>
          <footer>© 2026 SporkIt. Bangkok, Thailand.</footer>
        </div>
      </body>
    </html>
  )
}

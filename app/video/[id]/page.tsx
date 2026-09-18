import { Metadata } from 'next'
import { supabase } from '../../../lib/supabase'

type Props = {
  params: Promise<{ id: string }>
}

async function getVideo(id: string) {
  const { data } = await supabase
    .from('videos')
    .select('id, thumbnail_url, dish_name, youtube_video_id, restaurant:restaurants(name)')
    .eq('id', id)
    .single()
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const video = await getVideo(id)
  if (!video) return { title: 'SporkIt', description: 'Your food diary starts here' }
  const restaurant = Array.isArray(video.restaurant) ? video.restaurant[0] as { name: string } : video.restaurant as { name: string } | null
  const title = video.dish_name
    ? video.dish_name + ' at ' + (restaurant?.name ?? '') + ' — SporkIt'
    : (restaurant?.name ?? '') + ' — SporkIt'
  return {
    title,
    description: 'Worth it? Spork it.',
    openGraph: {
      title,
      description: 'Worth it? Spork it.',
      images: [{ url: video.thumbnail_url, width: 1280, height: 720 }],
      type: 'website',
      siteName: 'SporkIt',
      url: 'https://sporkitapp.com/video/' + id,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: 'Worth it? Spork it.',
      images: [video.thumbnail_url],
    },
  }
}

export default async function VideoPage({ params }: Props) {
  const { id } = await params
  const video = await getVideo(id)
  const restaurant = (video?.restaurant as unknown as { name: string } | null)
  const name = video?.dish_name
    ? video.dish_name + ' at ' + (restaurant?.name ?? '')
    : (restaurant?.name ?? 'SporkIt')

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html, body { background: #0F0F0F; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }
          .banner { position: sticky; top: 0; z-index: 100; background: #1A1A1A; border-bottom: 1px solid #222; display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; }
          .banner-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
          .logo-circle { width: 32px; height: 32px; border-radius: 50%; background: #FF8C00; display: flex; align-items: flex-start; justify-content: center; overflow: visible; flex-shrink: 0; }
          .logo-circle svg { margin-top: -1px; }
          .wordmark { font-size: 18px; font-weight: 800; color: #fff; letter-spacing: -0.3px; }
          .wordmark span { color: #FF8C00; }
          .banner-btn { background: #FF8C00; color: #0F0F0F; padding: 8px 16px; border-radius: 999px; font-weight: 700; font-size: 14px; text-decoration: none; white-space: nowrap; }
          .page { max-width: 640px; margin: 0 auto; padding: 24px 16px 64px; display: flex; flex-direction: column; gap: 20px; }
          .video-wrap { position: relative; width: 100%; padding-top: 56.25%; border-radius: 12px; overflow: hidden; background: #111; }
          .video-wrap iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }
          h1 { font-size: 22px; font-weight: 800; color: #fff; letter-spacing: -0.3px; }
          .sub { font-size: 14px; color: #888; }
          .cta-btn { display: block; background: #FF8C00; color: #0F0F0F; padding: 16px 32px; border-radius: 999px; font-weight: 700; font-size: 17px; text-decoration: none; text-align: center; }
        `}} />
      </head>
      <body>
        {/* Sticky banner */}
        <div className="banner">
          <a href="https://sporkitapp.com" className="banner-logo">
            <div className="logo-circle">
              <svg width="17" height="27" viewBox="0 0 78 127" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M38.4995 0C42.968 0 45.9579 0.4931 45.9995 0.5C44.4995 4.99985 43.9995 15.5 43.9995 15.5C43.9985 15.5168 43.5 24.0034 43.9995 27.5C44.8545 30.0718 45.7997 32.0001 49.9995 35C58.5534 41.1099 70.4995 45.5001 75.9995 66.5C81.011 85.6347 68.4995 113 53.4995 122C53.3328 113.167 52.7995 94.6 51.9995 93C51.3327 92.5 49.8992 91.8002 47.4995 93L45.9995 125.5C45.6659 125.833 44.4991 126.5 42.4995 126.5L41.4995 93C41.17 92.8354 40.1265 92.5093 38.561 92.501C36.9958 92.5095 35.9526 92.8355 35.6235 93L34.6235 126.5C32.6236 126.5 31.4569 125.833 31.1235 125.5L29.6235 93C27.2236 91.8 25.7902 92.5 25.1235 93C24.3235 94.6 23.7902 113.167 23.6235 122C8.62353 113 -3.88793 85.6347 1.12352 66.5C6.62353 45.5 18.5696 41.1099 27.1235 35C31.3235 32 32.2685 30.0719 33.1235 27.5C33.6233 24.0015 33.1239 15.5072 33.1235 15.5C33.1235 15.5 32.6235 4.99985 31.1235 0.5C31.1431 0.496743 34.0832 0.00901329 38.4995 0Z" fill="#0F0F0F"/>
              </svg>
            </div>
            <div className="wordmark">Spork<span>It</span></div>
          </a>
          <a href="https://sporkitapp.com" className="banner-btn">Download SporkIt</a>
        </div>

        {/* Content */}
        <div className="page">
          {video?.youtube_video_id ? (
            <div className="video-wrap">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.youtube_video_id}?autoplay=0&rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : video?.thumbnail_url ? (
            <img src={video.thumbnail_url} alt={name} style={{ width: '100%', borderRadius: '12px' }} />
          ) : null}

          <div>
            <h1>{name}</h1>
            {restaurant?.name && video?.dish_name && (
              <p className="sub">{restaurant.name}</p>
            )}
          </div>

          <a href="https://sporkitapp.com" className="cta-btn">Download SporkIt to see the full review</a>
        </div>
      </body>
    </html>
  )
}

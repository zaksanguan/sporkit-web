import { Metadata } from 'next'
import { supabase } from '../../../lib/supabase'

type Props = {
  params: Promise<{ id: string }>
}

async function getVideo(id: string) {
  const { data } = await supabase
    .from('videos')
    .select('id, thumbnail_url, dish_name, restaurant:restaurants(name)')
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
    <main style={{ minHeight: '100vh', background: '#0F0F0F', color: '#fff', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '24px' }}>
      {video?.thumbnail_url && (
        <img src={video.thumbnail_url} alt={name} style={{ width: '100%', maxWidth: '600px', borderRadius: '12px' }} />
      )}
      <h1 style={{ fontSize: '24px', fontWeight: '800', textAlign: 'center' }}>{name}</h1>
      <p style={{ color: '#888', textAlign: 'center' }}>Download SporkIt to see the full review</p>
      <a href="https://sporkitapp.com" style={{ background: '#FF8C00', color: '#0F0F0F', padding: '16px 32px', borderRadius: '999px', fontWeight: '700', fontSize: '17px', textDecoration: 'none' }}>Download SporkIt</a>
    </main>
  )
}

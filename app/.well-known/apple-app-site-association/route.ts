import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    applinks: {
      apps: [],
      details: [
        {
          appID: '3KTLJ8T633.com.sporkitapp.sporkit',
          paths: ['/video/*']
        }
      ]
    }
  })
}

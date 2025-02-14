// src/app/api/google-photos/route.ts
import { NextResponse } from 'next/server'

interface GooglePhotoResponse {
  photo_reference: string
}

interface GooglePlacesResponse {
  result?: {
    photos?: GooglePhotoResponse[]
  }
  status: string
  error_message?: string
}

export async function GET() {
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID
  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!placeId || !apiKey) {
    return NextResponse.json(
      { error: "Missing API credentials" },
      { status: 500 }
    )
  }

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json')
    url.searchParams.set('place_id', placeId)
    url.searchParams.set('fields', 'photos')
    url.searchParams.set('key', apiKey)

    const response = await fetch(url.toString())
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json() as GooglePlacesResponse
    
    if (data.status !== 'OK') {
      throw new Error(data.error_message ?? 'Google API error')
    }

    const photos = data.result?.photos?.map(photo => ({
      photo_url: `https://maps.googleapis.com/maps/api/place/photo?${new URLSearchParams({
        maxwidth: '1600',
        photoreference: photo.photo_reference,
        key: apiKey
      })}`
    })) ?? []

    return NextResponse.json({ photos })
    
  } catch (error) {
    console.error('Google Photos API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    )
  }
}
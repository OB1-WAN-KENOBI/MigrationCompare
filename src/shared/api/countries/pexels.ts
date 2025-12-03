import axios from 'axios';
import { logError } from '@shared/lib/utils/logger';

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt?: string;
}

export interface PexelsSearchResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  next_page?: string;
  prev_page?: string;
}

const PEXELS_API = 'https://api.pexels.com/v1';

export async function searchCountryPhotos(
  countryName: string,
  limit: number = 5
): Promise<PexelsPhoto[]> {
  const apiKey = import.meta.env.VITE_PEXELS_API_KEY;

  if (!apiKey) {
    // Если нет API ключа, возвращаем пустой массив
    return [];
  }

  try {
    const response = await axios.get<PexelsSearchResponse>(`${PEXELS_API}/search`, {
      params: {
        query: `${countryName} city skyline architecture urban buildings`,
        per_page: limit,
        orientation: 'landscape',
      },
      headers: {
        Authorization: apiKey,
      },
    });

    return response.data.photos;
  } catch (error) {
    logError(error, 'Pexels API');
    return [];
  }
}

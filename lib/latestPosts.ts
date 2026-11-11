import { supabase } from "./supabase";

export type LatestPost = {
  id: string;
  dish_name: string | null;
  restaurant_name: string | null;
  username: string | null;
  thumbnail_url: string;
  video_url: string;
  created_at: string;
};

// Newest in-app posts (never throws: a failure just hides the section).
export async function getLatestPosts(limit = 3): Promise<LatestPost[]> {
  try {
    const { data, error } = await supabase.rpc("get_latest_public_posts", { p_limit: limit });
    if (error || !Array.isArray(data)) return [];
    return data as LatestPost[];
  } catch {
    return [];
  }
}

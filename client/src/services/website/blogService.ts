import axios from "axios";

// --- TYPE ---
export interface BlogPost {
  title: string;
  content: string;
  link: string;
  pubDate: string;
  thumbnail?: string;
}

// --- API URL ---
const MEDIUM_RSS_URL =
  "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@sist.sigai";

// --- FETCH BLOG POSTS ---
export const fetchMediumBlogs = async (): Promise<BlogPost[]> => {
  const res = await axios.get(MEDIUM_RSS_URL);

  return res.data.items.map((item: any) => {
    // Extract first image from content HTML (fallback)
    let image: string | undefined;

    if (item.content) {
      const match = item.content.match(/<img[^>]+src="([^">]+)"/);
      if (match && match[1]) {
        image = match[1];
      }
    }

    return {
      title: item.title,
      content: item.description
        ? item.description.replace(/<[^>]+>/g, "").substring(0, 150) + "..."
        : "",
      link: item.link,
      pubDate: item.pubDate,
      thumbnail: image,
    };
  });
};

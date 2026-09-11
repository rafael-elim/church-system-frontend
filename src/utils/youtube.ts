export function getYoutubeVideoId(value: string) {
  const raw = value.trim();

  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) {
    return raw;
  }

  try {
    const url = new URL(raw);
    const host = url.hostname.replace("www.", "");

    if (host === "youtu.be") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      return /^[A-Za-z0-9_-]{11}$/.test(videoId) ? videoId : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname.startsWith("/embed/")) {
        const videoId = url.pathname.replace("/embed/", "").split("/")[0];
        return /^[A-Za-z0-9_-]{11}$/.test(videoId) ? videoId : null;
      }

      const videoId = url.searchParams.get("v");
      return videoId && /^[A-Za-z0-9_-]{11}$/.test(videoId) ? videoId : null;
    }
  } catch {
    return null;
  }

  return null;
}

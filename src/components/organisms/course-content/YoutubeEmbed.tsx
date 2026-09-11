import { getYoutubeVideoId } from "@/utils/youtube";

interface YoutubeEmbedProps {
  value: string;
}

export function YoutubeEmbed({ value }: YoutubeEmbedProps) {
  const videoId = getYoutubeVideoId(value);

  if (!videoId) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-md border bg-slate-950">
      <iframe
        className="aspect-video w-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="Pré-visualização do vídeo"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

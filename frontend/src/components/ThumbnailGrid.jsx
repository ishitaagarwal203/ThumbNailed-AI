import ThumbnailCard from "./ThumbnailCard";

export default function ThumbnailGrid({ thumbnails }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
      {thumbnails.map((thumb) => (
        <ThumbnailCard key={thumb.id} thumbnail={thumb} />
      ))}
    </div>
  );
}
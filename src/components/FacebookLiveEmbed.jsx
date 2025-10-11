'use client';

export default function FacebookLiveEmbed({ embedUrl }) {
  if (!embedUrl) {
    return (
      <div className="text-center text-red-600 mt-6">
        ⚠️ No video URL provided.
      </div>
    );
  }

  return (
    <div className="flex justify-center my-6">
      <div className="relative w-full max-w-2xl pb-[56.25%]"> {/* 16:9 responsive ratio */}
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg"
          src={embedUrl}
          style={{ border: 'none', overflow: 'hidden' }}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen={true}
        ></iframe>
      </div>
    </div>
  );
}
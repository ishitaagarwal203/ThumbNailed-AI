import { motion } from "framer-motion";
import { Download } from "lucide-react";

export default function ThumbnailCard({ thumbnail }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl"
    >
      {/* Thumbnail Image */}
      {thumbnail.imagekit_url ? (
        <img
          src={thumbnail.imagekit_url}
          alt={thumbnail.style_name}
          className="w-full h-72 object-cover"
        />
      ) : (
        <div className="h-72 flex items-center justify-center text-slate-400 bg-slate-950">
          Generating Thumbnail...
        </div>
      )}

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold capitalize">
            {thumbnail.style_name.replaceAll("_", " ")}
          </h3>

          <span
            className={`text-sm font-medium ${
              thumbnail.status === "completed"
                ? "text-green-400"
                : thumbnail.status === "failed"
                ? "text-red-400"
                : "text-yellow-400"
            }`}
          >
            {thumbnail.status}
          </span>
        </div>

        {/* Error */}
        {thumbnail.error_message && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl">
            {thumbnail.error_message}
          </div>
        )}

        {/* Variants */}
        {thumbnail.variants && (
          <div className="grid grid-cols-3 gap-2">
            <a
              href={thumbnail.variants.youtube}
              target="_blank"
              rel="noreferrer"
              className="bg-slate-800 hover:bg-slate-700 transition py-2 rounded-xl text-center text-sm"
            >
              YouTube
            </a>

            <a
              href={thumbnail.variants.shorts}
              target="_blank"
              rel="noreferrer"
              className="bg-slate-800 hover:bg-slate-700 transition py-2 rounded-xl text-center text-sm"
            >
              Shorts
            </a>

            <a
              href={thumbnail.variants.tiktok}
              target="_blank"
              rel="noreferrer"
              className="bg-slate-800 hover:bg-slate-700 transition py-2 rounded-xl text-center text-sm"
            >
              TikTok
            </a>
          </div>
        )}

        {/* Download */}
        {thumbnail.imagekit_url && (
          <a
            href={thumbnail.imagekit_url}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-gradient-to-r from-pink-500 to-violet-500 py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold hover:scale-[1.02] transition"
          >
            <Download size={18} />
            Download
          </a>
        )}
      </div>
    </motion.div>
  );
}
import { useState } from "react";

import {
  uploadHeadshot,
  createJob,
  subscribeToJob,
} from "./api";

export default function App() {
  const [file, setFile] = useState(null);

  const [preview, setPreview] = useState("");

  const [prompt, setPrompt] = useState("");

  const [numThumbnails, setNumThumbnails] =
    useState(3);

  const [loading, setLoading] = useState(false);

  const [thumbnails, setThumbnails] = useState([]);

  const handleFile = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    setFile(selected);

    setPreview(URL.createObjectURL(selected));
  };

  const handleGenerate = async () => {
    try {
      if (!file) {
        alert("Upload headshot");

        return;
      }

      if (!prompt) {
        alert("Enter prompt");

        return;
      }

      setLoading(true);

      setThumbnails([]);

      // upload image
      const uploadRes = await uploadHeadshot(file);

      // create job
      const jobRes = await createJob({
        prompt,
        numThumbnails,
        headshotUrl: uploadRes.url,
      });

      // subscribe SSE
      subscribeToJob(jobRes.job_id, {
        onThumbnailReady: (data) => {
          setThumbnails((prev) => [...prev, data]);
        },

        onThumbnailFailed: (data) => {
          console.error(data);
        },

        onJobComplete: () => {
          setLoading(false);
        },

        onError: (err) => {
          console.error(err);

          setLoading(false);
        },
      });
    } catch (err) {
      console.error(err);

      alert("Something went wrong");

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-5xl font-black text-center mb-10 bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
          AI Thumbnail Generator
        </h1>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* Upload */}
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
            <h2 className="text-2xl font-bold mb-6">
              Upload Headshot
            </h2>

            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
            />

            {preview && (
              <img
                src={preview}
                className="mt-6 w-64 rounded-2xl"
              />
            )}
          </div>

          {/* Prompt */}
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
            <h2 className="text-2xl font-bold mb-6">
              Thumbnail Prompt
            </h2>

            <textarea
              value={prompt}
              onChange={(e) =>
                setPrompt(e.target.value)
              }
              rows={5}
              placeholder="Describe your thumbnail"
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4"
            />

            <div className="mt-6">
              <label className="block mb-2">
                Number of Thumbnails
              </label>

              <select
                value={numThumbnails}
                onChange={(e) =>
                  setNumThumbnails(Number(e.target.value))
                }
                className="bg-slate-950 border border-slate-700 px-4 py-3 rounded-xl"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-pink-500 to-violet-500 py-4 rounded-2xl font-bold"
            >
              {loading
                ? "Generating..."
                : "Generate"}
            </button>
          </div>
        </div>

        {/* Results */}
        {thumbnails.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {thumbnails.map((thumb) => (
              <div
                key={thumb.thumbnail_id}
                className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800"
              >
                <img
                  src={thumb.imagekit_url}
                  className="w-full h-72 object-cover"
                />

                <div className="p-5">
                  <h3 className="font-bold capitalize text-xl">
                    {thumb.style_name.replaceAll(
                      "_",
                      " "
                    )}
                  </h3>

                  <div className="grid grid-cols-3 gap-2 mt-5">
                    <a
                      href={thumb.variants.youtube}
                      target="_blank"
                      className="bg-slate-800 py-2 rounded-xl text-center text-sm"
                    >
                      YouTube
                    </a>

                    <a
                      href={thumb.variants.shorts}
                      target="_blank"
                      className="bg-slate-800 py-2 rounded-xl text-center text-sm"
                    >
                      Shorts
                    </a>

                    <a
                      href={thumb.variants.tiktok}
                      target="_blank"
                      className="bg-slate-800 py-2 rounded-xl text-center text-sm"
                    >
                      TikTok
                    </a>
                  </div>

                  <a
                    href={thumb.imagekit_url}
                    target="_blank"
                    className="block mt-5 bg-pink-500 text-center py-3 rounded-2xl font-bold"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
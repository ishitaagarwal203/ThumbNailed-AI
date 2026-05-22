import { Sparkles } from "lucide-react";

export default function PromptForm({
  prompt,
  setPrompt,
  num,
  setNum,
  generate,
  loading,
}) {
  return (
    <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Describe Your Thumbnail</h2>
        <p className="text-slate-400 mt-2">
          Example: Viral AI coding thumbnail with glowing effects
        </p>
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={5}
        placeholder="Enter thumbnail prompt"
        className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 outline-none focus:border-pink-500"
      />

      <div>
        <label className="block mb-2 font-semibold">
          Number of Thumbnails
        </label>

        <select
          value={num}
          onChange={(e) => setNum(Number(e.target.value))}
          className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>
      </div>

      <button
        disabled={loading}
        onClick={generate}
        className="w-full bg-gradient-to-r from-pink-500 to-violet-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.01] transition"
      >
        <Sparkles />
        {loading ? "Generating..." : "Generate Thumbnails"}
      </button>
    </div>
  );
}
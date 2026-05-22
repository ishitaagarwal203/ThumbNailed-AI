import { Upload } from "lucide-react";

export default function UploadBox({ image, setImage, preview, setPreview }) {
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="w-full border-2 border-dashed border-slate-700 rounded-3xl p-8 bg-slate-900 hover:border-pink-500 transition">
      <label className="cursor-pointer flex flex-col items-center justify-center gap-4">
        <Upload className="w-12 h-12 text-pink-500" />

        <div className="text-center">
          <h2 className="text-xl font-bold">Upload Headshot</h2>
          <p className="text-slate-400 text-sm mt-1">
            PNG, JPG or JPEG
          </p>
        </div>

        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />

        {preview && (
          <img
            src={preview}
            className="w-44 h-44 rounded-2xl object-cover border border-slate-700 mt-4"
          />
        )}
      </label>
    </div>
  );
}
import React, { useState, useRef } from "react";
import Header from "./Header";
import {
  Image as ImageIcon,
  Upload as UploadIcon,
  Wand2 as WandIcon,
  Trash2 as TrashIcon,
  Download as DownloadIcon,
} from "lucide-react";
import Footer from "./Footer";
import { useHomepageContent } from "../context/HomepageContentContext";
import { useHeroSection } from "../context/HeroSectionContext";
import { useContent } from "../context/ContentContext";

const MainPage = () => {
  const { html } = useHomepageContent();
  const { content } = useContent();
  const { title: heroTitle, description: heroDescription } = useHeroSection();
  const [images, setImages] = useState([]);
  const [orientation, setOrientation] = useState("horizontal");
  const [format, setFormat] = useState("jpg");
  const [error, setError] = useState("");
  const [mergedImage, setMergedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [conversionType, setConversionType] = useState("jpg-to-png");
  const [isDragging, setIsDragging] = useState(false);
  const previewRef = useRef(null);

  // Auto adjust format when user changes conversionType
  React.useEffect(() => {
    const map = {
      "jpg-to-png": "png",
      "jpg-to-jpeg": "jpeg",
      "jpg-to-pdf": "pdf",
      "png-to-jpg": "jpg",
    };
    setFormat(map[conversionType] || "jpg");
  }, [conversionType]);

  const getConversionHeading = () => {
    const lookup = {
      "jpg-to-png": "Merge JPG to PNG",
      "jpg-to-jpeg": "Merge JPG to JPEG",
      "jpg-to-pdf": "Merge JPG to PDF",
      "png-to-jpg": "Merge PNG to JPG",
    };
    return lookup[conversionType] || "Merge Images";
  };

  const acceptAndSetFiles = (files) => {
    if (!files.length) return;
    setError("");
    const imageUrls = Array.from(files).map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...imageUrls]);
  };

  const handleImageUpload = (e) => {
    acceptAndSetFiles(e.target.files || []);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const dt = e.dataTransfer;
    if (dt && dt.files) {
      acceptAndSetFiles(dt.files);
    }
  };

  const mergeImages = async () => {
    if (images.length < 2) {
      setError("You must upload at least two images to merge.");
      return;
    }

    setError("");
    setLoading(true);
    setMergedImage(null);

    const loadedImages = await Promise.all(
      images.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = src;
          })
      )
    );

    const maxWidth = Math.max(...loadedImages.map((img) => img.width));
    const maxHeight = Math.max(...loadedImages.map((img) => img.height));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (orientation === "horizontal") {
      canvas.width = maxWidth * loadedImages.length;
      canvas.height = maxHeight;
    } else {
      canvas.width = maxWidth;
      canvas.height = maxHeight * loadedImages.length;
    }

    loadedImages.forEach((img, index) => {
      if (orientation === "horizontal") {
        ctx.drawImage(img, index * maxWidth, 0, maxWidth, maxHeight);
      } else {
        ctx.drawImage(img, 0, index * maxHeight, maxWidth, maxHeight);
      }
    });

    const mimeType =
      format === "png"
        ? "image/png"
        : format === "jpeg" || format === "jpg"
          ? "image/jpeg"
          : "image/png";

    const mergedDataUrl = canvas.toDataURL(mimeType);
    setMergedImage(mergedDataUrl);
    setLoading(false);

    // Smooth scroll to preview
    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 400);
  };

  const downloadImage = async () => {
    if (!mergedImage) return;
    if (format === "pdf") {
      // Dynamically import jsPDF only when needed
      const { default: jsPDF } = await import("jspdf");

      // Create a single-page PDF that fits the image on the page while preserving aspect ratio
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const tempImg = new Image();
      tempImg.onload = () => {
        const imgWidth = tempImg.width;
        const imgHeight = tempImg.height;
        const imgAspect = imgWidth / imgHeight;
        const pageAspect = pageWidth / pageHeight;

        let renderWidth = pageWidth - 72; // 36pt margin each side
        let renderHeight = renderWidth / imgAspect;
        if (renderHeight > pageHeight - 72) {
          renderHeight = pageHeight - 72;
          renderWidth = renderHeight * imgAspect;
        }
        const offsetX = (pageWidth - renderWidth) / 2;
        const offsetY = (pageHeight - renderHeight) / 2;

        // Force image to JPEG inside PDF for better compatibility
        pdf.addImage(tempImg, "JPEG", offsetX, offsetY, renderWidth, renderHeight);
        pdf.save("merged_image.pdf");
      };
      tempImg.src = mergedImage;
      return;
    }

    const link = document.createElement("a");
    link.download = `merged_image.${format}`;
    link.href = mergedImage;
    link.click();
  };

  const clearAll = () => {
    setImages([]);
    setMergedImage(null);
    setError("");
  };

  const removeImageAt = (indexToRemove) => {
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 scroll-pt-24 md:scroll-pt-28 scroll-smooth">
      {/* Animated background accents */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-gradient-to-tr from-sky-300 to-indigo-300 blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-tr from-indigo-200 to-purple-300 blur-3xl animate-[pulse_10s_ease-in-out_infinite]" />
      </div>

      {/* Header */}
      <Header setConversionType={setConversionType} />
      {/* Spacer to offset fixed header */}
      <div aria-hidden="true" className="h-20 md:h-24" />

      {/* Inline styles for subtle fade/slide animations */}
      <style>{`
        @keyframes floaty { 0%{transform:translateY(0)} 50%{transform:translateY(-6px)} 100%{transform:translateY(0)} }
        .animate-floaty { animation: floaty 6s ease-in-out infinite; }
        @keyframes rise { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
        .fade-in { animation: rise .6s ease forwards; }
      `}</style>

      {/* Content */}
      <div id="workspace" className="relative z-10 pb-16 px-6">
        <div className="mx-auto max-w-6xl">
          {/* Hero */}
          <div className="mb-6 md:mb-8 grid gap-6 md:grid-cols-2 items-center">
            <div className="fade-in">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight theme-hero-text">
                {heroTitle}
              </h1>
              <p className="mt-3 text-gray-600 max-w-prose">
                {heroDescription}
              </p>
            </div>
            <div className="hidden md:block justify-self-end">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-300 to-indigo-300 blur-2xl opacity-50" />
                <div className="relative rounded-3xl bg-white/70 backdrop-blur-xl ring-1 ring-black/5 shadow-xl p-6 animate-floaty">
                  <div className="flex items-center gap-3 text-blue-700 font-semibold">
                    <WandIcon className="w-5 h-5" />
                    Smart merge canvas
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <div className="h-16 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 ring-1 ring-black/5" />
                    <div className="h-16 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 ring-1 ring-black/5" />
                    <div className="h-16 rounded-xl bg-gradient-to-br from-sky-100 to-sky-50 ring-1 ring-black/5" />
                    <div className="h-16 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 ring-1 ring-black/5" />
                    <div className="h-16 rounded-xl bg-gradient-to-br from-cyan-100 to-cyan-50 ring-1 ring-black/5" />
                    <div className="h-16 rounded-xl bg-gradient-to-br from-rose-100 to-rose-50 ring-1 ring-black/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Conversion Heading */}
          <h2 className="text-2xl md:text-3xl font-bold theme-hero-text mb-4 md:mb-6">
            {getConversionHeading()}
          </h2>

          {/* Workspace Card */}
          <div className="rounded-3xl bg-white/70 backdrop-blur-xl ring-1 ring-black/5 shadow-2xl p-6 md:p-8">
            {/* Upload Section */}
            <div
              className={`transition-all duration-300 border-2 border-dashed rounded-2xl p-8 md:p-10 flex flex-col justify-center items-center text-center h-72 relative cursor-pointer ${isDragging ? "border-indigo-400 bg-indigo-50/60" : "border-blue-300/70 bg-gradient-to-br from-white/80 to-white/60"
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="imageInput"
              />
              <label htmlFor="imageInput" className="flex flex-col items-center theme-icon">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-blue-200 blur-xl opacity-60" />
                  <ImageIcon size={62} className="relative mb-3 opacity-90" />
                </div>
                <span className="text-lg font-medium theme-main-text">Drag & Drop or Click to Upload</span>
                <span className="text-sm mt-1 flex items-center gap-2 theme-main-text">
                  <UploadIcon className="w-4 h-4 theme-icon" /> JPG, JPEG, PNG
                </span>
              </label>
              {error && <p className="text-red-500 mt-3">{error}</p>}
            </div>

            {/* Preview of Uploaded Images */}
            {images.length > 0 && (
              <div className="mt-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((src, i) => (
                    <div key={i} className="group relative">
                      <img
                        src={src}
                        alt={`Uploaded ${i}`}
                        className="w-full h-40 object-cover rounded-xl shadow-md ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-[1.02] group-hover:-rotate-[0.5deg]"
                      />
                      <button
                        onClick={() => removeImageAt(i)}
                        className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-white/80 backdrop-blur-md hover:bg-white text-rose-600 shadow ring-1 ring-black/5"
                        title="Remove"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Controls */}
                <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="relative">
                      <label className="block text-xs font-semibold theme-main-text mb-1">Layout</label>
                      <select
                        value={orientation}
                        onChange={(e) => setOrientation(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white/80 backdrop-blur ring-1 ring-gray-200 focus:ring-2 theme-outline outline-none theme-input-text"
                      >
                        <option value="horizontal">Horizontally</option>
                        <option value="vertical">Vertically</option>
                      </select>
                    </div>

                    <div className="relative">
                      <label className="block text-xs font-semibold theme-main-text mb-1">Output format</label>
                      <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white/80 backdrop-blur ring-1 ring-gray-200 focus:ring-2 theme-outline outline-none theme-input-text"
                      >
                        <option value="jpg">JPG</option>
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="pdf">PDF</option>
                      </select>
                    </div>

                    <div className="relative">
                      <label className="block text-xs font-semibold theme-main-text mb-1">Actions</label>
                      <div className="flex gap-2">
                        <button
                          onClick={mergeImages}
                          disabled={loading}
                          className="flex-1 inline-flex items-center justify-center gap-2 theme-button hover:opacity-95 text-white px-4 py-2.5 rounded-xl shadow-md disabled:opacity-60"
                        >
                          {loading ? (
                            <span className="animate-spin border-2 border-white/70 border-t-transparent rounded-full w-4 h-4" />
                          ) : (
                            <WandIcon className="w-4 h-4 theme-icon" />
                          )}
                          {loading ? "Merging..." : "Merge"}
                        </button>

                        <button
                          onClick={clearAll}
                          className="px-4 py-2.5 rounded-xl bg-white/80 hover:bg-white theme-main-text ring-1 ring-gray-200 shadow"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Merged Image Preview */}
            {mergedImage && (
              <div ref={previewRef} className="mt-10">
                <div className="mx-auto max-w-2xl">
                  <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white to-white/70 backdrop-blur ring-1 ring-black/5 shadow-xl">
                    <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-blue-50/70 to-transparent" />
                    <div className="p-4 sm:p-6">
                      <h3 className="text-base font-semibold text-blue-700 mb-3 flex items-center gap-2">
                        <WandIcon className="w-4 h-4" /> Merged Result
                      </h3>
                      <img
                        src={mergedImage}
                        alt="Merged Result"
                        className="rounded-2xl shadow-lg ring-1 ring-black/5 w-full"
                      />
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="text-xs text-gray-500">Format: {format.toUpperCase()}</div>
                        <button
                          onClick={downloadImage}
                          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl shadow"
                        >
                          <DownloadIcon className="w-4 h-4" /> Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Content Management Section */}
          {content ? (
            <div className="mt-16 md:mt-20 mb-8">
              <div className="prose prose-blue max-w-none bg-white/70 backdrop-blur ring-1 ring-black/5 rounded-3xl p-6 md:p-8">
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            </div>
          ) : null}

          {/* SEO Content Section */}
          {html ? (
            <div className="mt-16 md:mt-20 mb-8">
              <div className="prose prose-blue max-w-none bg-white/70 backdrop-blur ring-1 ring-black/5 rounded-3xl p-6 md:p-8">
                <div dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MainPage;

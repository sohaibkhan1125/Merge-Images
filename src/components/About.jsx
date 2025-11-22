import React from "react";
import { Shield, Zap, Image as ImageIcon, Sparkles } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

const About = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 scroll-pt-24 md:scroll-pt-28 scroll-smooth">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-tr from-sky-300 to-indigo-300 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-tr from-indigo-200 to-purple-300 blur-3xl" />
      </div>

      <Header setConversionType={() => {}} />
      <div aria-hidden="true" className="h-24 sm:h-24 md:h-28" />

      <div className="relative z-10 pt-4 md:pt-6 pb-16 px-6">
        <div className="mx-auto max-w-5xl">
          {/* Hero */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
              About MergeImages
            </h1>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              MergeImages is a fast, secure, and intuitive tool to combine multiple images into a single output. Convert between JPG, PNG, and PDF effortlessly—right in your browser.
            </p>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-black/5 shadow p-6">
              <div className="flex items-center gap-3 text-blue-700 font-semibold">
                <ImageIcon className="w-5 h-5" /> Flexible Formats
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Merge images horizontally or vertically and export to JPG, JPEG, PNG, or create a single-page PDF.
              </p>
            </div>
            <div className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-black/5 shadow p-6">
              <div className="flex items-center gap-3 text-blue-700 font-semibold">
                <Zap className="w-5 h-5" /> Instant & Private
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Everything runs in your browser—your images never leave your device, ensuring speed and privacy.
              </p>
            </div>
            <div className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-black/5 shadow p-6">
              <div className="flex items-center gap-3 text-blue-700 font-semibold">
                <Shield className="w-5 h-5" /> Safe by Design
              </div>
              <p className="mt-2 text-sm text-gray-600">
                No uploads, no storage. Merge locally and download the result securely.
              </p>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-12 rounded-3xl bg-white/80 backdrop-blur ring-1 ring-black/5 shadow p-6 md:p-8">
            <div className="flex items-center gap-2 text-blue-700 font-semibold">
              <Sparkles className="w-5 h-5" /> How it works
            </div>
            <ol className="mt-3 list-decimal pl-5 text-gray-700 space-y-2 text-sm md:text-base">
              <li>Choose a conversion type from the navigation.</li>
              <li>Upload two or more images via drag & drop or file picker.</li>
              <li>Select layout and output format, then click Merge.</li>
              <li>Preview the result and download as image or PDF.</li>
            </ol>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;

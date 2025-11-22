import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Privacy = () => {
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
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
            Privacy Policy
          </h1>
          <p className="mt-4 text-gray-600 text-center max-w-2xl mx-auto">
            Your privacy matters. This policy explains what data we (don’t) collect and how your information is handled when using MergeImages.
          </p>

          <div className="mt-10 rounded-3xl bg-white/80 backdrop-blur ring-1 ring-black/5 shadow p-6 md:p-8 space-y-6 text-gray-700">
            <section>
              <h2 className="text-lg font-semibold text-blue-800">1. No uploads to servers</h2>
              <p className="mt-2 text-sm md:text-base">
                MergeImages performs image merging and conversions entirely in your browser. Your files are processed locally and are <span className="font-semibold">never uploaded</span> to our servers.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-blue-800">2. Temporary local processing</h2>
              <p className="mt-2 text-sm md:text-base">
                Selected images are held in memory as temporary object URLs while you work. When you clear your session or refresh the page, those temporary references are discarded.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-blue-800">3. Cookies and analytics</h2>
              <p className="mt-2 text-sm md:text-base">
                We aim to keep tracking minimal. If analytics are enabled in the future, they will be limited to anonymized usage metrics (e.g., feature usage, performance) without collecting image content or personal files.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-blue-800">4. Data you provide</h2>
              <p className="mt-2 text-sm md:text-base">
                If you contact us by email, we’ll receive your email address and message solely to respond to your inquiry. We do not sell or share this information with third parties.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-blue-800">5. Third‑party libraries</h2>
              <p className="mt-2 text-sm md:text-base">
                MergeImages uses reputable open‑source libraries for UI and PDF generation. These libraries run in your browser and do not transmit your files elsewhere.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-blue-800">6. Security</h2>
              <p className="mt-2 text-sm md:text-base">
                Because processing happens locally, your files stay on your device. Always keep your browser up to date to benefit from the latest security patches.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-blue-800">7. Policy updates</h2>
              <p className="mt-2 text-sm md:text-base">
                We may occasionally update this policy to reflect improvements or legal requirements. Significant changes will be communicated via the website.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-blue-800">8. Contact</h2>
              <p className="mt-2 text-sm md:text-base">
                Questions about this policy? Contact us at <a className="text-blue-700 hover:text-blue-800 font-medium" href="mailto:Bestmergejpg@gmail.com">Bestmergejpg@gmail.com</a>.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;

import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Terms = () => {
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
            Terms & Conditions
          </h1>
          <p className="mt-4 text-gray-600 text-center max-w-2xl mx-auto">
            Please read these terms carefully. By using MergeImages, you agree to the following conditions.
          </p>

          <div className="mt-10 rounded-3xl bg-white/80 backdrop-blur ring-1 ring-black/5 shadow p-6 md:p-8 space-y-6 text-gray-700">
            <section>
              <h2 className="text-lg font-semibold text-blue-800">1. Service description</h2>
              <p className="mt-2 text-sm md:text-base">
                MergeImages is a browser-based tool that lets you merge images and export to common formats including JPG, PNG, and PDF. Processing occurs locally on your device.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-blue-800">2. Acceptable use</h2>
              <p className="mt-2 text-sm md:text-base">
                You agree not to use the service for unlawful purposes or to infringe on the rights of others. You are responsible for the content you process with the tool.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-blue-800">3. Intellectual property</h2>
              <p className="mt-2 text-sm md:text-base">
                The MergeImages website design, branding, and associated code are protected. You retain ownership of your files and outputs produced by the tool.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-blue-800">4. No warranties</h2>
              <p className="mt-2 text-sm md:text-base">
                The service is provided on an "as is" and "as available" basis without warranties of any kind. We do not guarantee error-free or uninterrupted operation.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-blue-800">5. Limitation of liability</h2>
              <p className="mt-2 text-sm md:text-base">
                To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-blue-800">6. Changes to the terms</h2>
              <p className="mt-2 text-sm md:text-base">
                We may update these terms from time to time. Material changes will be posted on the site. Continued use after changes constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-blue-800">7. Contact</h2>
              <p className="mt-2 text-sm md:text-base">
                For questions about these terms, contact us at <a href="mailto:Bestmergejpg@gmail.com" className="text-blue-700 hover:text-blue-800 font-medium">Bestmergejpg@gmail.com</a>.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;

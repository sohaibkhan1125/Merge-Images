import React from "react";
import { Mail, Phone, MessageSquareText } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

const Contact = () => {
  const supportEmail = "Bestmergejpg@gmail.com";

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
          {/* Title */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
              Contact Us
            </h1>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Questions, feedback, or suggestions? We’d love to hear from you.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-black/5 shadow p-6">
              <div className="flex items-center gap-3 text-blue-700 font-semibold">
                <Mail className="w-5 h-5" /> Email
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Reach us anytime at:
              </p>
              <a
                href={`mailto:${supportEmail}`}
                className="mt-3 inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 font-medium"
              >
                <Mail className="w-4 h-4" /> {supportEmail}
              </a>
            </div>

            <div className="rounded-2xl bg-white/80 backdrop-blur ring-1 ring-black/5 shadow p-6">
              <div className="flex items-center gap-3 text-blue-700 font-semibold">
                <MessageSquareText className="w-5 h-5" /> Quick message
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Send us a quick note. We usually reply within 1–2 business days.
              </p>
              <form className="mt-4 space-y-3" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full p-2.5 rounded-xl bg-white/80 backdrop-blur ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full p-2.5 rounded-xl bg-white/80 backdrop-blur ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
                <textarea
                  rows="4"
                  placeholder="Message"
                  className="w-full p-2.5 rounded-xl bg-white/80 backdrop-blur ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl shadow"
                >
                  Send message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;

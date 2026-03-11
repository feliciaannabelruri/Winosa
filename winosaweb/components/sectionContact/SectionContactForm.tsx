"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FadeUp from "@/components/animation/FadeUp";
import { Phone, MapPin, MessageCircle } from "lucide-react";
import { useTranslate } from "@/lib/useTranslate";
import { SiteSettings } from "@/types/settings";

async function fetchSettings(): Promise<SiteSettings | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export default function SectionContactForm() {
  const { t } = useTranslate();

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [form, setForm] = useState({ name: "", email: "", interest: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError]     = useState("");

  useEffect(() => {
    fetchSettings().then(setSettings);
  }, []);

  // Fallbacks keep the page readable even if settings haven't loaded yet
  const phone   = settings?.sitePhone      || "(235) 325-1351";
  const address = settings?.siteAddress    || "Bandar Lampung, Indonesia";
  const waNum   = settings?.socialWhatsapp || "";
  const waUrl   = waNum ? `https://wa.me/${waNum}` : "#";

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.name.trim())    return t("contact", "errorName");
    if (!form.email.trim())   return t("contact", "errorEmail");
    if (!form.message.trim()) return t("contact", "errorMessage");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return t("contact", "errorEmailInvalid");
    return "";
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSuccess(""); setError("");
    const err = validate();
    if (err) { setError(err); return; }
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error");
      setSuccess(t("contact", "success"));
      setForm({ name: "", email: "", interest: "", phone: "", message: "" });
    } catch (err: any) {
      setError(err.message || t("contact", "errorSubmit"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <FadeUp>
      <section className="w-full py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">

          <motion.h2
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-5xl font-bold text-black mb-16"
          >
            {t("contact", "title")}
          </motion.h2>

          <div className="grid lg:grid-cols-2 gap-16">

            {/* LEFT — Form */}
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-black mb-4">{t("contact", "sendMessage")}</h3>
              <p className="text-black/70 mb-10">{t("contact", "subtitle")}</p>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div>
                    <label className="text-sm text-black/60">{t("contact", "name")}</label>
                    <input name="name" value={form.name} onChange={handleChange}
                      className="w-full border-b border-black/40 focus:border-black outline-none py-2 bg-transparent text-black" />
                  </div>
                  <div>
                    <label className="text-sm text-black/60">{t("contact", "email")}</label>
                    <input name="email" value={form.email} onChange={handleChange}
                      className="w-full border-b border-black/40 focus:border-black outline-none py-2 bg-transparent text-black" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-black/60">{t("contact", "message")}</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={4}
                    className="w-full border-b border-black/40 focus:border-black outline-none py-2 bg-transparent text-black" />
                </div>

                {success && <p className="text-green-600 text-sm">{success}</p>}
                {error   && <p className="text-red-600 text-sm">{error}</p>}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-black text-black font-medium transition hover:bg-black/10 disabled:opacity-50"
                  >
                    {loading ? t("contact", "sending") : t("contact", "submit")}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* RIGHT — Contact info from settings */}
            <motion.div className="lg:border-l lg:border-black/20 lg:pl-16 space-y-12 text-black">

              {/* Call us */}
              <div>
                <h4 className="font-semibold mb-3">{t("contact", "call")}</h4>
                <div className="flex gap-3 text-black/70">
                  <Phone size={18} />
                  <span>{phone}</span>
                </div>
              </div>

              {/* Visit us */}
              <div>
                <h4 className="font-semibold mb-3">{t("contact", "visit")}</h4>
                <div className="flex gap-3 text-black/70">
                  <MapPin size={18} />
                  <span>{address}</span>
                </div>
              </div>

              {/* Live Chat via WhatsApp */}
              <div>
                <h4 className="font-semibold mb-3">{t("contact", "liveChat")}</h4>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 text-black/70 hover:text-black transition"
                >
                  <MessageCircle size={18} />
                  <span>WhatsApp{waNum ? ` +${waNum}` : ""}</span>
                </a>
              </div>

            </motion.div>
          </div>

        </div>
      </section>
    </FadeUp>
  );
}
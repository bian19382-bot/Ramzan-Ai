import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MessageCircle, Send, CheckCircle2, Copy, Check, Radio, Terminal } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SiteSettings, Service } from '../../types/portfolio';
import { dataProvider } from '../../data/dataProvider';
import { useLanguage } from '../i18n/LanguageContext';
import { cinematicFadeUp, safeViewport } from '../../lib/cinematicMotion';

interface ContactSectionProps {
  settings: SiteSettings;
  services: Service[];
  preselectedService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  preselectedService = '',
}) => {
  const { language } = useLanguage();
  const isRoman = language === 'ur-roman';

  const defaultRequestType = 'Simple Website / Landing Page';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: preselectedService || defaultRequestType,
    budget: '',
    timeline: '',
    message: '',
    consent: true,
    honeypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  React.useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, service: preselectedService }));
    }
  }, [preselectedService]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(settings.contact_email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = isRoman ? 'Baraye meharbani apna naam darj karein' : 'Please provide your name';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      errs.email = isRoman ? 'Durust email address darj karein' : 'Please provide a valid email address';
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      errs.message = isRoman ? 'Kam az kam 10 characters mein tafseel likhein' : 'Please describe your project (at least 10 characters)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (formData.honeypot) {
      setSubmitted(true);
      return;
    }

    if (!validate()) return;

    setSubmitting(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          service: formData.service,
          budget: formData.budget,
          timeline: formData.timeline,
          message: formData.message,
          honeypot: formData.honeypot,
        }),
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result?.ok) {
        dataProvider.submitInquiry({
          name: formData.name,
          email: formData.email,
          service: formData.service,
          budget: formData.budget,
          timeline: formData.timeline,
          message: formData.message,
          consent: formData.consent,
        });

        setSubmitted(true);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } else {
        const errorMsg =
          result?.error ||
          (response.status === 429
            ? 'Rate limit reached. Thori der baad try karein.'
            : isRoman
            ? `Transmission error (${response.status}). Baraye meharbani direct email ya WhatsApp karein.`
            : `Transmission error (${response.status}). Please contact directly via email or WhatsApp.`);
        setSubmitError(errorMsg);
      }
    } catch {
      setSubmitError(
        isRoman
          ? 'Network error. Server se raabta nahi ho saka. Baraye meharbani WhatsApp ya direct email use karein.'
          : 'Network error. Could not connect to the server. Please reach out via WhatsApp or email directly.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappCleanNumber = settings.whatsapp_number.replace(/\D/g, '').replace(/^0/, '');
  const whatsappUrl = `https://wa.me/92${whatsappCleanNumber}`;

  return (
    <section id="contact" className="py-28 px-5 sm:px-8 lg:px-12 bg-[#070709] border-t border-white/5 relative overflow-hidden">
      {/* Background Signal Waves */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] flex items-center justify-center pointer-events-none opacity-40">
        <div className="signal-wave w-64 h-64" />
        <div className="signal-wave w-96 h-96 [animation-delay:1.2s]" />
        <div className="signal-wave w-[520px] h-[520px] [animation-delay:2.4s]" />
      </div>

      <div className="max-w-[1320px] w-full mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          variants={cinematicFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={safeViewport}
          className="mb-16 border-b border-white/5 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400 uppercase tracking-widest mb-3">
              <Terminal className="w-3.5 h-3.5" />
              <span>CHAPTER 04 // TRANSMISSION CHANNELS</span>
            </div>
            <h2 className="font-cinematic text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight uppercase glitch-hover transition-all">
              SEND THE SIGNAL
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1AA] font-sans mt-2 max-w-xl">
              {isRoman
                ? 'Koi project ya collaborative opportunity hai? Aayein mil kar kuch behtareen banayein.'
                : "Have a project or opportunity? Let's create something meaningful."}
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-[#71717A]">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>TRANSMISSION: READY</span>
          </div>
        </motion.div>

        {/* Content Grid: Left Contact Channels, Right Direct Transmission Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column (5 cols): Direct Channels & Availability */}
          <motion.div
            variants={cinematicFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={safeViewport}
            className="lg:col-span-5 space-y-6"
          >
            <div className="space-y-4">
              {/* Email Transmission Channel */}
              <div className="p-6 rounded-2xl bg-[#0D0F14] border border-white/10 hover:border-cyan-400/40 transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#71717A] uppercase block">
                      DIRECT TRANSMISSION
                    </span>
                    <a
                      href={`mailto:${settings.contact_email}`}
                      className="text-sm font-semibold text-white hover:text-cyan-400 hover:underline transition-colors font-mono"
                    >
                      {settings.contact_email}
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-xs text-[#CBD5E1] transition cursor-pointer flex items-center gap-1.5 font-mono"
                  title="Copy email address"
                  aria-label="Copy email address"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* WhatsApp Direct Transmission Channel */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 rounded-2xl bg-[#0D0F14] border border-white/10 hover:border-emerald-500/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#71717A] uppercase block">
                      REAL-TIME DISPATCH
                    </span>
                    <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition font-mono">
                      {settings.whatsapp_number}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono text-emerald-400 group-hover:translate-x-1 transition font-semibold">
                  {isRoman ? 'Chat Karein →' : 'Chat Now →'}
                </span>
              </a>
            </div>

            {/* Availability Protocol Card */}
            <div className="p-5 rounded-2xl bg-[#0D0F14] border border-white/10 text-xs text-[#A1A1AA] flex items-start gap-3 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1 shrink-0 animate-pulse" />
              <div className="space-y-1">
                <span className="text-white font-semibold uppercase text-[11px] block">
                  AVAILABILITY PROTOCOL
                </span>
                <p className="leading-relaxed font-sans text-xs text-[#A1A1AA]">
                  {isRoman
                    ? 'Main un munasib opportunities aur client projects ke liye available hoon jo meri current abilities ke mutabiq hon.'
                    : 'Open to suitable client and collaborative opportunities where requirements align with current technical skills.'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column (7 cols): Transmission Terminal */}
          <motion.div
            variants={cinematicFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={safeViewport}
            className="lg:col-span-7"
          >
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0D0F14] border border-white/10 shadow-2xl">
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10 font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-[11px] text-cyan-400 font-semibold tracking-wider">
                    TRANSMISSION // TERMINAL
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SIGNAL READY</span>
                </span>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-white">
                    {isRoman ? 'Signal Receive Ho Gaya!' : 'Signal Received Successfully'}
                  </h3>
                  <p className="text-sm text-[#A1A1AA] max-w-md mx-auto leading-relaxed">
                    {isRoman
                      ? 'Rabta karne ka shukriya. Aap ka message database me transmit ho chuka hai. Main jald jawab doonga.'
                      : 'Thanks for reaching out. Your transmission has been recorded. I will review and reply promptly.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        service: defaultRequestType,
                        budget: '',
                        timeline: '',
                        message: '',
                        consent: true,
                        honeypot: '',
                      });
                    }}
                    className="px-6 py-2.5 rounded-full bg-white/[0.05] border border-white/15 text-xs font-semibold text-white hover:border-cyan-400 hover:bg-cyan-500/10 transition cursor-pointer font-mono"
                  >
                    {isRoman ? 'Naya Message Bhejein' : 'Send Another Transmission'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs" noValidate>
                  {/* Honeypot Bot Trap */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="honeypot"
                      tabIndex={-1}
                      value={formData.honeypot}
                      onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                        NAME // IDENTIFIER *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ali Khan"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border text-xs text-white focus:outline-none transition font-sans ${
                          errors.name ? 'border-red-500' : 'border-white/10 focus:border-cyan-400'
                        }`}
                      />
                      {errors.name && <span className="text-[10px] text-red-400 mt-1 block">{errors.name}</span>}
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                        EMAIL // DESTINATION *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. ali@example.com"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border text-xs text-white focus:outline-none transition font-sans ${
                          errors.email ? 'border-red-500' : 'border-white/10 focus:border-cyan-400'
                        }`}
                      />
                      {errors.email && <span className="text-[10px] text-red-400 mt-1 block">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                        DISPATCH CATEGORY
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0C12] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 transition cursor-pointer font-sans"
                      >
                        <option value="Simple Website / Landing Page">Simple Website / Landing Page</option>
                        <option value="AI-Assisted Website Prototype">AI-Assisted Website Prototype</option>
                        <option value="Small Website Updates">Small Website Updates</option>
                        <option value="Other Website Idea">Other Website Idea</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                        BUDGET BRACKET
                      </label>
                      <input
                        type="text"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        placeholder="e.g. Flexible / Open"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 transition font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                      TRANSMISSION PAYLOAD (MESSAGE) *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={
                        isRoman
                          ? 'Apne project ki requirements aur idea yahan darj karein...'
                          : 'Describe your website goals, requirements, or idea...'
                      }
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border text-xs text-white focus:outline-none transition leading-relaxed font-sans ${
                        errors.message ? 'border-red-500' : 'border-white/10 focus:border-cyan-400'
                      }`}
                    />
                    {errors.message && <span className="text-[10px] text-red-400 mt-1 block">{errors.message}</span>}
                  </div>

                  {submitError && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                      {submitError}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-cyan-300 active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md font-mono"
                    >
                      {submitting ? (
                        <span>TRANSMITTING SIGNAL...</span>
                      ) : (
                        <>
                          <span>DISPATCH TRANSMISSION</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

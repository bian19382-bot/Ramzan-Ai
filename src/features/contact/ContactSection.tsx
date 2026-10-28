import React, { useState } from 'react';
import { Mail, MessageCircle, Send, CheckCircle2, Copy, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SiteSettings, Service } from '../../types/portfolio';
import { dataProvider } from '../../data/dataProvider';
import { useLanguage } from '../i18n/LanguageContext';

interface ContactSectionProps {
  settings: SiteSettings;
  services: Service[];
  preselectedService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  services,
  preselectedService = '',
}) => {
  const { language, t } = useLanguage();
  const isRoman = language === 'ur-roman';

  const defaultRequestType = isRoman ? 'Simple Website / Landing Page' : 'Simple Website / Landing Page';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.honeypot) {
      setSubmitted(true);
      return;
    }

    if (!validate()) return;

    setSubmitting(true);

    setTimeout(() => {
      const res = dataProvider.submitInquiry({
        name: formData.name,
        email: formData.email,
        service: formData.service,
        budget: formData.budget,
        timeline: formData.timeline,
        message: formData.message,
        consent: formData.consent,
      });

      setSubmitting(false);
      if (res.ok) {
        setSubmitted(true);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    }, 500);
  };

  const whatsappCleanNumber = settings.whatsapp_number.replace(/\D/g, '').replace(/^0/, '');
  const whatsappUrl = `https://wa.me/92${whatsappCleanNumber}`;

  return (
    <section id="contact" className="py-24 px-5 sm:px-8 lg:px-12 border-t border-[var(--border)] relative bg-[var(--surface)]/20">
      <div className="max-w-[1200px] w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column (5 cols): Direct channels & Approach */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-2 font-mono">
                {t('contactEyebrow')}
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-[var(--text)] tracking-tight mb-4">
                {t('contactTitle')}
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                {t('contactSub')}
              </p>
            </div>

            {/* Direct Contact Channels */}
            <div className="space-y-3.5">
              {/* Email */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">
                      {isRoman ? 'Email Raabta' : 'Direct Email'}
                    </span>
                    <a
                      href={`mailto:${settings.contact_email}`}
                      className="text-xs sm:text-sm font-semibold text-[var(--text)] hover:text-cyan-400 hover:underline"
                    >
                      {settings.contact_email}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-3 py-1.5 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--border)] text-xs text-[var(--text)] transition flex items-center gap-1.5 cursor-pointer"
                  title="Copy email address"
                  aria-label="Copy email address"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 sm:p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-emerald-500/40 flex items-center justify-between shadow-sm transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">
                      {isRoman ? 'WhatsApp Chat' : 'WhatsApp'}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-[var(--text)] group-hover:text-emerald-400 transition">
                      {settings.whatsapp_number}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 group-hover:translate-x-0.5 transition">
                  {isRoman ? 'Chat Karein →' : 'Chat Now →'}
                </span>
              </a>
            </div>

            {/* Availability Note */}
            <div className="p-4 rounded-xl bg-[var(--surface-2)]/50 border border-[var(--border)] text-xs text-[var(--text-muted)] flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1 shrink-0 animate-pulse" />
              <span>
                {isRoman
                  ? 'Main un munasib opportunities ke liye available hoon jo meri current abilities ke mutabiq hon.'
                  : 'Open to suitable opportunities with individuals and businesses where requirements fit my current abilities.'}
              </span>
            </div>
          </div>

          {/* Right Column (7 cols): Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-[24px] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)]">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-[var(--text)]">
                    {isRoman ? 'Shukriya!' : 'Inquiry Submitted'}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
                    {isRoman
                      ? 'Rabta karne ka shukriya. Aap ka message kamyabi se submit ho gaya hai.'
                      : 'Thanks for reaching out. Your message has been submitted successfully.'}
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
                    className="px-6 py-2.5 rounded-full bg-[var(--surface-2)] hover:bg-[var(--border)] text-xs font-semibold text-[var(--text)] transition cursor-pointer"
                  >
                    {isRoman ? 'Naya Message Bhejein' : 'Send Another Message'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Bot trap */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="website_url"
                      tabIndex={-1}
                      value={formData.honeypot}
                      onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1 font-mono">
                        {t('nameLabel')}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name ?? ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ali Khan"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border text-xs sm:text-sm text-[var(--text)] focus:outline-none transition ${
                          errors.name ? 'border-red-500' : 'border-[var(--border)] focus:border-cyan-500'
                        }`}
                      />
                      {errors.name && <span className="text-[11px] text-red-400 mt-1 block">{errors.name}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1 font-mono">
                        {t('emailLabel')}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email ?? ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. ali@example.com"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border text-xs sm:text-sm text-[var(--text)] focus:outline-none transition ${
                          errors.email ? 'border-red-500' : 'border-[var(--border)] focus:border-cyan-500'
                        }`}
                      />
                      {errors.email && <span className="text-[11px] text-red-400 mt-1 block">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1 font-mono">
                        {t('serviceLabel')}
                      </label>
                      <select
                        value={formData.service ?? ''}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] focus:outline-none focus:border-cyan-500 cursor-pointer"
                      >
                        <option value="Simple Website / Landing Page">Simple Website / Landing Page</option>
                        <option value="AI-Assisted Website Prototype">AI-Assisted Website Prototype</option>
                        <option value="Small Website Updates">Small Website Updates</option>
                        <option value="Other Website Idea">Other Website Idea</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1 font-mono">
                        {t('budgetLabel')}
                      </label>
                      <input
                        type="text"
                        value={formData.budget ?? ''}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        placeholder="e.g. Flexible / Open"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1 font-mono">
                      {t('messageLabel')}
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message ?? ''}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={
                        isRoman
                          ? 'Apne project ka maqsad aur requirements yahan likhein...'
                          : 'Describe your website idea, requirements, and any specific questions...'
                      }
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border text-xs sm:text-sm text-[var(--text)] focus:outline-none transition leading-relaxed ${
                        errors.message ? 'border-red-500' : 'border-[var(--border)] focus:border-cyan-500'
                      }`}
                    />
                    {errors.message && <span className="text-[11px] text-red-400 mt-1 block">{errors.message}</span>}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <span>{t('contactSending')}</span>
                      ) : (
                        <>
                          <span>{t('contactSubmit')}</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

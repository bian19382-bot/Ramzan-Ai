import React, { useState } from 'react';
import { Layout, Sparkles, Zap, CheckCircle2, ArrowRight, ChevronDown, HelpCircle, Check, Compass } from 'lucide-react';
import { Service, FAQ } from '../../types/portfolio';
import { useLanguage } from '../i18n/LanguageContext';

interface ServicesSectionProps {
  services: Service[];
  faqs: FAQ[];
  pricingEnabled: boolean;
  onSelectServiceForContact: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  faqs,
  onSelectServiceForContact,
}) => {
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id || null);
  const { language, t } = useLanguage();
  const isRoman = language === 'ur-roman';

  const getServiceIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('prototype')) return <Sparkles className="w-5 h-5 text-cyan-400" />;
    if (n.includes('update')) return <Zap className="w-5 h-5 text-amber-400" />;
    return <Layout className="w-5 h-5 text-indigo-400" />;
  };

  const getServiceCta = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('prototype')) {
      return isRoman ? 'Prototype Par Baat Karein' : 'Discuss a Prototype';
    }
    if (n.includes('update')) {
      return isRoman ? 'Apni Update Batayein' : 'Describe Your Update';
    }
    return isRoman ? 'Website Idea Par Baat Karein' : 'Discuss a Website Idea';
  };

  const processSteps = isRoman
    ? [
        {
          step: '01',
          title: 'Idea Samajhna',
          desc: 'Goal, audience aur requirements par baat karna.',
        },
        {
          step: '02',
          title: 'Structure Plan Karna',
          desc: 'Website ko pages aur clear sections mein divide karna.',
        },
        {
          step: '03',
          title: 'Soch Samajh Kar Build Karna',
          desc: 'Munasib tools aur AI-assisted workflow use karna.',
        },
        {
          step: '04',
          title: 'Review Aur Testing',
          desc: 'Navigation, links, layout, forms aur responsive behaviour check karna.',
        },
        {
          step: '05',
          title: 'Clear Communication',
          desc: 'Completed kaam, baqi tasks aur known limitations batana.',
        },
      ]
    : [
        {
          step: '01',
          title: 'Understand the Idea',
          desc: 'Discuss the goal, audience, and key requirements.',
        },
        {
          step: '02',
          title: 'Plan the Structure',
          desc: 'Break the website into pages and clear sections.',
        },
        {
          step: '03',
          title: 'Build with Care',
          desc: 'Use appropriate tools and AI-assisted workflows where useful.',
        },
        {
          step: '04',
          title: 'Review and Test',
          desc: 'Check navigation, links, layout, forms, and responsive behaviour.',
        },
        {
          step: '05',
          title: 'Communicate Clearly',
          desc: 'Explain what is completed, what needs follow-up, and any known limitations.',
        },
      ];

  const visibleServices = services.filter((s) => s.visible);

  return (
    <section id="services" className="py-24 px-5 sm:px-8 lg:px-12 border-t border-[var(--border)] relative bg-[var(--surface)]/20">
      <div className="max-w-[1200px] w-full mx-auto">
        {/* Eyebrow & Title */}
        <div className="mb-14 text-left">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2 block font-mono">
            {t('servicesEyebrow')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-[var(--text)] tracking-tight">
            {t('servicesTitle')}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-2xl mt-2 leading-relaxed">
            {t('servicesSub')}
          </p>
        </div>

        {/* 5-Step Process: My Approach / Mera Tareeqa */}
        <div id="approach" className="mb-16 p-6 sm:p-8 rounded-3xl bg-[var(--surface-2)]/50 border border-[var(--border)]">
          <p className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-6 font-semibold flex items-center gap-2">
            <Compass className="w-4 h-4" />
            <span>{isRoman ? 'Mera Tareeqa (My Approach)' : 'My Approach — 5-Step Workflow'}</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
            {processSteps.map((p, idx) => (
              <div key={idx} className="relative flex flex-col">
                <span className="text-2xl font-display font-extrabold text-cyan-500/40 mb-1">
                  {p.step}
                </span>
                <h3 className="text-sm font-bold font-display text-[var(--text)] mb-1">
                  {p.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {visibleServices.map((service) => (
            <div
              key={service.id}
              className="p-6 sm:p-7 rounded-[22px] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)] hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-[var(--surface-2)] flex items-center justify-center border border-[var(--border)] mb-4">
                  {getServiceIcon(service.name)}
                </div>

                <h3 className="text-lg font-bold font-display text-[var(--text)] mb-2">
                  {service.name}
                </h3>

                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-5">
                  {service.description}
                </p>

                {service.deliverables && service.deliverables.length > 0 && (
                  <div className="space-y-2 mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                      {isRoman ? 'Kaam Mein Shamil:' : 'Key Deliverables:'}
                    </span>
                    <ul className="space-y-1.5 text-xs text-[var(--text-muted)]">
                      {service.deliverables.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[var(--border)]/60">
                <button
                  type="button"
                  onClick={() => onSelectServiceForContact(service.name)}
                  className="w-full py-2.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--accent)] hover:text-white text-[var(--text)] text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{getServiceCta(service.name)}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQs */}
        {faqs.length > 0 && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2 mb-8">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                {isRoman ? 'Aam Sawalat' : 'Got Questions?'}
              </span>
              <h3 className="text-2xl font-bold font-display text-[var(--text)]">
                {isRoman ? 'Aksar Poochhe Jane Wale Sawalat' : 'Frequently Asked Questions'}
              </h3>
            </div>

            <div className="space-y-3">
              {faqs
                .filter((f) => f.visible)
                .map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden transition"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--surface-2)]/40 transition"
                      >
                        <span className="text-sm font-semibold text-[var(--text)] font-display">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-cyan-400 shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed border-t border-[var(--border)]/40">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

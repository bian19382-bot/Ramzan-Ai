import React, { useState } from 'react';
import { Layout, Sparkles, Zap, CheckCircle2, ArrowRight, ChevronDown, HelpCircle, Check, Compass, Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import { Service, FAQ } from '../../types/portfolio';
import { useLanguage } from '../i18n/LanguageContext';
import { FuturisticSpotlightCard } from '../../components/ui/FuturisticSpotlightCard';

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
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 text-left"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2 block font-mono">
            {t('servicesEyebrow')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-[var(--text)] tracking-tight">
            {t('servicesTitle')}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-2xl mt-2 leading-relaxed">
            {t('servicesSub')}
          </p>
        </motion.div>

        {/* 5-Step Process: Futuristic Pipeline Workflow */}
        <motion.div
          id="approach"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 p-6 sm:p-8 rounded-3xl bg-[var(--surface)]/90 dark:bg-[#0b0e14]/90 border border-[var(--border)] dark:border-cyan-500/25 relative overflow-hidden shadow-sm dark:shadow-[0_0_40px_rgba(6,182,212,0.1)] transition-colors duration-200"
        >
          {/* Subtle Cyber Grid Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border)]">
            <p className="text-xs font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>{isRoman ? 'Mera Tareeqa // 5-Step Workflow Pipeline' : 'System Approach // 5-Step Workflow Pipeline'}</span>
            </p>
            <span className="hidden sm:inline-flex text-[10px] font-mono text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-semibold">
              ● REAL-TIME EXECUTION
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
            {processSteps.map((p, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.1 }}
                className="relative flex flex-col p-4 rounded-2xl bg-[var(--surface-2)]/70 dark:bg-[var(--surface)]/60 border border-[var(--border)] group hover:border-cyan-500/60 dark:hover:border-cyan-400/50 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/15 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-mono font-extrabold text-cyan-600 dark:text-cyan-400/80 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                    {p.step}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-cyan-500/40 dark:bg-cyan-400/30 group-hover:bg-cyan-500 dark:group-hover:bg-cyan-400 group-hover:shadow-[0_0_8px_#22d3ee] transition-all" />
                </div>
                <h3 className="text-sm font-bold font-display text-[var(--text)] mb-1.5 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed font-medium">
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {visibleServices.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <FuturisticSpotlightCard
                glowColor={idx === 1 ? 'purple' : idx === 2 ? 'emerald' : 'cyan'}
                className="p-6 sm:p-7 flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[var(--surface-2)] flex items-center justify-center border border-[var(--border)] group-hover:border-cyan-400/50 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all">
                      {getServiceIcon(service.name)}
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                      MODULE // 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-display text-[var(--text)] mb-2 group-hover:text-cyan-300 transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {service.deliverables && service.deliverables.length > 0 && (
                    <div className="space-y-2 mb-6 p-3 rounded-xl bg-[var(--surface-2)]/50 border border-[var(--border)]/70">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
                        {isRoman ? 'Kaam Mein Shamil // Deliverables:' : 'Key Deliverables // Scope:'}
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
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500/20 hover:from-cyan-500 to-blue-600/20 hover:to-blue-600 border border-cyan-400/40 hover:border-cyan-300 hover:text-white text-cyan-300 text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-98"
                  >
                    <span>{getServiceCta(service.name)}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </FuturisticSpotlightCard>
            </motion.div>
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

import React, { useState } from 'react';
import { Layout, Sparkles, Zap, CheckCircle2, ArrowRight, ChevronDown, Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import { Service, FAQ } from '../../types/portfolio';
import { useLanguage } from '../i18n/LanguageContext';
import { cinematicFadeUp, safeViewport } from '../../lib/cinematicMotion';

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
    if (n.includes('prototype')) return <Sparkles className="w-5 h-5 text-[#38bdf8]" />;
    if (n.includes('update')) return <Zap className="w-5 h-5 text-[#818cf8]" />;
    return <Layout className="w-5 h-5 text-[#38bdf8]" />;
  };

  const getServiceCta = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('prototype')) {
      return isRoman ? 'PROTOTYPE PAR BAAT KAREIN' : 'DISCUSS A PROTOTYPE';
    }
    if (n.includes('update')) {
      return isRoman ? 'APNI UPDATE BATAYEIN' : 'DESCRIBE YOUR UPDATE';
    }
    return isRoman ? 'WEBSITE IDEA PAR BAAT KAREIN' : 'DISCUSS A WEBSITE IDEA';
  };

  const processSteps = isRoman
    ? [
        {
          step: '01',
          code: 'PHASE // RECON',
          title: 'Idea Samajhna',
          desc: 'Goal, audience aur core requirements par tafseeli baat cheet.',
        },
        {
          step: '02',
          code: 'PHASE // ARCHITECTURE',
          title: 'Structure Plan Karna',
          desc: 'Website ko modern pages aur telemetry sections mein organize karna.',
        },
        {
          step: '03',
          code: 'PHASE // SYNTHESIS',
          title: 'Careful Building',
          desc: 'Modern AI-assisted workflows aur clean TypeScript/React code.',
        },
        {
          step: '04',
          code: 'PHASE // VALIDATION',
          title: 'Review Aur Testing',
          desc: 'Cross-browser check, responsiveness aur forms validation.',
        },
        {
          step: '05',
          code: 'PHASE // HANDOFF',
          title: 'Clear Communication',
          desc: 'Deployment, live status aur documentation share karna.',
        },
      ]
    : [
        {
          step: '01',
          code: 'PHASE // RECON',
          title: 'Understand the Idea',
          desc: 'Clarify objectives, target audience, and key technical scope.',
        },
        {
          step: '02',
          code: 'PHASE // ARCHITECTURE',
          title: 'Plan the Structure',
          desc: 'Design content hierarchy, modular components, and wireframe flow.',
        },
        {
          step: '03',
          code: 'PHASE // SYNTHESIS',
          title: 'Build with Precision',
          desc: 'Leverage AI-assisted tooling with clean, reliable React & TypeScript.',
        },
        {
          step: '04',
          code: 'PHASE // VALIDATION',
          title: 'Review and Test',
          desc: 'Verify responsiveness, accessibility, fast loading, and link integrity.',
        },
        {
          step: '05',
          code: 'PHASE // HANDOFF',
          title: 'Transparent Delivery',
          desc: 'Provide live deployment, operational walkthrough, and ongoing support.',
        },
      ];

  const visibleServices = services.filter((s) => s.visible);

  return (
    <section id="services" className="py-28 px-5 sm:px-8 lg:px-12 border-t border-white/5 relative bg-[#070709] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#38bdf8]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#818cf8]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1240px] w-full mx-auto relative z-10">
        {/* Eyebrow & Title */}
        <motion.div
          variants={cinematicFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={safeViewport}
          className="mb-14"
        >
          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-[#38bdf8] mb-3">
            <span className="inline-block w-2 h-2 bg-[#38bdf8] rounded-full animate-ping" />
            <span>// CAPABILITY MATRIX</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-cinematic uppercase tracking-tight text-white mb-4">
            {t('servicesTitle')}
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
            {t('servicesSub')}
          </p>
        </motion.div>

        {/* 5-Step Process Pipeline */}
        <motion.div
          id="approach"
          variants={cinematicFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={safeViewport}
          className="mb-16 p-6 sm:p-8 rounded-2xl bg-[#0A0B10] border border-white/10 relative overflow-hidden"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#38bdf8]" />
              <span>{isRoman ? 'WORKFLOW PIPELINE // 5-STAGE PROTOCOL' : 'WORKFLOW PIPELINE // 5-STAGE PROTOCOL'}</span>
            </p>
            <span className="text-[10px] font-mono text-[#38bdf8] px-2.5 py-0.5 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/30 font-semibold tracking-wider">
              ● STANDARDIZED EXECUTION
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
            {processSteps.map((p, idx) => (
              <motion.div
                key={idx}
                variants={cinematicFadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={safeViewport}
                custom={idx}
                className="relative flex flex-col justify-between p-5 rounded-xl bg-black/40 border border-white/5 hover:border-[#38bdf8]/40 transition-colors duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-cinematic font-bold text-[#38bdf8] tracking-wider">
                      {p.step}
                    </span>
                    <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">
                      {p.code}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-[#38bdf8] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#38bdf8] transition-colors" />
                  <span className="text-[9px] font-mono text-zinc-600 group-hover:text-zinc-400">STAGE READY</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {visibleServices.map((service, idx) => (
            <motion.div
              key={service.id}
              variants={cinematicFadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={safeViewport}
              custom={idx}
              className="group relative p-6 sm:p-7 rounded-2xl bg-[#0A0B10] border border-white/10 hover:border-[#38bdf8]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Corner reticle brackets */}
              <span className="absolute top-2 left-2 text-[10px] font-mono text-white/20 pointer-events-none group-hover:text-[#38bdf8]/60 transition-colors">⌜</span>
              <span className="absolute top-2 right-2 text-[10px] font-mono text-white/20 pointer-events-none group-hover:text-[#38bdf8]/60 transition-colors">⌝</span>
              <span className="absolute bottom-2 left-2 text-[10px] font-mono text-white/20 pointer-events-none group-hover:text-[#38bdf8]/60 transition-colors">⌞</span>
              <span className="absolute bottom-2 right-2 text-[10px] font-mono text-white/20 pointer-events-none group-hover:text-[#38bdf8]/60 transition-colors">⌟</span>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#38bdf8]/40 transition-colors">
                    {getServiceIcon(service.name)}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#38bdf8] px-2.5 py-0.5 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/20">
                    SPEC // 0{idx + 1}
                  </span>
                </div>

                <h3 className="text-xl font-cinematic uppercase tracking-wide text-white mb-2 group-hover:text-[#38bdf8] transition-colors">
                  {service.name}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                  {service.description}
                </p>

                {service.deliverables && service.deliverables.length > 0 && (
                  <div className="space-y-2 mb-6 p-3 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#38bdf8] font-semibold block">
                      {isRoman ? 'SCOPE // DELIVERABLES:' : 'SCOPE // DELIVERABLES:'}
                    </span>
                    <ul className="space-y-1.5 text-xs text-zinc-300 font-medium">
                      {service.deliverables.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => onSelectServiceForContact(service.name)}
                  className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-[#38bdf8] text-zinc-200 hover:text-black border border-white/10 hover:border-[#38bdf8] text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group/btn"
                >
                  <span>{getServiceCta(service.name)}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQs */}
        {faqs.length > 0 && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2 mb-8">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#38bdf8] font-semibold">
                // SYSTEM QUERIES
              </span>
              <h3 className="text-3xl sm:text-4xl font-cinematic uppercase tracking-tight text-white">
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
                      className="rounded-xl bg-[#0A0B10] border border-white/10 hover:border-[#38bdf8]/40 transition-all overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors group"
                      >
                        <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#38bdf8] shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-white/5">
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

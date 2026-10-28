import React from 'react';
import { ArrowLeft, Printer, Download, Mail, Phone, GraduationCap, Briefcase, Award } from 'lucide-react';
import { dataProvider } from '../data/dataProvider';

export const ResumePage: React.FC = () => {
  const db = dataProvider.getDatabase();
  const profile = db.profile;
  const experiences = db.experiences.filter((e) => e.visible);
  const skills = db.skills.filter((s) => s.visible);
  const education = db.education.filter((e) => e.visible);
  const certifications = db.certifications.filter((c) => c.visible);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    let cvText = `# Curriculum Vitae\n` +
      `**${profile.full_name}** — ${profile.professional_title}\n` +
      `Email: ${db.settings.contact_email} | WhatsApp: ${db.settings.whatsapp_number}\n\n` +
      `## Summary\n${profile.bio_short}\n\n`;

    if (skills.length > 0) {
      cvText += `## Tools & Practice Areas\n` + skills.map((s) => `- **${s.name}**: ${s.context}`).join('\n') + `\n\n`;
    }

    if (experiences.length > 0) {
      cvText += `## Work Experience\n` +
        experiences
          .map(
            (e) =>
              `### ${e.role} — ${e.organization} (${e.start_date} to ${e.end_date || 'Present'})\n${e.description}\n` +
              e.highlights.map((h) => `- ${h}`).join('\n')
          )
          .join('\n\n') +
        `\n\n`;
    }

    if (education.length > 0) {
      cvText += `## Learning & Education\n` +
        education
          .map((ed) => `- **${ed.degree}**, ${ed.institution} (${ed.start_year || 'Ongoing'})\n  ${ed.notes || ''}`)
          .join('\n') +
        `\n\n`;
    }

    const blob = new Blob([cvText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.full_name.replace(/\s+/g, '_')}_Resume.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] py-12 px-4 sm:px-8">
      {/* Action Header (Hidden in Print) */}
      <div className="max-w-4xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4 no-print">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--border)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </a>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadMarkdown}
            className="px-4 py-2 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--border)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] transition flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Download .MD</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-[var(--accent)] hover:brightness-110 active:scale-95 text-white text-xs font-semibold transition flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Resume Container */}
      <div className="max-w-4xl mx-auto p-8 sm:p-14 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xl print:border-none print:shadow-none print:p-0 print:bg-white print:text-black">
        {/* CV Header */}
        <header className="border-b border-[var(--border)] pb-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold font-display text-[var(--text)] print:text-black tracking-tight">
                {profile.full_name}
              </h1>
              <p className="text-base sm:text-lg font-medium text-cyan-400 print:text-indigo-700 mt-1">
                {profile.professional_title}
              </p>
            </div>

            <div className="text-xs sm:text-sm text-[var(--text-muted)] print:text-gray-700 space-y-1 font-mono">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400 print:text-indigo-600 shrink-0" />
                <span>{db.settings.contact_email}</span>
              </p>
              {db.settings.whatsapp_number && (
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 print:text-indigo-600 shrink-0" />
                  <span>WhatsApp: {db.settings.whatsapp_number}</span>
                </p>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[var(--text)] print:text-gray-800 leading-relaxed mt-6 pt-6 border-t border-[var(--border)]/50">
            {profile.bio_short}
          </p>
        </header>

        {/* Tools & Practice Areas */}
        <section className="mb-10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 print:text-indigo-700 font-mono mb-4 border-b border-[var(--border)] pb-2">
            Tools I Use & Explore
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {skills.map((s) => (
              <div key={s.id} className="p-2.5 rounded-lg bg-[var(--surface-2)]/50 print:bg-gray-100 border border-[var(--border)]/60 text-xs">
                <p className="font-semibold text-[var(--text)] print:text-black">{s.name}</p>
                <p className="text-[11px] text-[var(--text-muted)] print:text-gray-600 truncate">{s.context}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Work Experience (Only if real entries exist) */}
        {experiences.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 print:text-indigo-700 font-mono mb-6 flex items-center gap-2 border-b border-[var(--border)] pb-2">
              <Briefcase className="w-4 h-4" />
              <span>Work Experience</span>
            </h2>

            <div className="space-y-8">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-[var(--text)] print:text-black">
                      {exp.role} <span className="font-normal text-[var(--text-muted)] print:text-gray-600">at {exp.organization}</span>
                    </h3>
                    <span className="text-xs font-mono text-cyan-400 print:text-gray-600">
                      {exp.start_date} – {exp.end_date || 'Present'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--text-muted)] print:text-gray-700 leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    {exp.highlights.map((h, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[var(--text)] print:text-gray-900">
                        <span className="text-cyan-400 print:text-indigo-600 mt-0.5">•</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education & Learning Journey */}
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 print:text-indigo-700 font-mono mb-4 border-b border-[var(--border)] pb-2 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span>Learning & Education</span>
          </h2>
          <div className="p-4 rounded-xl bg-[var(--surface-2)]/30 border border-[var(--border)]/60 text-xs">
            <p className="font-semibold text-sm text-[var(--text)] print:text-black">
              Currently continuing my learning journey in technology and web development.
            </p>
            <p className="text-xs text-[var(--text-muted)] print:text-gray-600 mt-1">
              Active practical experimentation with Google AI Studio, React, TypeScript, and modern frontend tools.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Briefcase, GraduationCap, Award, Download, Calendar, MapPin, CheckCircle2, FileText } from 'lucide-react';
import { Experience, Education, Certification, Achievement } from '../../types/portfolio';

interface ExperienceSectionProps {
  experiences: Experience[];
  education: Education[];
  certifications: Certification[];
  achievements: Achievement[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
  education,
  certifications,
  achievements,
}) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadCV = () => {
    setDownloading(true);
    setTimeout(() => {
      // Create and trigger download of generated CV summary text/markdown file
      const cvText = `# Curriculum Vitae - Zain Ul Abideen\nCreative Technologist & AI Architect\n\n## Experience\n` +
        experiences.map(e => `### ${e.role} at ${e.organization} (${e.start_date} - ${e.end_date || 'Present'})\n${e.description}\n` + e.highlights.map(h => `- ${h}`).join('\n')).join('\n\n');
      
      const blob = new Blob([cvText], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Zain_Ul_Abideen_CV.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloading(false);
    }, 600);
  };

  return (
    <section id="experience" className="py-24 px-5 sm:px-8 lg:px-12 border-t border-[var(--border)] relative">
      <div className="max-w-[1200px] w-full mx-auto">
        {/* Eyebrow, Title & CV Download CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--accent-text)] font-semibold mb-2 font-mono">
              // 05. BACKGROUND & TRACK RECORD
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-[var(--text)] tracking-tight">
              Work Experience & Milestones
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-xl mt-2">
              Demonstrated engineering ownership across mission-critical platforms, high-throughput APIs, and creative products.
            </p>
          </div>

          <button
            onClick={handleDownloadCV}
            disabled={downloading}
            className="px-6 py-3 rounded-full bg-[var(--surface-2)] hover:bg-[var(--accent)] hover:text-white border border-[var(--border)] text-xs sm:text-sm font-semibold text-[var(--text)] transition flex items-center gap-2 self-start md:self-auto cursor-pointer shadow-sm active:scale-95"
            aria-label="Download CV"
          >
            <Download className="w-4 h-4 text-[var(--accent-text)]" />
            <span>{downloading ? 'Preparing File...' : 'Download Resume (CV)'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column (7 cols): Career Timeline */}
          <div className="lg:col-span-7">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono mb-8 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[var(--accent-text)]" />
              <span>Career Trajectory</span>
            </h3>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-[var(--border)] space-y-10">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative group">
                  {/* Timeline Node Dot */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[var(--surface)] border-2 border-[var(--accent)] group-hover:scale-125 transition-transform" />

                  <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)] hover:border-[var(--accent)]/50 transition">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono text-[var(--accent-text)] font-semibold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {exp.start_date} — {exp.end_date || 'Present'}
                      </span>
                      {exp.is_current && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Active Role
                        </span>
                      )}
                    </div>

                    <h4 className="text-lg font-bold font-display text-[var(--text)] mb-1">
                      {exp.role}
                    </h4>
                    <p className="text-xs sm:text-sm font-medium text-[var(--text-muted)] mb-3 flex items-center gap-2">
                      <span className="text-[var(--text)]">{exp.organization}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {exp.location}
                      </span>
                    </p>

                    <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-4">
                      {exp.description}
                    </p>

                    <div className="space-y-1.5">
                      {exp.highlights.map((h, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2 text-xs text-[var(--text)]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (5 cols): Education, Certifications & Recognition */}
          <div className="lg:col-span-5 space-y-10">
            {/* Education */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono mb-4 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span>Formal Education</span>
              </h3>

              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm"
                >
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">
                    {edu.start_year} – {edu.end_year || 'Present'}
                  </span>
                  <h4 className="text-base font-bold font-display text-[var(--text)] mt-1">
                    {edu.degree} in {edu.field}
                  </h4>
                  <p className="text-xs text-[var(--accent-text)] font-medium mb-2">
                    {edu.institution}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {edu.notes}
                  </p>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                <span>Verified Credentials</span>
              </h3>

              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-[var(--text)]">
                        {cert.title}
                      </h4>
                      <p className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">
                        {cert.issuer} • Issued {cert.issued_on}
                      </p>
                    </div>
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-[var(--accent-text)] hover:underline"
                      >
                        Verify ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Honors & Recognition</span>
              </h3>

              <div className="space-y-3">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-semibold text-[var(--text)]">
                        {ach.title}
                      </h4>
                      <span className="text-[11px] font-mono text-[var(--text-muted)]">{ach.year}</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

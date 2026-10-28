import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, ShieldCheck } from 'lucide-react';
import { Testimonial } from '../../types/portfolio';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const approvedTestimonials = testimonials.filter(
    (t) => t.approval === 'approved' && t.permission_confirmed
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  if (approvedTestimonials.length === 0) {
    return null; // As per PRD §6.6, auto-hides entirely when no approved entries exist
  }

  const current = approvedTestimonials[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? approvedTestimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === approvedTestimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="testimonials" className="py-24 px-5 sm:px-8 lg:px-12 border-t border-[var(--border)] relative bg-[var(--surface)]/30">
      <div className="max-w-[1000px] w-full mx-auto">
        {/* Eyebrow & Title */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-[var(--accent-text)] font-semibold mb-2 font-mono">
            // 06. TRUST & COLLABORATION
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-[var(--text)] tracking-tight">
            Client & Partner Endorsements
          </h2>
        </div>

        {/* Testimonial Feature Card */}
        <div className="relative p-8 sm:p-12 rounded-[28px] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)]">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent-text)] flex items-center justify-center mb-6">
            <Quote className="w-6 h-6" />
          </div>

          <blockquote className="text-lg sm:text-2xl font-display font-medium text-[var(--text)] leading-relaxed mb-8">
            "{current.quote}"
          </blockquote>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-[var(--border)]">
            <div className="flex items-center gap-4">
              {current.photo_url ? (
                <img
                  src={current.photo_url}
                  alt={current.author_name}
                  className="w-12 h-12 rounded-full object-cover border border-[var(--border)]"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[var(--surface-2)] flex items-center justify-center font-bold text-sm text-[var(--accent-text)]">
                  {current.author_name[0]}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold font-display text-[var(--text)]">
                    {current.author_name}
                  </h3>
                  <span title="Verified collaboration">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] font-mono">
                  {current.author_role} • {current.author_company}
                </p>
              </div>
            </div>

            {/* Slider Navigation Buttons */}
            {approvedTestimonials.length > 1 && (
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={handlePrev}
                  className="p-3 rounded-full bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text)] transition cursor-pointer"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-[var(--text-muted)] px-2">
                  {currentIndex + 1} / {approvedTestimonials.length}
                </span>
                <button
                  onClick={handleNext}
                  className="p-3 rounded-full bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text)] transition cursor-pointer"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { Globe, Search, Share2, Save, Check, Eye } from 'lucide-react';
import { dataProvider } from '../../data/dataProvider';

export const AdminSeo: React.FC = () => {
  const db = dataProvider.getDatabase();
  const [siteTitle, setSiteTitle] = useState(
    `${db.settings.site_name} — ${db.settings.tagline}`
  );
  const [metaDesc, setMetaDesc] = useState(
    'High-impact dark cinematic personal portfolio website with AI video intro, interactive case studies, responsive showcase, and an advanced admin management system.'
  );
  const [ogImage, setOgImage] = useState(db.profile.portrait_url);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text)]">
            SEO & OpenGraph Social Sharing Manager
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Configure search engine metadata, canonical URLs, and live social card previews for Twitter/LinkedIn.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-[var(--accent)] hover:brightness-110 active:scale-95 text-white text-xs sm:text-sm font-semibold transition flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
        >
          {savedToast ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{savedToast ? 'SEO Saved!' : 'Save Meta Configuration'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Global Title Tag (&lt;title&gt;) *
              </label>
              <input
                type="text"
                required
                value={siteTitle ?? ''}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
              <span className="text-[11px] text-[var(--text-muted)] font-mono mt-1 block">
                {siteTitle.length} / 60 recommended characters
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Meta Description (&lt;meta name="description"&gt;) *
              </label>
              <textarea
                rows={3}
                required
                value={metaDesc ?? ''}
                onChange={(e) => setMetaDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] leading-relaxed"
              />
              <span className="text-[11px] text-[var(--text-muted)] font-mono mt-1 block">
                {metaDesc.length} / 160 recommended characters
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                OpenGraph Share Image URL (1200x630)
              </label>
              <input
                type="url"
                value={ogImage ?? ''}
                onChange={(e) => setOgImage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
              <span className="text-xs font-mono font-semibold text-[var(--accent-text)]">
                Structured Data (JSON-LD) Preview:
              </span>
              <pre className="text-[11px] font-mono text-[var(--text-muted)] overflow-x-auto p-2 bg-black/40 rounded-lg">
{`{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "${db.profile.full_name}",
  "jobTitle": "${db.profile.professional_title}",
  "url": "https://example.com",
  "sameAs": [
    "https://github.com",
    "https://linkedin.com"
  ]
}`}
              </pre>
            </div>
          </form>
        </div>

        {/* Live Visual Previews (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Google Search Result Preview */}
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] uppercase">
              <Search className="w-3.5 h-3.5 text-blue-400" />
              <span>Google SERP Preview</span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface-2)]/60 border border-[var(--border)] space-y-1">
              <div className="text-[11px] text-zinc-400 truncate font-mono">
                https://zainulabideen.dev
              </div>
              <h4 className="text-base font-semibold text-blue-400 hover:underline cursor-pointer truncate">
                {siteTitle}
              </h4>
              <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                {metaDesc}
              </p>
            </div>
          </div>

          {/* Social Card Preview (Twitter / LinkedIn) */}
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] uppercase">
              <Share2 className="w-3.5 h-3.5 text-[var(--accent-text)]" />
              <span>Social Share Card Preview</span>
            </div>

            <div className="rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface-2)]/80">
              <div className="aspect-[1.91/1] w-full bg-black/50 overflow-hidden">
                <img
                  src={ogImage}
                  alt="Social preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3.5 space-y-1">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">zainulabideen.dev</span>
                <h5 className="text-xs font-bold text-[var(--text)] line-clamp-1">{siteTitle}</h5>
                <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 leading-tight">{metaDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

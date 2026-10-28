import React, { useState, useRef } from 'react';
import { Save, Check, User, Globe, Palette, Sliders, Sparkles, Upload, Image as ImageIcon, Camera, RotateCcw } from 'lucide-react';
import { dataProvider } from '../../data/dataProvider';
import { Profile, SiteSettings } from '../../types/portfolio';
import { useTheme } from '../../features/theme/ThemeContext';

export const AdminSettings: React.FC = () => {
  const db = dataProvider.getDatabase();
  const { accent, setAccent, theme, setTheme } = useTheme();

  const [profile, setProfile] = useState<Profile>({ ...db.profile });
  const [settings, setSettings] = useState<SiteSettings>({ ...db.settings });
  const [rolesInput, setRolesInput] = useState(profile.roles_rotating.join(', '));
  const [savedToast, setSavedToast] = useState(false);
  const [photoMode, setPhotoMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedRoles = rolesInput
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    dataProvider.updateProfile({
      ...profile,
      roles_rotating: parsedRoles,
      is_sample: false, // saving real content clears is_sample flag per PRD
    });

    dataProvider.updateSettings(settings);

    setAccent(settings.accent_palette);
    setTheme(settings.default_theme);

    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleToggleFlag = (key: keyof SiteSettings['feature_flags']) => {
    setSettings((prev) => ({
      ...prev,
      feature_flags: {
        ...prev.feature_flags,
        [key]: !prev.feature_flags[key],
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text)]">
            Profile & Global Site Settings
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Manage your personal brand identity, contact channels, design accent tokens, and feature flags.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-[var(--accent)] hover:brightness-110 active:scale-95 text-white text-xs sm:text-sm font-semibold transition flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
        >
          {savedToast ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{savedToast ? 'Changes Saved!' : 'Save All Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--border)]">
            <User className="w-5 h-5 text-[var(--accent-text)]" />
            <h2 className="text-base font-bold font-display text-[var(--text)]">
              Personal Brand & Bio
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Full Display Name *
              </label>
              <input
                type="text"
                required
                value={profile.full_name ?? ''}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Professional Title *
              </label>
              <input
                type="text"
                required
                value={profile.professional_title ?? ''}
                onChange={(e) => setProfile({ ...profile, professional_title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Rotating Hero Roles (Comma-Separated)
            </label>
            <input
              type="text"
              value={rolesInput ?? ''}
              onChange={(e) => setRolesInput(e.target.value)}
              placeholder="AI Systems Architect, Full-Stack Engineer, Creative Developer"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Hero Value Proposition (1–2 Lines) *
            </label>
            <textarea
              rows={2}
              required
              value={profile.value_proposition ?? ''}
              onChange={(e) => setProfile({ ...profile, value_proposition: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Short Bio (About Section)
              </label>
              <textarea
                rows={3}
                value={profile.bio_short ?? ''}
                onChange={(e) => setProfile({ ...profile, bio_short: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Long Biography (Expanded Narrative)
              </label>
              <textarea
                rows={3}
                value={profile.bio_long ?? ''}
                onChange={(e) => setProfile({ ...profile, bio_long: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          {/* Profile Photo Manager */}
          <div className="pt-2 border-t border-[var(--border)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text)]">
                  Developer Profile Photo / Portrait
                </label>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  This photo is featured on your Welcome Photo Banner, Hero Section, and About page.
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-1 p-1 bg-[var(--surface-2)] rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setPhotoMode('upload')}
                  className={`px-3 py-1 rounded-md transition font-medium ${
                    photoMode === 'upload'
                      ? 'bg-[var(--accent)] text-white shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoMode('url')}
                  className={`px-3 py-1 rounded-md transition font-medium ${
                    photoMode === 'url'
                      ? 'bg-[var(--accent)] text-white shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
              {/* Preview Avatar */}
              <div className="relative shrink-0">
                <div className="w-24 h-28 rounded-2xl overflow-hidden border-2 border-[var(--border)] shadow-md bg-[var(--surface)]">
                  {profile.portrait_url ? (
                    <img
                      src={profile.portrait_url}
                      alt={profile.full_name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-muted)] p-2 text-center text-[10px]">
                      <User className="w-6 h-6 mb-1 opacity-50" />
                      <span>No Photo</span>
                    </div>
                  )}
                </div>
                <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--accent-text)]">
                  <Camera className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Upload or URL Controls */}
              <div className="flex-1 w-full space-y-3">
                {photoMode === 'upload' ? (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setProfile({ ...profile, portrait_url: event.target.result as string });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />

                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setProfile({ ...profile, portrait_url: event.target.result as string });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)] rounded-xl p-5 text-center cursor-pointer transition bg-[var(--surface)]/50 hover:bg-[var(--surface)]"
                    >
                      <Upload className="w-6 h-6 mx-auto mb-2 text-[var(--accent-text)]" />
                      <p className="text-xs font-semibold text-[var(--text)]">
                        Click to select photo or drag and drop here
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1">
                        PNG, JPG, or WEBP up to 5MB (automatically optimized)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      Direct Image Web URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/ramzan-portrait.jpg"
                      value={profile.portrait_url ?? ''}
                      onChange={(e) => setProfile({ ...profile, portrait_url: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[11px] text-[var(--text-muted)]">
                    Current photo is live across Hero, Welcome Banner, and About section.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setProfile({
                        ...profile,
                        portrait_url: '/src/assets/images/ramzan_web_dev_portrait_1792988064226.jpg',
                      });
                    }}
                    className="text-[11px] text-[var(--accent-text)] hover:underline flex items-center gap-1 cursor-pointer shrink-0 ml-2"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restore Studio Portrait</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Welcome Banner Manager */}
          <div className="pt-4 border-t border-[var(--border)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text)]">
                  Welcome Card Banner Graphic
                </label>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Featured 16:9 banner displayed when visitors arrive at your portfolio.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setProfile({
                    ...profile,
                    welcome_banner_url: '/assets/aistudio/Neon_Portfolio_Hero__Welcome__I_m_Ramzan_85351036.png',
                  });
                }}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Neon Banner</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
              <div className="relative rounded-xl overflow-hidden border border-cyan-500/30 aspect-[16/9] max-h-56 bg-black flex items-center justify-center">
                <img
                  src={profile.welcome_banner_url || '/assets/aistudio/Neon_Portfolio_Hero__Welcome__I_m_Ramzan_85351036.png'}
                  alt="Welcome Banner Preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-cyan-400 border border-cyan-500/30">
                  Live Banner Preview
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Banner Image URL or Path
                </label>
                <input
                  type="text"
                  placeholder="/assets/aistudio/Neon_Portfolio_Hero__Welcome__I_m_Ramzan_85351036.png"
                  value={profile.welcome_banner_url ?? ''}
                  onChange={(e) => setProfile({ ...profile, welcome_banner_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Availability Settings */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--border)]">
            <Globe className="w-5 h-5 text-[var(--accent-text)]" />
            <h2 className="text-base font-bold font-display text-[var(--text)]">
              Direct Contact & Availability
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Inquiry Contact Email *
              </label>
              <input
                type="email"
                required
                value={settings.contact_email ?? ''}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                WhatsApp Phone Number
              </label>
              <input
                type="text"
                value={settings.whatsapp_number ?? ''}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                placeholder="+1 555 123 4567"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Booking Calendar URL (Cal.com / Calendly)
              </label>
              <input
                type="url"
                value={settings.booking_url ?? ''}
                onChange={(e) => setSettings({ ...settings, booking_url: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Availability Badge Text
              </label>
              <input
                type="text"
                value={settings.availability_text ?? ''}
                onChange={(e) => setSettings({ ...settings, availability_text: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>
        </div>

        {/* Visual Palette & Theme Tokens (AD-32) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--border)]">
            <Palette className="w-5 h-5 text-[var(--accent-text)]" />
            <h2 className="text-base font-bold font-display text-[var(--text)]">
              Visual Design & Palette Tokens
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                Brand Accent Palette
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, accent_palette: 'violet' })}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 transition cursor-pointer ${
                    settings.accent_palette === 'violet'
                      ? 'bg-[var(--surface-2)] border-[var(--accent)] ring-1 ring-[var(--accent)]'
                      : 'bg-[var(--surface-2)]/50 border-[var(--border)]'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-[#7C5CFF]" />
                  <span className="text-xs font-semibold text-[var(--text)]">Electric Violet (Default)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, accent_palette: 'blue' })}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 transition cursor-pointer ${
                    settings.accent_palette === 'blue'
                      ? 'bg-[var(--surface-2)] border-[#3B82F6] ring-1 ring-[#3B82F6]'
                      : 'bg-[var(--surface-2)]/50 border-[var(--border)]'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-[#3B82F6]" />
                  <span className="text-xs font-semibold text-[var(--text)]">Electric Blue</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                Default Theme
              </label>
              <select
                value={settings.default_theme ?? 'dark'}
                onChange={(e) => setSettings({ ...settings, default_theme: e.target.value as any })}
                className="w-full px-3.5 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
              >
                <option value="dark">Dark Theme (Cinematic Charcoal)</option>
                <option value="light">Light Theme (Clean Studio)</option>
                <option value="system">Follow System Preference</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feature Flags Manager (PRD §9) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--border)]">
            <Sliders className="w-5 h-5 text-[var(--accent-text)]" />
            <h2 className="text-base font-bold font-display text-[var(--text)]">
              System Feature Flags
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(settings.feature_flags).map(([flagKey, enabled]) => (
              <label
                key={flagKey}
                className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between cursor-pointer hover:border-[var(--accent)]/40 transition"
              >
                <span className="text-xs font-medium text-[var(--text)] font-mono">
                  {flagKey}
                </span>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => handleToggleFlag(flagKey as any)}
                  className="rounded text-[var(--accent)]"
                />
              </label>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

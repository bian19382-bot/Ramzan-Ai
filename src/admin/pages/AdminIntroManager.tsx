import React, { useState } from 'react';
import { Video, Play, AlertCircle, Save, Check, RefreshCw, Eye } from 'lucide-react';
import { dataProvider } from '../../data/dataProvider';
import { IntroVideoSettings } from '../../types/portfolio';

export const AdminIntroManager: React.FC = () => {
  const db = dataProvider.getDatabase();
  const [intro, setIntro] = useState<IntroVideoSettings>({ ...db.intro_video });
  const [savedToast, setSavedToast] = useState(false);
  const [testSimulating, setTestSimulating] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dataProvider.updateIntroVideo(intro);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text)]">
            AI Video Intro Manager
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Configure full-screen AI video avatar, focal coordinates, transcripts, and transition fallbacks.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-[var(--accent)] hover:brightness-110 active:scale-95 text-white text-xs sm:text-sm font-semibold transition flex items-center gap-2 cursor-pointer shadow-md"
        >
          {savedToast ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{savedToast ? 'Settings Saved!' : 'Save Intro Settings'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Configuration Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-5">
            {/* Enable switch */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">Enable Cinematic Intro</p>
                <p className="text-xs text-[var(--text-muted)]">Show full-viewport video overlay to first-time visitors</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!intro.enabled}
                  onChange={(e) => setIntro({ ...intro, enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]" />
              </label>
            </div>

            {/* Video Desktop URL */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Desktop MP4 Video URL (H.264)
              </label>
              <input
                type="url"
                value={intro.video_desktop_url ?? ''}
                onChange={(e) => setIntro({ ...intro, video_desktop_url: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
              <span className="text-[11px] text-[var(--text-muted)] mt-1 block">
                Recommended &lt; 15 MB for instantaneous streaming.
              </span>
            </div>

            {/* Poster Image URL */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Instant Video Poster URL
              </label>
              <input
                type="url"
                value={intro.poster_url ?? ''}
                onChange={(e) => setIntro({ ...intro, poster_url: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            {/* Focal Point X & Y */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Focal Point X ({intro.focal_x ?? 50}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={intro.focal_x ?? 50}
                  onChange={(e) => setIntro({ ...intro, focal_x: Number(e.target.value) })}
                  className="w-full cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Focal Point Y ({intro.focal_y ?? 50}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={intro.focal_y ?? 50}
                  onChange={(e) => setIntro({ ...intro, focal_y: Number(e.target.value) })}
                  className="w-full cursor-pointer"
                />
              </div>
            </div>

            {/* English Transcript */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                English Video Script / Subtitles
              </label>
              <textarea
                rows={3}
                value={intro.script_en ?? ''}
                onChange={(e) => setIntro({ ...intro, script_en: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] leading-relaxed"
              />
            </div>

            {/* Roman Urdu Transcript */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Roman Urdu Transcript (Optional)
              </label>
              <textarea
                rows={2}
                value={intro.script_ur ?? ''}
                onChange={(e) => setIntro({ ...intro, script_ur: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            {/* Load timeout */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Load Timeout (Seconds)
                </label>
                <input
                  type="number"
                  min="2"
                  max="20"
                  value={intro.load_timeout_seconds ?? 5}
                  onChange={(e) => setIntro({ ...intro, load_timeout_seconds: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)]"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--text)]">
                  <input
                    type="checkbox"
                    checked={!intro.is_sample}
                    onChange={(e) => setIntro({ ...intro, is_sample: !e.target.checked })}
                    className="rounded text-[var(--accent)]"
                  />
                  <span>Mark as real intro video</span>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Right Col: Live Preview & Diagnostic Testing Tools (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
            <h3 className="text-sm font-bold font-display text-[var(--text)] uppercase tracking-wider font-mono">
              Live Preview & Diagnostics
            </h3>

            {/* Video preview miniature */}
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-black border border-[var(--border)]">
              <video
                src={intro.video_desktop_url}
                poster={intro.poster_url}
                muted
                controls
                className="w-full h-full object-cover"
                style={{ objectPosition: `${intro.focal_x}% ${intro.focal_y}%` }}
              />
            </div>

            {/* Simulation test triggers (AD-31) */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-[var(--text-muted)]">Test State Machines:</p>

              <button
                onClick={() => {
                  setTestSimulating('Simulating Autoplay Blocked state. In public site, fallback Play button will appear.');
                }}
                className="w-full py-2 px-3 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--border)] text-xs text-[var(--text)] text-left flex items-center justify-between transition cursor-pointer"
              >
                <span>Simulate Autoplay Blocked</span>
                <Play className="w-3.5 h-3.5 text-amber-400" />
              </button>

              <button
                onClick={() => {
                  setTestSimulating('Simulating Network Error/Timeout state. In public site, Fallback banner will open directly.');
                }}
                className="w-full py-2 px-3 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--border)] text-xs text-[var(--text)] text-left flex items-center justify-between transition cursor-pointer"
              >
                <span>Simulate Video Load Timeout</span>
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              </button>
            </div>

            {testSimulating && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs">
                {testSimulating}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

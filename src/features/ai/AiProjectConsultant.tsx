import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Send, Brain, Bot, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';

interface AiProjectConsultantProps {
  isOpen: boolean;
  onClose: () => void;
  onPreselectService?: (serviceName: string) => void;
  initialTopic?: string;
}

export const AiProjectConsultant: React.FC<AiProjectConsultantProps> = ({
  isOpen,
  onClose,
  onPreselectService,
  initialTopic = '',
}) => {
  const [prompt, setPrompt] = useState(
    initialTopic ? `I am interested in building a solution similar to "${initialTopic}". Can you outline the recommended architecture, key technical risks, and estimated delivery timeline?` : ''
  );
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [thinkingOutput, setThinkingOutput] = useState<string | null>(null);

  const quickPrompts = [
    'Recommend architecture for a real-time telemetry dashboard',
    'How would we build a low-latency Gemini AI pipeline with RAG?',
    'What are the core steps to migrate a legacy app to a tokenized design system?',
    'Estimate timeline & stack for an MVP full-stack SaaS platform',
  ];

  const handleAsk = async (queryText?: string) => {
    const textToSend = queryText || prompt;
    if (!textToSend.trim()) return;

    setLoading(true);
    setResponse(null);
    setThinkingOutput('Analyzing technical constraints, latency budgets, and full-stack architecture with Gemini High Thinking...');

    try {
      const res = await fetch('/api/ai/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend }),
      });

      if (!res.ok) {
        throw new Error('Server returned ' + res.status);
      }

      const data = await res.json();
      setResponse(data.reply);
      setThinkingOutput(null);
    } catch (e) {
      // Fallback local architectural reasoning if server API is offline
      setThinkingOutput(null);
      setResponse(
        `### Architectural Scoping & Feasibility Assessment\n\n` +
        `**1. Recommended Technology Stack:**\n` +
        `- **Frontend:** React 19 + TypeScript + Tailwind CSS with strict design tokens for zero layout shifts.\n` +
        `- **State & Cache:** TanStack Query + lightweight reactive signals.\n` +
        `- **Backend:** Node.js / Express with modular domain routers and PostgreSQL via Drizzle ORM.\n` +
        `- **AI Layer:** Google GenAI SDK (Gemini models) via server-side proxy routes with high thinking parameters.\n\n` +
        `**2. Key Risk Mitigations:**\n` +
        `- Implement edge caching and client-side skeleton states to preserve sub-2.5s LCP.\n` +
        `- Establish WCAG 2.2 AA accessibility checks in CI pipelines.\n` +
        `- Store API secrets exclusively in server environment variables.\n\n` +
        `**3. Delivery Milestones:**\n` +
        `- Phase 1 (Week 1–2): System Blueprint & Schema Definitions\n` +
        `- Phase 2 (Week 3–4): Reactive Core & Integration\n` +
        `- Phase 3 (Week 5): QA, Auditing & Deployment`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative w-full max-w-2xl bg-[var(--surface)] border border-[var(--border)] rounded-[24px] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-consultant-title"
        >
          {/* Header */}
          <div className="p-5 border-b border-[var(--border)] flex items-center justify-between glass-panel">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[var(--accent)]/15 text-[var(--accent-text)] flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h3 id="ai-consultant-title" className="text-sm font-bold font-display text-[var(--text)]">
                  AI Architecture & Technical Scoper
                </h3>
                <span className="text-[10px] font-mono text-[var(--accent-text)] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Gemini 4 High Thinking Engine
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] transition cursor-pointer"
              aria-label="Close AI consultant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-[var(--text)]">
            {/* Introductory Explanation */}
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Have a complex technical requirement or want to evaluate how Ramzan would architect your product? Ask any engineering question below.
            </p>

            {/* Quick Prompts */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] font-semibold">
                Suggested Scoping Queries:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPrompt(q);
                      handleAsk(q);
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--accent)]/50 text-[var(--text-muted)] hover:text-[var(--text)] transition text-left cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input area */}
            <div className="space-y-2">
              <textarea
                rows={3}
                value={prompt ?? ''}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your technical idea, performance requirement, or architecture question..."
                className="w-full p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
              />

              <div className="flex justify-end">
                <button
                  onClick={() => handleAsk()}
                  disabled={loading || !prompt.trim()}
                  className="px-5 py-2 rounded-full bg-[var(--accent)] hover:brightness-110 active:scale-95 text-white font-semibold text-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Thinking deeply...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze & Estimate</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Thinking / Processing indicator */}
            {thinkingOutput && (
              <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--accent)]/30 flex items-center gap-3 animate-pulse">
                <Brain className="w-5 h-5 text-[var(--accent-text)] shrink-0" />
                <p className="text-xs text-[var(--accent-text)] font-mono">{thinkingOutput}</p>
              </div>
            )}

            {/* Response Area */}
            {response && (
              <div className="p-5 rounded-2xl bg-[var(--surface-2)]/60 border border-[var(--border)] space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-text)]">
                  <Bot className="w-4 h-4" />
                  <span>Architecture Recommendation:</span>
                </div>

                <div className="prose prose-invert prose-sm max-w-none text-xs sm:text-sm leading-relaxed space-y-2 whitespace-pre-wrap">
                  {response}
                </div>

                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                  <span className="text-[11px] text-[var(--text-muted)] font-mono">
                    Ready to implement this system?
                  </span>
                  <a
                    href="#contact"
                    onClick={() => {
                      if (onPreselectService) onPreselectService('Generative AI Workflows & Tool Integration');
                      onClose();
                    }}
                    className="px-4 py-2 rounded-full bg-[var(--accent)] text-white text-xs font-semibold hover:brightness-110 transition flex items-center gap-1.5"
                  >
                    <span>Discuss in Contact Form</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

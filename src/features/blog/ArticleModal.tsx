import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Calendar, Tag, Share2, Check, ArrowRight, BookOpen } from 'lucide-react';
import { BlogPost } from '../../types/portfolio';

interface ArticleModalProps {
  post: BlogPost | null;
  onClose: () => void;
  onSelectPost: (post: BlogPost) => void;
  allPosts: BlogPost[];
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  post,
  onClose,
  onSelectPost,
  allPosts,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (post) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [post, onClose]);

  if (!post) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const related = allPosts.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center p-3 sm:p-6 lg:p-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          aria-hidden="true"
        />

        <motion.article
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-3xl bg-[var(--surface)] border border-[var(--border)] rounded-[24px] shadow-2xl overflow-hidden z-10 my-8 text-[var(--text)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="article-title"
        >
          {/* Top Bar */}
          <div className="sticky top-0 z-20 glass-panel border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-text)] bg-[var(--accent)]/10 px-2.5 py-1 rounded-full border border-[var(--accent)]/20 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{post.category_name}</span>
              </span>
              <span className="text-xs text-[var(--text-muted)] font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.reading_minutes} min read</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] transition cursor-pointer"
                title="Share article"
                aria-label="Share article"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] transition cursor-pointer"
                aria-label="Close article reader"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Banner Media */}
          {post.cover_image_url && (
            <div className="relative w-full aspect-[21/9] overflow-hidden bg-black/40">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent" />
            </div>
          )}

          {/* Article Body */}
          <div className="p-6 sm:p-10 space-y-8">
            <div>
              <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-muted)] mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span>•</span>
                <span>By Lead Architect</span>
              </div>

              <h1
                id="article-title"
                className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-[var(--text)] mb-4"
              >
                {post.title}
              </h1>

              <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed italic border-l-2 border-[var(--accent)] pl-4 my-4">
                {post.excerpt}
              </p>
            </div>

            {/* Markdown Body Text */}
            <div className="prose prose-invert prose-zinc max-w-none text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-wrap">
              {post.body}
            </div>

            {/* Tags */}
            <div className="pt-6 border-t border-[var(--border)] flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-[var(--text-muted)] uppercase">Tags:</span>
              {post.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-xs font-mono bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)]"
                >
                  #{t}
                </span>
              ))}
            </div>

            {/* Related articles */}
            {related.length > 0 && (
              <div className="pt-8 border-t border-[var(--border)]">
                <h3 className="text-sm font-mono uppercase tracking-wider text-[var(--text-muted)] mb-4">
                  Related Technical Insights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {related.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => onSelectPost(rel)}
                      className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div>
                        <span className="text-[10px] font-mono text-[var(--accent-text)]">{rel.category_name}</span>
                        <h4 className="text-xs sm:text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent-text)] transition line-clamp-1">
                          {rel.title}
                        </h4>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-text)] group-hover:translate-x-1 transition shrink-0 ml-2" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.article>
      </div>
    </AnimatePresence>
  );
};

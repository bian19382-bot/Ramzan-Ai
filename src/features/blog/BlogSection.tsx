import React, { useState } from 'react';
import { BookOpen, Clock, ArrowRight, ArrowUpRight } from 'lucide-react';
import { BlogPost } from '../../types/portfolio';
import { ArticleModal } from './ArticleModal';

interface BlogSectionProps {
  posts: BlogPost[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  const publishedPosts = posts.filter((p) => p.status === 'published');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  if (publishedPosts.length === 0) return null;

  return (
    <section id="blog" className="py-24 px-5 sm:px-8 lg:px-12 border-t border-[var(--border)] relative bg-[var(--surface)]/20">
      <div className="max-w-[1200px] w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold mb-2 font-mono">
              // 07. TECHNICAL INSIGHTS
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-[var(--text)] tracking-tight">
              Architectural Notes & Articles
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-xl mt-2 font-medium">
              Deep dives into AI thinking models, sub-second telemetry, and design system engineering.
            </p>
          </div>

          <div className="text-xs font-mono text-[var(--text-muted)] bg-[var(--surface-2)] px-3 py-1.5 rounded-full border border-[var(--border)] self-start md:self-auto font-semibold">
            {publishedPosts.length} Published Articles
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => setActiveArticle(post)}
              className="group p-6 rounded-[24px] bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:border-cyan-400 dark:hover:border-cyan-400 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Meta */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/25 font-semibold">
                    {post.category_name}
                  </span>
                  <span className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.reading_minutes} min read</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold font-display text-[var(--text)] group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2.5">
                  {post.title}
                </h3>

                <p className="text-xs sm:text-sm text-[var(--text-muted)] line-clamp-3 leading-relaxed mb-6 font-normal">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border)]/50 flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-cyan-400 font-mono">
                <span>Read Full Article</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </div>
            </article>
          ))}
        </div>
      </div>

      <ArticleModal
        post={activeArticle}
        onClose={() => setActiveArticle(null)}
        onSelectPost={(p) => setActiveArticle(p)}
        allPosts={publishedPosts}
      />
    </section>
  );
};

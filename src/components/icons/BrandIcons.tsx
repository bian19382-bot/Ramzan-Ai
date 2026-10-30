import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// 1. Google AI Studio / Gemini Multi-Modal Logo
export const GoogleAiStudioLogo: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-label="Google AI Studio">
    <defs>
      <linearGradient id="geminiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E88E5" />
        <stop offset="35%" stopColor="#8E24AA" />
        <stop offset="70%" stopColor="#E53935" />
        <stop offset="100%" stopColor="#FDD835" />
      </linearGradient>
    </defs>
    <path
      d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
      fill="url(#geminiGrad)"
    />
  </svg>
);

// 2. OpenAI / ChatGPT Logo
export const OpenAiLogo: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`${className} text-[#10A37F]`} aria-label="OpenAI ChatGPT">
    <path d="M22.28 10.37a5.9 5.9 0 0 0-.5-4.85 6.06 6.06 0 0 0-6.52-2.88 5.92 5.92 0 0 0-4.48-2A6.06 6.06 0 0 0 5 3.51a5.9 5.9 0 0 0-3.9 3.12 6.06 6.06 0 0 0 .74 7.13 5.9 5.9 0 0 0 .5 4.85 6.06 6.06 0 0 0 6.52 2.88 5.92 5.92 0 0 0 4.48 2 6.06 6.06 0 0 0 5.8-2.88 5.9 5.9 0 0 0 3.9-3.12 6.06 6.06 0 0 0-.76-7.12ZM12.03 21.2a4.42 4.42 0 0 1-2.42-.71l.13-.22 3.9-2.25a.8.8 0 0 0 .4-.7v-5.46l1.63.95v4.54a4.45 4.45 0 0 1-3.64 3.89Zm-7.7-4.45a4.4 4.4 0 0 1-.37-2.52l.25.15 3.9 2.25a.8.8 0 0 0 .8 0l4.73-2.73v1.89l-3.93 2.27a4.45 4.45 0 0 1-5.38-1.31ZM3.3 9.42a4.42 4.42 0 0 1 2.05-1.81v4.73a.8.8 0 0 0 .4.7l4.73 2.73-1.63.94-3.93-2.27A4.45 4.45 0 0 1 3.3 9.42Zm15.08 3.18-4.73-2.73 1.63-.94 3.93 2.27a4.45 4.45 0 0 1 1.62 5.03 4.42 4.42 0 0 1-2.05 1.81v-4.74a.8.8 0 0 0-.4-.7Zm2.34-3.87-.25-.15-3.9-2.25a.8.8 0 0 0-.8 0l-4.73 2.73V7.17l3.93-2.27a4.45 4.45 0 0 1 5.75 4.43Zm-7.9-2.06-1.63-.95V1.18a4.45 4.45 0 0 1 6.06 1.83 4.42 4.42 0 0 1 .37 2.52l-.25-.15-3.9-2.25a.8.8 0 0 0-.65-.13ZM12 13.62 9.9 12.4 12 11.2l2.1 1.2-2.1 1.22Z" />
  </svg>
);

// 3. Anthropic / Claude Logo
export const ClaudeLogo: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`${className} text-[#D97757]`} aria-label="Anthropic Claude">
    <path d="M13.8 2.2a1.8 1.8 0 0 1 3.4 1.1l-.8 6.2 5.7-2.6a1.8 1.8 0 0 1 1.5 3.2l-5.6 2.8 5.6 2.8a1.8 1.8 0 0 1-1.5 3.2l-5.7-2.6.8 6.2a1.8 1.8 0 0 1-3.4 1.1l-2.4-5.8-2.4 5.8a1.8 1.8 0 0 1-3.4-1.1l.8-6.2-5.7 2.6a1.8 1.8 0 0 1-1.5-3.2l5.6-2.8-5.6-2.8a1.8 1.8 0 0 1 1.5-3.2l5.7 2.6-.8-6.2a1.8 1.8 0 0 1 3.4-1.1l2.4 5.8 2.4-5.8Z" />
  </svg>
);

// 4. Cursor AI IDE Logo
export const CursorLogo: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-label="Cursor AI">
    <rect width="24" height="24" rx="6" fill="#18181B" />
    <path
      d="M6.5 6.5L17.5 12L12 13.5L10 18.5L6.5 6.5Z"
      fill="#22D3EE"
      stroke="#06B6D4"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M12 13.5L15 17.5" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 5. Supabase Logo
export const SupabaseLogo: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-label="Supabase">
    <path
      d="M13.4 1.2a1.5 1.5 0 0 0-2.3.2L1.8 13.5A1.5 1.5 0 0 0 3 16h8v6.8a1.5 1.5 0 0 0 2.3 1.2l9.3-12A1.5 1.5 0 0 0 21.4 9.5H13.4V1.2Z"
      fill="url(#sbGradient)"
    />
    <defs>
      <linearGradient id="sbGradient" x1="1.8" y1="1.2" x2="21.4" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#24E496" />
        <stop offset="1" stopColor="#3ECF8E" />
      </linearGradient>
    </defs>
  </svg>
);

// 6. Cloudflare Logo
export const CloudflareLogo: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`${className} text-[#F38020]`} aria-label="Cloudflare">
    <path d="M18.8 9.3a5.5 5.5 0 0 0-10.4-1.8A4.6 4.6 0 0 0 5 12a4.4 4.4 0 0 0 .1 1H4.6A4.6 4.6 0 0 0 0 17.6c0 2.4 2 4.4 4.5 4.4h15a4.5 4.5 0 0 0 4.5-4.5c0-2.3-1.8-4.2-4.1-4.4a5.5 5.5 0 0 0-1.1-3.8Z" />
  </svg>
);

// 7. GitHub Logo
export const GitHubLogo: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`${className} text-[#0F172A] dark:text-white`} aria-label="GitHub">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
  </svg>
);

// 8. Vercel Logo
export const VercelLogo: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`${className} text-[#0F172A] dark:text-white`} aria-label="Vercel">
    <path d="M12 1L24 22H0L12 1Z" />
  </svg>
);

// 9. React & TypeScript Logo
export const ReactTsLogo: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-label="React & TypeScript">
    <ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="#06B6D4" strokeWidth="1.5" />
    <ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="#3B82F6" strokeWidth="1.5" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="#6366F1" strokeWidth="1.5" transform="rotate(120 12 12)" />
    <circle cx="12" cy="12" r="2" fill="#38BDF8" />
  </svg>
);

// 10. Tailwind CSS Logo
export const TailwindLogo: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`${className} text-[#06B6D4]`} aria-label="Tailwind CSS">
    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
  </svg>
);

// 11. Figma Logo
export const FigmaLogo: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-label="Figma">
    <path d="M8 24C10.2091 24 12 22.2091 12 20V16H8C5.79086 16 4 17.7909 4 20C4 22.2091 5.79086 24 8 24Z" fill="#0ACF83" />
    <path d="M4 12C4 9.79086 5.79086 8 8 8H12V16H8C5.79086 16 4 14.2091 4 12Z" fill="#A259FF" />
    <path d="M4 4C4 1.79086 5.79086 0 8 0H12V8H8C5.79086 8 4 6.20914 4 4Z" fill="#F24E1E" />
    <path d="M12 0H16C18.2091 0 20 1.79086 20 4C20 6.20914 18.2091 8 16 8H12V0Z" fill="#FF7262" />
    <path d="M20 12C20 14.2091 18.2091 16 16 16C13.7909 16 12 14.2091 12 12C12 9.79086 13.7909 8 16 8C18.2091 8 20 9.79086 20 12Z" fill="#1ABCFE" />
  </svg>
);

// 12. Docker / Containers Logo
export const DockerLogo: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`${className} text-[#2496ED]`} aria-label="Docker">
    <path d="M13.9 8.2h2.2v2.2h-2.2V8.2zm-2.8 0h2.2v2.2h-2.2V8.2zm0-2.8h2.2v2.2h-2.2V5.4zm-2.8 2.8h2.2v2.2H8.3V8.2zm0-2.8h2.2v2.2H8.3V5.4zm-2.8 2.8h2.2v2.2H5.5V8.2zm-2.8 0h2.2v2.2H2.7V8.2zm19.9 2.5c-.3-.2-1.3-.4-2.5-.2-.2-.6-.6-1.1-1.2-1.5l-.6-.4-.4.6c-.5.8-.6 1.8-.3 2.7-.4.2-1.3.4-2.6.4H1.3c-.4 1.5-.1 3.8 1.4 5.7 1.5 1.9 3.8 2.9 6.7 2.9 5.3 0 9.5-2.9 10.9-7.5.9-.1 2.4-.6 3.1-2.4-.3-.1-.5-.2-.8-.3z" />
  </svg>
);

import React, { createContext, useContext, useState, useEffect } from 'react';
import { safeStorage, STORAGE_KEYS } from '../../lib/storage';

export type LanguageCode = 'en' | 'ur-roman' | 'ur';

export interface Translations {
  navHome: string;
  navAbout: string;
  navProjects: string;
  navServices: string;
  navExperience: string;
  navTestimonials: string;
  navBlog: string;
  navResume: string;
  navContact: string;
  navCta: string;
  heroAvailable: string;
  heroEyebrow: string;
  heroExploreCta: string;
  heroContactCta: string;
  heroAiScopingCta: string;
  connectLabel: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutReadMore: string;
  aboutShowLess: string;
  skillsEyebrow: string;
  skillsTitle: string;
  skillsSub: string;
  toolsTitle: string;
  projectsEyebrow: string;
  projectsTitle: string;
  projectsSub: string;
  allProjectsChip: string;
  searchPlaceholder: string;
  caseStudyButton: string;
  servicesEyebrow: string;
  servicesTitle: string;
  servicesSub: string;
  discussServiceButton: string;
  processStripEyebrow: string;
  experienceEyebrow: string;
  experienceTitle: string;
  downloadCvButton: string;
  testimonialsEyebrow: string;
  testimonialsTitle: string;
  blogEyebrow: string;
  blogTitle: string;
  blogSub: string;
  contactEyebrow: string;
  contactTitle: string;
  contactSub: string;
  contactSubmit: string;
  contactSending: string;
  nameLabel: string;
  emailLabel: string;
  serviceLabel: string;
  budgetLabel: string;
  timelineLabel: string;
  messageLabel: string;
  footerRights: string;
  replayIntroButton: string;
  adminPortalLink: string;
}

const TRANSLATIONS: Record<LanguageCode, Translations> = {
  en: {
    navHome: 'Home',
    navAbout: 'About',
    navProjects: 'Projects',
    navServices: 'Services',
    navExperience: 'Approach',
    navTestimonials: 'Testimonials',
    navBlog: 'Insights',
    navResume: 'Resume',
    navContact: 'Contact',
    navCta: "Let's Talk",
    heroAvailable: 'Open to suitable opportunities',
    heroEyebrow: 'PORTFOLIO · AI-ASSISTED WEB DEVELOPMENT',
    heroExploreCta: 'Explore My Projects',
    heroContactCta: "Let's Talk",
    heroAiScopingCta: 'AI Scoping Assistant',
    connectLabel: 'Connect:',
    aboutEyebrow: 'ABOUT RAMZAN',
    aboutTitle: 'A Little About Me',
    aboutReadMore: 'Read More About My Journey',
    aboutShowLess: 'Show Less',
    skillsEyebrow: 'WORKFLOW & TOOLING',
    skillsTitle: 'Tools I Use & Explore',
    skillsSub: 'I use AI and web-platform tools to explore ideas, create website projects, and learn about modern development workflows.',
    toolsTitle: 'Tools in My Workflow',
    projectsEyebrow: 'SELECTED WORK',
    projectsTitle: "Projects I've Built",
    projectsSub: "Here are some of the projects I've been building as part of my learning journey in web development and AI-assisted workflows.",
    allProjectsChip: 'All Projects',
    searchPlaceholder: 'Search projects, tools...',
    caseStudyButton: 'View Project',
    servicesEyebrow: 'SERVICES',
    servicesTitle: 'How I Can Help',
    servicesSub: 'My main focus is web development. I use AI-assisted workflows to help explore website ideas and build practical projects within a confirmed scope.',
    discussServiceButton: 'Discuss This Service',
    processStripEyebrow: 'My Approach',
    experienceEyebrow: 'PROCESS & APPROACH',
    experienceTitle: 'My Approach',
    downloadCvButton: 'Download Resume (CV)',
    testimonialsEyebrow: 'REVIEWS',
    testimonialsTitle: 'Client Endorsements',
    blogEyebrow: 'INSIGHTS',
    blogTitle: 'Learning Notes & Articles',
    blogSub: 'Practical learnings from building web projects and exploring AI workflows.',
    contactEyebrow: 'GET IN TOUCH',
    contactTitle: "Have a Website Idea? Let's Talk.",
    contactSub: "Have a website idea or a small project you'd like to discuss? Send me a message with the main requirements. I'll review the scope and confirm whether it fits my current capabilities.",
    contactSubmit: 'Send Project Inquiry',
    contactSending: 'Submitting inquiry...',
    nameLabel: 'Your Name *',
    emailLabel: 'Email Address *',
    serviceLabel: 'Request Type',
    budgetLabel: 'Approx. Budget (Optional)',
    timelineLabel: 'Timeline (Optional)',
    messageLabel: 'Project Details *',
    footerRights: 'All rights reserved.',
    replayIntroButton: 'View Welcome Banner',
    adminPortalLink: 'Admin Management Panel',
  },
  'ur-roman': {
    navHome: 'Home',
    navAbout: 'Mere Baare Mein',
    navProjects: 'Projects',
    navServices: 'Services',
    navExperience: 'Tareeqa (Approach)',
    navTestimonials: 'Reviews',
    navBlog: 'Maqalaat',
    navResume: 'Resume (CV)',
    navContact: 'Raabta (Contact)',
    navCta: 'Baat Karein',
    heroAvailable: 'Munasib opportunities ke liye available',
    heroEyebrow: 'MERA PORTFOLIO · AI-ASSISTED WEB DEVELOPMENT',
    heroExploreCta: 'Mere Projects Dekhein',
    heroContactCta: 'Rabta Karein',
    heroAiScopingCta: 'AI Scoping Assistant',
    connectLabel: 'Connect Karein:',
    aboutEyebrow: 'MERE BAARE MEIN',
    aboutTitle: 'Mere Baare Mein',
    aboutReadMore: 'Mazeed Tafseel Dekhein',
    aboutShowLess: 'Kam Karein',
    skillsEyebrow: 'TOOLS AUR WORKFLOW',
    skillsTitle: 'Tools Jo Main Use Aur Explore Karta Hoon',
    skillsSub: 'Main AI aur web-platform tools ki madad se ideas explore karta hoon, website projects banata hoon aur modern development workflows seekhta hoon.',
    toolsTitle: 'Mere Workflow Ke Tools',
    projectsEyebrow: 'MERA KAAM',
    projectsTitle: 'Mere Projects',
    projectsSub: 'Yahan mere woh projects hain jo main web development aur AI-assisted workflow seekhne aur practice karne ke dauran bana raha hoon.',
    allProjectsChip: 'Tamam Projects',
    searchPlaceholder: 'Projects talash karein...',
    caseStudyButton: 'Project Dekhein',
    servicesEyebrow: 'SERVICES',
    servicesTitle: 'Main Kis Tarah Madad Kar Sakta Hoon',
    servicesSub: 'Mera main focus web development hai. Main AI-assisted workflow se website ideas explore karta hoon aur agreed scope ke mutabiq practical projects banata hoon.',
    discussServiceButton: 'Is Service Par Baat Karein',
    processStripEyebrow: 'Mera Tareeqa',
    experienceEyebrow: 'WORK PROCESS',
    experienceTitle: 'Mera Tareeqa',
    downloadCvButton: 'Resume (CV) Download Karein',
    testimonialsEyebrow: 'REVIEWS',
    testimonialsTitle: 'Reviews',
    blogEyebrow: 'NOTES',
    blogTitle: 'Learning Notes',
    blogSub: 'Web development aur AI tools se seekhne ke dauran likhe gaye notes.',
    contactEyebrow: 'RAABTA',
    contactTitle: 'Website Ka Koi Idea Hai? Baat Karte Hain.',
    contactSub: 'Aap ke paas website ka koi idea ya chhota project hai? Requirements share karein. Main scope dekh kar bataunga ke kya yeh kaam meri current capabilities ke mutabiq hai.',
    contactSubmit: 'Project Inquiry Bhejein',
    contactSending: 'Bheja ja raha hai...',
    nameLabel: 'Aap Ka Naam *',
    emailLabel: 'Email Address *',
    serviceLabel: 'Request Ki Type',
    budgetLabel: 'Andazan Budget (Ikhtiyari)',
    timelineLabel: 'Matloobah Waqt (Ikhtiyari)',
    messageLabel: 'Project Ki Tafseel *',
    footerRights: 'Jumla haqooq mehfooz hain.',
    replayIntroButton: 'Welcome Banner Dekhein',
    adminPortalLink: 'Admin Control Panel',
  },
  ur: {
    navHome: 'ہوم',
    navAbout: 'تعارف',
    navProjects: 'پروجیکٹس',
    navServices: 'خدمات',
    navExperience: 'تجربہ',
    navTestimonials: 'آراء',
    navBlog: 'مضامین',
    navResume: 'سی وی',
    navContact: 'رابطہ',
    navCta: 'بات کریں',
    heroAvailable: 'نئے پروجیکٹس اور پارٹنرشپ کے لیے دستیاب',
    heroEyebrow: 'السلام علیکم، میں ہوں',
    heroExploreCta: 'میرا کام دیکھیں',
    heroContactCta: 'رابطہ کریں',
    heroAiScopingCta: 'اے آئی مشیر',
    connectLabel: 'روابط:',
    aboutEyebrow: '// ۰۱. وژن اور کہانی',
    aboutTitle: 'پائیدار اور تیز رفتار ڈیجیٹل مصنوعات',
    aboutReadMore: 'مکمل تفصیلات پڑھیں',
    aboutShowLess: 'مختصر کریں',
    skillsEyebrow: '// ۰۲. مہارتیں اور ٹیک اسٹیک',
    skillsTitle: 'حقیقی انجینئرنگ اور جدید معمار',
    skillsSub: 'بغیر کسی فرضی اعداد و شمار کے، حقیقی پروجیکٹس کے تجربے پر مبنی مہارتیں۔',
    toolsTitle: 'بنیادی سافٹ ویئر اور فریم ورکس',
    projectsEyebrow: '// ۰۳. منتخب کردہ پورٹ فولیو',
    projectsTitle: 'کیس اسٹڈیز اور مکمل پروجیکٹس',
    projectsSub: 'تکنیکی مسائل، جدید حل اور قابل پیمائش نتائج کی تفصیلی روداد۔',
    allProjectsChip: 'تمام پروجیکٹس',
    searchPlaceholder: 'ٹولز یا عنوانات تلاش کریں...',
    caseStudyButton: 'کیس اسٹڈی دیکھیں',
    servicesEyebrow: '// ۰۴. ہماری خدمات',
    servicesTitle: 'ہائی امپیکٹ فل اسٹیک اور اے آئی حل',
    servicesSub: 'سسٹم آرکیٹیکچر سے لے کر پرفارمنس ٹیوننگ اور ماڈل انٹیگریشن تک۔',
    discussServiceButton: 'اس سروس پر گفتگو کریں',
    processStripEyebrow: 'کام کی تکمیل کا ۴ مرحلہ وار طریقہ کار',
    experienceEyebrow: '// ۰۵. پیشہ ورانہ سفر',
    experienceTitle: 'عملی تجربہ اور سنگ میل',
    downloadCvButton: 'سی وی (CV) ڈاؤن لوڈ کریں',
    testimonialsEyebrow: '// ۰۶. اعتماد اور سفارشات',
    testimonialsTitle: 'کلائنٹس اور تکنیکی شراکت داروں کی آراء',
    blogEyebrow: '// ۰۷. تکنیکی مضامین',
    blogTitle: 'آرکیٹیکچر نوٹس اور خیالات',
    blogSub: 'جدید لارج لینگویج ماڈلز اور فرنٹ اینڈ کارکردگی پر تجزیاتی مقالے۔',
    contactEyebrow: '// ۰۸. رابطہ قائم کریں',
    contactTitle: 'آئیے مل کر کچھ نیا تخلیق کریں',
    contactSub: 'نئے پروجیکٹ کے مشورے یا اے آئی سسٹمز کی تیاری کے لیے پیغام بھیجیں۔',
    contactSubmit: 'پیغام روانہ کریں',
    contactSending: 'روانہ کیا جا رہا ہے...',
    nameLabel: 'آپ کا نام *',
    emailLabel: 'ای میل ایڈریس *',
    serviceLabel: 'مطلوبہ سروس',
    budgetLabel: 'تخمینی بجٹ',
    timelineLabel: 'مطلوبہ دورانیہ',
    messageLabel: 'پروجیکٹ کی تفصیلات *',
    footerRights: 'تمام حقوق محفوظ ہیں۔',
    replayIntroButton: 'اے آئی انٹرو دوبارہ چلائیں',
    adminPortalLink: 'ایڈمن کنٹرول پینل',
  },
};

export type TranslationFunction = ((key: keyof Translations) => string) & Translations;

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationFunction;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (safeStorage.get(STORAGE_KEYS.LANG) as LanguageCode) || 'en';
  });

  const isRtl = language === 'ur';

  useEffect(() => {
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
    if (isRtl) {
      document.body.classList.add('font-urdu');
    } else {
      document.body.classList.remove('font-urdu');
    }
  }, [language, isRtl]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    safeStorage.set(STORAGE_KEYS.LANG, lang);
  };

  const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
  const tFn = (key: keyof Translations): string => {
    return dict[key] ?? TRANSLATIONS.en[key] ?? (key as string);
  };
  const t = Object.assign(tFn, dict) as TranslationFunction;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

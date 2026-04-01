/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Calendar, 
  Info, 
  Mail, 
  Globe, 
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Target,
  Zap,
  Shield,
  Languages,
  Briefcase,
  Newspaper,
  Presentation,
  Lock
} from 'lucide-react';
import teamData from './team.json';

// Import all images from src/assets
const images = import.meta.glob('./assets/*.{png,jpg,jpeg,svg,webp,avif}', { eager: true, query: '?url', import: 'default' });

const getImageUrl = (path: string) => {
  if (!path) return '';
  // If path is already a full URL, return it
  if (path.startsWith('http')) return path;
  
  // Convert absolute path like "/assets/img.png" to relative "./assets/img.png"
  const relativePath = path.startsWith('/') ? '.' + path : path;
  
  // Return the resolved Vite URL, or fallback to the original path (encoded for Chinese characters)
  return (images[relativePath] as string) || encodeURI(path);
};

// --- Translations ---

const translations = {
  zh: {
    nav: {
      about: '計畫介紹',
      team: '團隊介紹',
      recruitment: '徵聘資訊',
      news: '最新動態',
      conferences: '學術會議',
      privacy: '隱私權政策',
      join: '立即加入',
    },
    hero: {
      badge: '2026 年度重點計畫',
      title: '多階段模組化醫療視覺基礎模型',
      subtitle: 'Multistage Modular Medical Models',
      desc: '我們致力於透過創新的技術與跨領域的合作，解決當前最迫切的挑戰，為社會創造長遠的價值與影響力。',
      cta1: '了解更多計畫細節',
      cta2: '徵聘資訊',
    },
    about: {
      badge: '計畫介紹',
      title: '計畫簡介｜M4 模組化醫療視覺基礎模型計畫',
      desc: '本計畫以「超越 Scaling Law，以資料效率與可信賴性為核心」為研究主軸，致力於建立一套適用於醫療影像的模組化視覺基礎模型（M4, Modular Medical Foundation Models），回應真實醫療場域中資料稀缺、標註成本高與隱私限制等關鍵挑戰。\n\n傳統 AI 發展仰賴海量資料與模型規模擴張，但在醫療領域中，此路徑往往難以落實。本計畫採取「策略優於規模」的思維，結合自監督學習（Self-Supervised Learning）、多階段轉移學習（Multi-stage Transfer Learning）與任務導向微調（Task-specific Fine-Tuning），讓 AI 能在僅仰賴少量專家標註資料的情況下，逐步學習並建立具臨床價值的醫學語意理解能力。',
      sections: [
        { 
          id: 'background', 
          title: '一、背景與挑戰', 
          content: '**• 資料稀缺性 (Scarcity)**\n醫學標註資料少且昂貴，需要在少量標註下仍能穩定訓練與泛化。\n**• 領域差異 (Domain Shift)**\n跨院區／設備差異大，模型易因資料分佈不同而表現不一致。\n**• 適應性微調挑戰**\n已蒸餾的大模型再做延伸預訓練可能破壞既有通用表徵，adaption 不易完成。' 
        },
        { 
          id: 'goals', 
          title: '二、計畫目標與工作範疇', 
          content: '**• 延伸預訓練流程**\n建立適合蒸餾模型的延伸預訓練流程，提高 domain adaption 並降低退化風險。\n**• 少量標註訓練**\n建立少量標註訓練方法，提升少量標註下的訓練效率，利用中介相關微調，可改善結果。\n**• 跨院區驗證機制**\n建立跨院區驗證機制，導入 doctor-in-the-loop，支援臨床檢視與回饋迭代。' 
        },
        { 
          id: 'innovation', 
          title: '三、核心創新', 
          content: '**• DAP 醫療域適配**\n以自然影像大模型為基礎，採用蒸餾式延伸預訓練進行醫療領域強化，將通用影像表徵有效轉移到多種醫療模態。\n**• 少量標註及資料效率**\n面對標註資料有限的情境，採用中介微調與高效率適配策略，讓模型以較少標註即可達到穩定且具泛化的表現。\n**• 特徵融合與整體優化**\n融合 MAE Pixio 與 DINO 互補特徵，將各訓練模組串連進行整體優化，提升跨模態一致性與後續臨床驗證可用性' 
        },
        { 
          id: 'process', 
          title: '四、技術流程', 
          content: '**1. 自監督領域適配預訓練 (DAP)**\nPixio (MAE-style) × DINO (v3) | 三種模態：Fundus, Endoscopy, Echo\n\n**2. 中介監督微調 (Intermediate Supervised Fine-tuning)**\n針對 MAE Pixio 與 DINO 分別進行中介任務微調\n\n**3. 特徵融合 (Feature Fusion)**\n整合 MAE Pixio × DINO 形成單一融合模型\n\n**4. 端到端優化 (End-to-End Optimization)**\n整體模型優化，結合 Doctor-in-the-loop 驗證反饋' 
        },
        { 
          id: 'milestones', 
          title: '五、里程碑', 
          content: '我們設定了明確的發展藍圖，從基礎架構搭建到最終的跨院區臨床實測，確保計畫能按步就班地達成預期影響力。' 
        },
      ],
      exp: '年產業經驗',
      externalLink: '查看詳細計畫說明',
    },
    recruitment: {
      badge: '徵聘資訊',
      title: '加入我們的團隊',
      desc: '請自行點擊連結查閱最新徵聘資訊。',
      linkText: '查看最新徵聘資訊',
      url: 'https://www.cgu.edu.tw/aic/Subject?nodeId=12884',
      jobs: [],
    },
    news: {
      badge: '最新動態',
      title: '計畫最新消息',
      items: [],
    },
    conferences: {
      badge: '學術會議',
      title: '近期學術活動',
      officialSite: '前往會議官方網站',
      events: [
        { 
          date: '2025/12/9-2025/12/12', 
          title: '2025 ACML', 
          subtitle: 'The 17th Asian Conference on Machine Learning',
          loc: '台北 華南銀行國際會議中心', 
          desc: '第 17 屆亞洲機器學習會議 (ACML 2025) 旨在提供一個國際論壇，供研究人員討論機器學習領域的最新進展。',
          url: 'https://www.acml-conf.org/2025/index.htm' 
        },
        { 
          date: '2026/12/11', 
          title: '2026 醫療人工智慧論壇', 
          subtitle: '2026 Medical AI Forum',
          loc: '桃園', 
          desc: '本論壇將探討人工智慧在醫療領域的最新應用與未來趨勢，匯聚醫療與科技界的專家共同交流。',
        },
      ],
    },
    privacy: {
      badge: '隱私權政策',
      title: '您的隱私對我們至關重要',
      desc: '本計畫致力於保護您的個人資料。我們僅在必要時收集資訊，並確保其安全性。',
    },
    timeline: {
      badge: '執行進度',
      title: '計畫里程碑',
      steps: [
        { date: '第一年', title: '完成三種模態基礎預訓練模型與測試', desc: '公開釋出模型基準測試結果' },
        { date: '第二年', title: '建置 doctor-in-the-loop 原型系統', desc: '結合跨院區 pilot 測試，完成合規文件化與臨床驗證前準備報告' },
      ],
    },
    team: {
      badge: '團隊介紹',
      title: '核心執行團隊',
      roles: { lead: '計畫主持人', tech: '技術總監', ops: '營運經理', community: '社群推廣' },
    },
    partners: {
      title: '相關單位',
    },
    brand: {
      name: '計畫',
    },
    footer: {
      desc: '引領未來的創新計畫，致力於透過技術與合作創造社會價值。我們相信每一個小小的改變，都能匯聚成推動世界的巨大力量。',
      quickLinks: '快速連結',
      legal: '法律資訊',
      p1: '隱私權政策',
      p2: '服務條款',
      p3: 'Cookie 設定',
      rights: '© 2026 M4計畫. 版權所有。',
      contact: '聯絡方式',
      address: '單位位置：長庚大學管理大樓11樓\n　　　　　人工智慧研究中心',
      phone: '聯絡電話：886-3-2118800 ext 3003#53',
      email: '電子信箱：BettySu@cgu.edu.tw',
      updated: '最後更新時間：2026-03-31',
    },
  },
  en: {
    nav: {
      about: 'Project Intro',
      team: 'Team',
      recruitment: 'Recruitment',
      news: 'News',
      conferences: 'Conferences',
      privacy: 'Privacy',
      join: 'Join Now',
    },
    hero: {
      badge: '2026 Key Project',
      title: 'Multistage Modular Medical Models',
      subtitle: 'A Modular Foundation Model Framework for Medical Imaging',
      desc: 'We are committed to solving the most pressing challenges through innovative technology and cross-disciplinary collaboration, creating long-term value and impact for society.',
      cta1: 'Learn More Details',
      cta2: 'Recruitment',
    },
    about: {
      badge: 'Project Intro',
      title: 'Project Overview | M4 Modular Medical Foundation Models',
      desc: 'This project centers on "Beyond Scaling Law, with Data Efficiency and Trustworthiness at the Core," aiming to build a Modular Medical Foundation Model (M4) framework for medical imaging to address key challenges like data scarcity, high labeling costs, and privacy constraints in real clinical settings.\n\nTraditional AI development relies on massive data and model scaling, which is often impractical in medicine. This project adopts a "Strategy over Scale" mindset, combining Self-Supervised Learning, Multi-stage Transfer Learning, and Task-specific Fine-Tuning to enable AI to progressively learn and establish clinically valuable medical semantic understanding with minimal expert-labeled data.',
      sections: [
        { 
          id: 'background', 
          title: 'I. Background & Challenges', 
          content: '**• Scarcity**\nMedical labeled data is scarce and expensive; stable training and generalization are needed under limited labels.\n**• Domain Shift**\nLarge differences across hospitals/equipment cause inconsistent model performance due to varying data distributions.\n**• Adaptation Challenges**\nExtended pre-training on distilled large models may damage existing general representations, making adaptation difficult.' 
        },
        { 
          id: 'goals', 
          title: 'II. Project Goals & Scope', 
          content: '**• Extended Pre-training Workflow**\nEstablish workflows suitable for distilled models to improve domain adaptation and reduce degradation risks.\n**• Few-shot Training**\nDevelop few-shot training methods to enhance efficiency under limited labels, using intermediate relevant fine-tuning to improve results.\n**• Cross-hospital Validation**\nEstablish cross-hospital validation mechanisms, introducing doctor-in-the-loop to support clinical review and feedback iteration.' 
        },
        { 
          id: 'innovation', 
          title: 'III. Core Innovations', 
          content: '**• DAP Medical Domain Adaptation**\nBased on large natural image models, use distilled extended pre-training for medical domain enhancement, effectively transferring general image representations to multiple medical modalities.\n**• Few-shot & Data Efficiency**\nIn scenarios with limited labeled data, adopt intermediate fine-tuning and high-efficiency adaptation strategies to achieve stable and generalized performance with fewer labels.\n**• Feature Fusion & Global Optimization**\nFuse complementary features from MAE Pixio and DINO, connecting all training modules for global optimization to enhance cross-modal consistency and clinical usability.' 
        },
        { 
          id: 'process', 
          title: 'IV. Technical Process', 
          content: '**1. Self-Supervised Domain Adaptation Pre-training (DAP)**\nPixio (MAE-style) × DINO (v3) | Three modalities: Fundus, Endoscopy, Echo\n\n**2. Intermediate Supervised Fine-tuning**\nIntermediate task fine-tuning for MAE Pixio and DINO respectively.\n\n**3. Feature Fusion**\nIntegrate MAE Pixio × DINO into a single fused model.\n\n**4. End-to-End Optimization**\nGlobal model optimization combined with Doctor-in-the-loop validation feedback.' 
        },
        { 
          id: 'milestones', 
          title: 'V. Milestones', 
          content: 'We have set a clear roadmap, from infrastructure construction to final cross-hospital clinical trials, ensuring the project achieves its expected impact step by step.' 
        },
      ],
      exp: 'Years Experience',
      externalLink: 'View Detailed Project Description',
    },
    recruitment: {
      badge: 'Recruitment',
      title: 'Join Our Team',
      desc: 'Please click the link below to check the latest recruitment information.',
      linkText: 'View Latest Recruitment Info',
      url: 'https://www.cgu.edu.tw/aic/Subject?nodeId=12884',
      jobs: [],
    },
    news: {
      badge: 'News',
      title: 'Latest Updates',
      items: [],
    },
    conferences: {
      badge: 'Conferences',
      title: 'Upcoming Events',
      officialSite: 'Go to Official Conference Website',
      events: [
        { 
          date: '2025/12/9-2025/12/12', 
          title: '2025 ACML', 
          subtitle: 'The 17th Asian Conference on Machine Learning',
          loc: 'HNBK International Convention Center, Taipei', 
          desc: 'The 17th Asian Conference on Machine Learning (ACML 2025) aims to provide an international forum for researchers to discuss the latest advances in machine learning.',
          url: 'https://www.acml-conf.org/2025/index.htm' 
        },
        { 
          date: '2026/12/11', 
          title: '2026 Medical AI Forum', 
          subtitle: '2026 Medical AI Forum',
          loc: 'Taoyuan', 
          desc: 'This forum will explore the latest applications and future trends of artificial intelligence in the medical field, bringing together experts from the medical and technology sectors.',
        },
      ],
    },
    privacy: {
      badge: 'Privacy Policy',
      title: 'Your Privacy Matters',
      desc: 'We are committed to protecting your personal data. We only collect information when necessary.',
    },
    timeline: {
      badge: 'Progress',
      title: 'Project Milestones',
      steps: [
        { date: 'Year 1', title: 'Complete Base Pre-trained Models and Testing for Three Modalities', desc: 'Publicly release model benchmark results' },
        { date: 'Year 2', title: 'Build Doctor-in-the-loop Prototype System', desc: 'Combine with cross-hospital pilot testing, complete compliance documentation and pre-clinical validation preparation reports' },
      ],
    },
    team: {
      badge: 'Team',
      title: 'Core Execution Team',
      roles: { lead: 'Project Lead', tech: 'Tech Director', ops: 'Ops Manager', community: 'Community' },
    },
    partners: {
      title: 'Related Organizations',
    },
    brand: {
      name: 'Project',
    },
    footer: {
      desc: 'Leading the future innovation project, committed to creating social value through technology and collaboration.',
      quickLinks: 'Quick Links',
      legal: 'Legal',
      p1: 'Privacy Policy',
      p2: 'Terms of Service',
      p3: 'Cookie Settings',
      rights: '© 2026 M4 Project. All rights reserved.',
      contact: 'Contact Info',
      address: 'Address: 11F, Management Building, Chang Gung University,\n         AI Research Center',
      phone: 'Phone: 886-3-2118800 ext 3003#53',
      email: 'Email: BettySu@cgu.edu.tw',
      updated: 'Last Updated: 2026-03-27',
    },
  },
};

// --- Components ---

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Navbar = ({ lang, setLang, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.about, href: '/about' },
    { name: t.nav.team, href: '/team' },
    { name: t.nav.recruitment, href: '/recruitment' },
    { name: t.nav.news, href: '/news' },
    { name: t.nav.conferences, href: '/conferences' },
    { name: t.nav.privacy, href: '/privacy' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-50/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src={getImageUrl("/assets/M4_Logo.png")} 
            alt="M4 Logo" 
            className="h-10 w-auto transition-transform group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <span className={`text-xl font-bold tracking-tight text-slate-900`}>
            {t.brand.name}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            link.href.startsWith('http') ? (
              <a 
                key={link.name} 
                href={link.href} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium transition-colors text-slate-600 hover:text-blue-600"
              >
                {link.name}
              </a>
            ) : (
              <Link 
                key={link.name} 
                to={link.href} 
                className={`text-sm font-medium transition-colors ${location.pathname === link.href ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
              >
                {link.name}
              </Link>
            )
          ))}
          
          {/* Language Switcher */}
          <button 
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors bg-slate-100/50 px-3 py-1.5 rounded-lg"
          >
            <Languages size={16} />
            {lang === 'zh' ? 'EN' : '中文'}
          </button>

          <Link to="/" className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
            {t.nav.join}
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button 
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            className="text-sm font-bold text-blue-600"
          >
            {lang === 'zh' ? 'EN' : '中文'}
          </button>
          <button className="text-slate-900" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-50 border-t border-slate-100 overflow-hidden"
          >
          <div className="flex flex-col p-6 gap-4 bg-slate-50">
              {navLinks.map((link) => (
                link.href.startsWith('http') ? (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-medium text-slate-600"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link 
                    key={link.name} 
                    to={link.href} 
                    className={`text-base font-medium ${location.pathname === link.href ? 'text-blue-600' : 'text-slate-600'}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                )
              ))}
              <Link 
                to="/" 
                className="bg-blue-600 text-white px-5 py-3 rounded-xl text-center font-semibold"
                onClick={() => setIsOpen(false)}
              >
                {t.nav.join}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ t, lang }) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-50 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-wider uppercase mb-6">
            {t.hero.badge}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-8 leading-tight">
            <span className="block mb-4">{t.hero.title}</span>
            <span className="block text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500">
              {t.hero.subtitle}
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
            {t.hero.desc}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/about" className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group">
              {t.hero.cta1}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/recruitment" className="w-full sm:w-auto bg-slate-50 text-slate-900 border border-slate-200 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-100 transition-all text-center">
              {t.hero.cta2}
            </Link>
          </div>
        </motion.div>
      </div>
      <div className="mt-20">
        <Flowchart t={t} lang={lang} />
      </div>
    </section>
  );
};

const renderBoldText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const About = ({ t, lang }) => {
  const [activeTab, setActiveTab] = useState(0);
  const sections = t.about.sections;

  const nextTab = () => {
    if (activeTab < sections.length - 1) {
      setActiveTab(activeTab + 1);
    }
  };

  const prevTab = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  return (
    <section id="about" className="py-32 bg-slate-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Project Overview */}
        <div className="text-left max-w-4xl mb-16">
          <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">{t.about.badge}</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-4 mb-8">{t.about.title}</h2>
          <p className="text-xl text-slate-600 leading-relaxed whitespace-pre-wrap">
            {t.about.desc}
          </p>
        </div>

        {/* Pagination Tabs */}
        <div className="flex flex-wrap gap-3 mb-12 border-b border-slate-200 pb-6">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(index)}
              className={`px-5 py-3 rounded-2xl font-bold transition-all text-sm md:text-base border-2 ${
                activeTab === index 
                ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100' 
                : 'text-slate-500 border-transparent hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              {section.title.includes('、') ? section.title.split('、')[1] : section.title.includes('. ') ? section.title.split('. ')[1] : section.title}
            </button>
          ))}
        </div>

        {/* Paginated Content */}
        <div className="min-h-[500px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <div className="flex flex-col lg:flex-row gap-12 items-start">
                <div className="lg:w-1/3 text-left">
                  <h3 className="text-3xl font-bold text-blue-600">
                    {sections[activeTab].title}
                  </h3>
                  <p className="text-slate-500 mt-4 text-sm font-medium uppercase tracking-wider">
                    Section {activeTab + 1} of {sections.length}
                  </p>
                </div>
                <div className="lg:w-2/3 w-full text-left">
                  <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-blue-50">
                    <div className="text-lg text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {renderBoldText(sections[activeTab].content)}
                    </div>
                    
                    {/* Special handling for Milestones (Section V) */}
                    {sections[activeTab].id === 'milestones' && (
                      <div className="mt-12 space-y-8 relative">
                        <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-100" />
                        {t.timeline.steps.map((step, i) => (
                          <div key={i} className="flex gap-6 relative">
                            <div className="w-8 h-8 rounded-full bg-blue-600 border-4 border-white shadow-lg flex items-center justify-center text-white shrink-0 z-10">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-50 animate-pulse" />
                            </div>
                            <div>
                              <span className="text-blue-600 font-bold text-sm tracking-wider uppercase">{step.date}</span>
                              <h4 className="text-xl font-bold text-slate-900 mt-1 mb-2">{step.title}</h4>
                              <p className="text-slate-600">{step.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
                      <button
                        onClick={prevTab}
                        disabled={activeTab === 0}
                        className={`flex items-center gap-2 font-bold transition-all ${
                          activeTab === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:text-blue-600'
                        }`}
                      >
                        <ChevronRight className="rotate-180" size={20} />
                        {lang === 'zh' ? '上一節' : 'Previous'}
                      </button>
                      
                      <div className="flex gap-2">
                        {sections.map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-2 h-2 rounded-full transition-all ${activeTab === i ? 'bg-blue-600 w-6' : 'bg-slate-200'}`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={nextTab}
                        disabled={activeTab === sections.length - 1}
                        className={`flex items-center gap-2 font-bold transition-all ${
                          activeTab === sections.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:text-blue-600'
                        }`}
                      >
                        {lang === 'zh' ? '下一節' : 'Next'}
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <Flowchart t={t} lang={lang} />

        {/* External Link */}
        <div className="mt-24 text-center">
          <a 
            href="https://www.twaicoe.org/medical-model-beyond-scaling-a-modular-foundation-model-framework-for-data-efficient-and-trustworthy-medical-imaging-cn" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100 group text-lg"
          >
            {t.about.externalLink}
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

const Recruitment = ({ t, lang }) => {
  return (
    <section id="recruitment" className="py-32 bg-blue-50/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">{t.recruitment.badge}</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-4">{t.recruitment.title}</h2>
          <p className="text-lg text-slate-600 mt-4">{t.recruitment.desc}</p>
          
          <div className="mt-12">
            <a 
              href={t.recruitment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 group"
            >
              {t.recruitment.linkText}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
        
        {t.recruitment.jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.recruitment.jobs.map((job, i) => (
              <div key={i} className="bg-blue-50/50 p-8 rounded-3xl shadow-lg border border-blue-100 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                    <Briefcase size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{job.title}</h3>
                  <div className="flex gap-4 text-sm text-slate-500 mb-6">
                    <span className="bg-slate-100 px-2 py-1 rounded">{job.type}</span>
                    <span className="bg-slate-100 px-2 py-1 rounded">{job.loc}</span>
                  </div>
                </div>
                <button className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                  {lang === 'zh' ? '立即申請' : 'Apply Now'} <ArrowRight size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const News = ({ t }) => {
  return (
    <section id="news" className="py-32 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">{t.news.badge}</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-4">{t.news.title}</h2>
        </div>
        <div className="space-y-8">
          {t.news.items.map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-8 p-8 rounded-3xl bg-slate-50 border border-slate-100 items-start">
              <div className="text-blue-600 font-bold text-lg whitespace-nowrap">{item.date}</div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Conferences = ({ t, lang }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <section id="conferences" className="py-32 bg-blue-50/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">{t.conferences.badge}</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-4">{t.conferences.title}</h2>
        </div>

        {selectedEvent ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto bg-blue-50/50 p-12 rounded-3xl shadow-xl border border-blue-100"
          >
            <button 
              onClick={() => setSelectedEvent(null)}
              className="mb-8 text-blue-600 font-bold flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
            >
              <ArrowRight size={20} className="rotate-180" />
              {lang === 'zh' ? '返回列表' : 'Back to List'}
            </button>
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center shrink-0 shadow-lg">
                <Presentation size={48} />
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-indigo-600 mb-2">{selectedEvent.date}</div>
                <h3 className="text-3xl font-bold text-slate-900 mb-2">{selectedEvent.title}</h3>
                {selectedEvent.subtitle && <div className="text-xl font-medium text-slate-600 mb-4 italic">{selectedEvent.subtitle}</div>}
                <div className="text-slate-500 mb-8 flex items-center gap-2">
                  <Target size={18} />
                  {selectedEvent.loc}
                </div>
                <div className="prose prose-slate max-w-none mb-10">
                  <p className="text-lg text-slate-700 leading-relaxed">
                    {selectedEvent.desc}
                  </p>
                </div>
                {selectedEvent.url && (
                  <a 
                    href={selectedEvent.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 group"
                  >
                    {t.conferences.officialSite}
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {t.conferences.events.map((event, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedEvent(event)}
                className="text-left bg-blue-50/50 p-8 rounded-3xl shadow-lg border border-blue-100 flex gap-6 items-center h-full transition-all hover:shadow-xl hover:border-blue-200 group"
              >
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <Presentation size={32} />
                </div>
                <div>
                  <div className="text-sm font-bold text-indigo-600 mb-1 group-hover:text-blue-600 transition-colors">{event.date}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{event.title}</h3>
                  {event.subtitle && <div className="text-sm font-medium text-slate-600 mb-2 italic">{event.subtitle}</div>}
                  <div className="text-sm text-slate-500">{event.loc}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const Privacy = ({ t, lang }) => {
  return (
    <section id="privacy" className="py-32 bg-slate-50/50">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <Lock size={40} />
        </div>
        <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm">{t.privacy.badge}</span>
        <h2 className="text-4xl font-bold text-slate-900 mt-4 mb-6">{t.privacy.title}</h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          {t.privacy.desc}
        </p>
        <button className="mt-10 text-blue-600 font-bold underline underline-offset-8">
          {lang === 'zh' ? '閱讀完整政策文件' : 'Read Full Policy Document'}
        </button>
      </div>
    </section>
  );
};

const Team = ({ t, lang }) => {
  return (
    <section id="team" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <span className="text-blue-700 font-bold tracking-widest uppercase text-sm">{t.team.badge}</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-4">{t.team.title}</h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {teamData.map((member, i) => {
            const name = lang === 'en' ? member.nameEn : member.name;
            const title = lang === 'en' ? member.titleEn : member.title;
            const expertise = lang === 'en' ? member.expertiseEn : member.expertise;

            return (
              <div key={i} className="flex flex-col items-center text-center group">
                {/* Smaller, cleaner image */}
                <div className="w-32 h-32 rounded-full overflow-hidden mb-8 ring-8 ring-slate-50 group-hover:ring-blue-50 transition-all duration-500 shadow-xl">
                  <img 
                    src={getImageUrl(member.img)} 
                    alt={name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Prominent Name */}
                <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">{name}</h3>
                
                {/* Prominent Title - Darker and larger */}
                <p className="text-blue-700 font-bold text-base mb-4 leading-relaxed max-w-[280px]">
                  {title}
                </p>

                {/* Links */}
                <div className="flex gap-4 mb-4">
                  {member.website && (
                    <a 
                      href={member.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                      title="Website"
                    >
                      <Globe size={20} />
                    </a>
                  )}
                  {member.email && (
                    <a 
                      href={`mailto:${member.email}`} 
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                      title="Email"
                    >
                      <Mail size={20} />
                    </a>
                  )}
                </div>

                {/* Expertise - Clearer and darker */}
                <div className="w-full pt-2 border-t border-slate-100">
                  <p className="text-slate-800 text-sm font-medium leading-loose px-4">
                    {expertise.join(' • ')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Flowchart = ({ t, lang, src = "/assets/pipeline.png", title = "Overall Technical Pipeline" }) => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">{lang === 'zh' ? '技術架構' : 'Technical Architecture'}</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-4">{title || 'Overall Technical Pipeline'}</h2>
        </div>
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-50 p-4 md:p-8">
          <img 
            src={getImageUrl(src || "/assets/pipeline.png")} 
            alt={title || "Overall Technical Pipeline"} 
            className="w-full h-auto rounded-2xl"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://picsum.photos/seed/technical-pipeline/1600/900";
            }}
          />
          <div className="mt-8 text-center text-slate-500 text-sm italic">
            {lang === 'zh' ? '* 流程圖：Overall Technical Pipeline' : '* Flowchart: Overall Technical Pipeline'}
          </div>
        </div>
      </div>
    </section>
  );
};

const Partners = ({ t }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const partners = [
    { name: 'National Science and Technology Council', logo: '/assets/NSTC_Logo.png' },
    { name: 'Chang Gung University', logo: '/assets/CGU_Logo.svg' },
    { name: 'Artificial Intelligence Research Center', logo: '/assets/logo-ai-res.png.png' },
    { name: 'Taiwan AI Center of Excellence', logo: '/assets/logo-ai-coe.png.png' },
    { name: 'College of Intelligent Computing', logo: '/assets/logo-ai-coc.png.jpeg' },
    { name: 'Department of Artificial Intelligence', logo: '/assets/logo-ai-dai.png.png' },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth / 2;
      const scrollTo = direction === 'left' 
        ? scrollLeft - scrollAmount 
        : scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">
          {t.partners.title}
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide gap-8 pb-4 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {partners.map((partner, i) => (
            <div key={i} className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-500 opacity-60 hover:opacity-100 cursor-pointer">
              <div className="h-24 flex items-center justify-center">
                <div className="w-56 h-16 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden">
                   <img 
                    src={getImageUrl(partner.logo)} 
                    alt={partner.name} 
                    className="w-full h-full object-contain p-3"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${partner.name}/400/150`;
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = ({ t }) => {
  return (
    <footer className="bg-slate-50 text-slate-600 py-16 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={getImageUrl("/assets/M4_Logo.png")} 
                alt="M4 Logo" 
                className="h-12 w-auto"
                referrerPolicy="no-referrer"
              />
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                {t.brand.name}
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed text-sm max-w-xs">
              {t.footer.desc}
            </p>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-slate-900 font-bold mb-6 text-sm uppercase tracking-wider">{t.footer.quickLinks}</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="hover:text-blue-600 transition-colors">{t.nav.about}</Link></li>
              <li><Link to="/team" className="hover:text-blue-600 transition-colors">{t.nav.team}</Link></li>
              <li><Link to="/recruitment" className="hover:text-blue-600 transition-colors">{t.nav.recruitment}</Link></li>
              <li><Link to="/news" className="hover:text-blue-600 transition-colors">{t.nav.news}</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-slate-900 font-bold mb-6 text-sm uppercase tracking-wider">{t.footer.legal}</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/privacy" className="hover:text-blue-600 transition-colors">{t.footer.p1}</Link></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">{t.footer.p2}</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">{t.footer.p3}</a></li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <h4 className="text-slate-900 font-bold mb-6 text-sm uppercase tracking-wider">{t.footer.contact}</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Target size={16} />
                </div>
                <span className="whitespace-pre-wrap text-slate-600">{t.footer.address}</span>
              </li>
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Mail size={16} />
                </div>
                <span className="text-slate-600">{t.footer.email}</span>
              </li>
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Info size={16} />
                </div>
                <span className="font-medium text-slate-600">{t.footer.phone}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-medium">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <p className="text-slate-500">{t.footer.rights}</p>
            <span className="hidden md:inline text-slate-200">|</span>
            <p className="text-slate-400">{t.footer.updated}</p>
          </div>
          <div className="flex gap-6">
            {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map(social => (
              <a key={social} href="#" className="text-slate-400 hover:text-blue-600 transition-colors font-bold uppercase tracking-widest text-[10px]">{social}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [lang, setLang] = useState('zh');
  const t = translations[lang];

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50/50 font-sans selection:bg-blue-100 selection:text-blue-900">
        <Navbar lang={lang} setLang={setLang} t={t} />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero t={t} lang={lang} />
                <Recruitment t={t} lang={lang} />
              </>
            } />
            <Route path="/about" element={<About t={t} lang={lang} />} />
            <Route path="/team" element={<Team t={t} lang={lang} />} />
            <Route path="/recruitment" element={<Recruitment t={t} lang={lang} />} />
            <Route path="/news" element={<News t={t} />} />
            <Route path="/conferences" element={<Conferences t={t} lang={lang} />} />
            <Route path="/privacy" element={<Privacy t={t} lang={lang} />} />
          </Routes>
        </main>
        <Partners t={t} />
        <Footer t={t} />
      </div>
    </BrowserRouter>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
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
  Lock,
  ExternalLink,
  Clock,
  MapPin
} from 'lucide-react';
import teamData from './team.json';
import enData from './en.json';

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
      about: '計畫內容',
      team: '團隊介紹',
      recruitment: '徵聘資訊',
      news: '活動訊息',
      science: 'AI新知',
      conferences: '學術會議',
      privacy: '隱私權政策',
      join: '計畫詳情',
    },
    hero: {
      badge: 'AICoE主題研究計畫',
      title: '多階段模組化醫療視覺基礎模型',
      subtitle: 'Multistage Modular Medical Models',
      desc: 'M4 計畫透過 AI 視覺流水線推進智慧醫療。模型從自然影像學習視覺特徵，經多模態醫學影像建立基礎，最後在醫師導引下微調為專科模型。本計畫在確保數據隱私下，開發臨床輔助工具以落實精準醫療。',
      cta1: '了解更多計畫細節',
      cta2: '徵聘資訊',
    },
    infographic: {
      badge: '核心技術',
      title: '技術亮點',
      desc: '透過 M4 MEDCLAW 平台，我們希望打破醫療 AI 開發的高牆，讓各級醫院都能自主打造精準的醫療大模型。',
      image: 'assets/打破醫療 AI開發高牆.webp',
      cards: [
        { title: '技術亮點', desc: '強大的病灶特徵提取能力與無需專家即可適配的自動化微調技術。' },
        { title: 'M4 MEDCLAW', desc: 'Agent 輔助之醫院自主醫療影像基礎模型微調平台。' },
        { title: '產業應用性', desc: '自主資料專屬模型生成、臨床決策輔助與經濟效益提升。' }
      ]
    },
    about: {
      badge: '計畫內容',
      title: '計畫說明｜M4 模組化醫療視覺基礎模型計畫',
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
      linkText: '查看更多徵聘資訊',
      url: 'https://www.cgu.edu.tw/aic/Subject?nodeId=12884',
      jobs: [
        {
          date: '2026/05/10',
          title: '【徵聘訊息】長庚大學人工智慧研究中心 徵國科會計畫學/碩士級專任助理各一名',
          url: 'https://www.cgu.edu.tw/aic/Subject/Detail/77537?nodeId=12884'
        },
        {
          date: '2026/04/15',
          title: '【徵聘訊息】長庚大學「人工智慧研究中心」誠徵研究員/副研究員/助理研究員二名',
          url: 'https://www.cgu.edu.tw/aic/Subject/Detail/43283?nodeId=12884'
        },
        {
          date: '2026/05/01',
          title: '【徵聘訊息】 人工智慧研究中心誠徵博士級專任計畫助理',
          url: 'https://www.cgu.edu.tw/aic/Subject/Detail/43284?nodeId=12884'
        }
      ],
    },
    news: {
      badge: '活動訊息',
      title: '最新消息',
      items: [
        {
          date: '2026/05/28',
          time: '12:30 - 13:30',
          location: '長庚大學管理大樓11樓-AI講堂',
          title: '【學術演講】Macrophages, Chronic Diseases and Aging',
          desc: '講者：Prof. Jianzhu Chen 現任麻省理工學院生物學系教授',
          link: 'https://www.cgu.edu.tw/coic/Subject/Detail/77751?nodeId=16993'
        },
        {
          date: '2026/05/18',
          time: ' 14:00 - 16:00',
          location: '長庚大學管理大樓11樓-AI講堂',
          title: '【學術演講】數位轉型：大數據與人工智慧引領的臨床試驗變革',
          desc: '講者：林士睿博士 美國Stanford 大學生物醫學資訊博士',
          link: 'https://www.cgu.edu.tw/aic/Subject/Detail/76975?nodeId=7144'
        },
        {
          date: '2026/05/18',
          time: '15:00 - 17:00',
          location: '長庚大學管理大樓11樓-AI講堂',
          title: "【學術演講】Hiding a Swarm's Leader from RL Agent and Human. AI Safety in the Information and Physical Space",
          desc: '講者：Prof. Michael Lewis 美國匹茲堡大學（University of Pittsburgh）資訊學院教授/Prof. Katia Sycara 美國卡內基美隆大學（CMU）機器人研究所資深研究教授，現任機器人研究所副主任，並擔任可信任人機協作研究中心主任。',
          link: 'https://www.cgu.edu.tw/aic/Subject/Detail/76978?nodeId=7144'
        },
        {
          date: '2026/05/20',
          time: '12:10 - 13:30',
          location: '長庚大學未來教室（管理大樓9樓）',
          title: '【學術演講】ZotDance - an AI-powered open platform for Dancer Training and Beyond',
          desc: '講者：加州大學爾灣分校電機工程與計算機學系 Quoc-Viet Dang 教學副教授',
          link: 'https://www.cgu.edu.tw/aic/Subject/Detail/77265?nodeId=7144'
        }
      ],
    },
    science: {
      badge: 'AI新知',
      title: '人工智慧技術於醫療之研究、實作與未來',
      desc: '探索全球醫療人工智慧領域的最新研究成果與技術趨勢。',
      items: [
        {
          date: '2026/05/08',
          title: 'AI醫療市場規模爆發式成長 5大應用範圍成未來發展重點',
          author: '記者彭夢竺／台北報導',
          source: '科技島',
          desc: 'AI醫療正逐漸改變傳統醫療模式，成為未來醫療發展的重要方向。',
          url: 'https://www.technice.com.tw/issues/ai/172553/'
        },
        {
          date: '2026/04/22',
          title: 'AI病理診斷：從技術到臨床的革命性突破',
          author: '口述／雲象科技創辦人暨執行長葉肇元　整理／賴宛靖',
          source: '工研院產業學院',
          desc: '利用AI奠定病理診斷新里程碑 當醫師的第二雙眼睛',
          url: 'https://college.itri.org.tw/Info/InfoData/d749e033-cc83-402d-a0e9-4f46db89af5f'
        },
        {
          date: '2026/03/15',
          title: '智慧醫材結合AI應用新趨勢',
          author: '撰文／羅倩宜',
          source: '工業技術與資訊月刊',
          desc: '高階醫療從醫院走向鄰近病患的定點醫療 生成式AI開始在醫療應用萌芽',
          url: 'https://www.itri.org.tw/ListStyle.aspx?DisplayStyle=18_content&SiteID=1&MmmID=1036452026061075714&MGID=1253016311517010576'
        },
        {
          date: '2026/02/10',
          title: '生成式 AI 正如何在全球各醫療場域，提升醫護工作效率與照護品質？',
          author: '黃怡婷 科技大觀園特約編輯',
          source: '國家科學及技術委員會科技大觀園',
          desc: '生成式 AI 正在提升醫療工作效能 生成式 AI 應用在醫療領域的重要前提',
          url: 'https://scitechvista.nat.gov.tw/Article/C000003/detail?ID=bfae4816-f4ee-4a5f-9d57-1fe964c65ad5'
        },
        {
          date: '2026/01/05',
          title: 'AI幫助乳房癌症攝影篩檢，助醫師工作量減半',
          author: 'Hannah',
          source: 'AI郵報',
          desc: '改善篩檢效率並解決放射科醫師短缺等問題',
          url: 'https://reurl.cc/mpMkXG'
        }
      ]
    },
    conferences: {
      badge: '學術會議',
      title: '學術活動回顧與預告',
      upcoming: '即將到來',
      past: '歷屆會議',
      officialSite: '前往會議官方網站',
      events: [
        {
          date: '2026/06/20',
          title: '2026 醫療人工智慧論壇',
          subtitle: '2026 Medical AI Forum',
          loc: '桃園',
          desc: '本論壇將探討人工智慧在醫療領域的最新應用與未來趨勢，匯聚醫療與科技界的專家共同交流。（網頁正在建構中）',
          img: 'assets/acml2025_2.webp',
          isUpcoming: true
        },
        {
          date: '2026/06/09-2026/06/12',
          title: '2026 ACML',
          subtitle: 'The 18th Asian Conference on Machine Learning',
          loc: '台北 華南銀行國際會議中心',
          desc: '第 17 屆亞洲機器學習會議 (ACML 2026) 旨在提供一個國際論壇，供研究人員討論機器學習領域的最新進展。',
          url: 'https://sites.google.com/view/acml-2025-medical-ai-forum/home',
          img: 'assets/ACML2025.webp',
          isUpcoming: false,
          gallery: [
            'assets/acml2025_1.webp', // 請替換為您的圖片檔名 1
            'assets/acml2025_2.webp', // 請替換為您的圖片檔名 2
            'assets/acml2025_3.webp', // 請替換為您的圖片檔名 3
            'assets/acml2025_4.webp', // 請替換為您的圖片檔名 4
            'assets/acml2025_5.webp', // 請替換為您的圖片檔名 5
            'assets/acml2025_6.webp'  // 請替換為您的圖片檔名 6
          ]
        },
      ],
    },
    privacy: {
      badge: '隱私權政策',
      title: '您的隱私對我們至關重要',
      desc: '本計畫致力於保護您的個人資料。我們僅在必要時收集資訊，並確保其安全性。',
      fullPolicy: '長庚大學 M4 計畫 （M4 Project）網站隱私權政策\n歡迎訪問長庚大學人工智慧研究中心 M4 計畫官方網站（以下簡稱「本網站」）。本計畫由長庚大學人工智慧研究中心相關研究單位共同執行（以下簡稱「本計畫團隊」）。為了保障您的隱私權及協助您瞭解本網站如何蒐集、處理及利用您的個人資料，請詳閱以下政策說明：\n\n一、政策適用範圍\n本政策適用於您在瀏覽本網站、使用本網站線上服務、或參與本計畫相關線上活動時所涉及的個人資料。本政策不適用於本網站所連結之第三方網站，亦不適用於非本計畫團隊所聘僱或管理之人員。\n\n二、個人資料之蒐集方式與目的\n網站瀏覽紀錄： 當您瀏覽本網站時，伺服器會自動產生相關日誌 （Log），包括您的 IP 位址、使用時間、瀏覽器類型及點選紀錄。這些資料主要用於本計畫之網站流量分析與系統改進，不會與特定個人進行比對。\n\n聯絡與諮詢： 若您透過網站表單或電子郵件與本計畫聯繫，我們將蒐集您的姓名、電子郵件及通訊內容，僅用於回覆您的詢問或提供計畫相關資訊。\n\n計畫特定數據處理： * M4 計畫涉及之醫療影像、臨床數據或 AI 模型訓練資料，均嚴格遵守人體試驗委員會 （IRB）之規範。\n\n本網站展示之所有研究數據與影像均經過去識別化（De-identification）處理，確保無法識別特定自然人。\n\n三、資料保護與安全措施\n本網站主機設有防火牆、防毒系統及各項資訊安全防護措施，以確保您的資料與本計畫研究數據的安全。\n\n僅限本計畫授權之核心研究人員能接觸相關資料，所有人員均簽署保密協議，如有違規將負相關法律及行政責任。\n\n四、與第三人共用資料之規範\n本計畫團隊絕不會向其他個人、團體或私人企業提供、交換或出售您的個人資料。但以下情形除外：\n\n經由您書面同意或主動授權。\n\n配合司法機關或監管機構依法進行之調查。\n\n為學術研究之目的，且資料已處理至無法辨識特定當事人（符合個資法第 6 條及第 15 條之學術例外規定）。\n\n五、Cookie 之技術運用\n本網站會使用 Cookie 技術以提供更便捷的瀏覽體驗。您可以透過瀏覽器設定拒絕 Cookie 的存取，但這可能導致網站部分功能無法正常運作。\n\n六、計畫參與者之權利\n依據台灣《個人資料保護法》，您針對本計畫所蒐集之您的個資，享有查詢、閱覽、製給複製本、補充、更正、停止蒐集處理利用或要求刪除之權利。若有相關需求，請透過本計畫官方聯絡管道與我們聯繫。\n\n七、隱私權政策之修正\n因應法令變動或本計畫發展需求，本隱私權政策將不定期修訂，修訂後之條款將立即公告於本網站，不另行個別通知。\n\n八、聯繫我們\n若您對 M4 計畫的隱私權政策或資料處理有任何疑問，請聯繫：\n\n計畫名稱： 長庚大學 人工智慧研究中心 M4 計畫 （M4 Project）\n\n執行單位： 長庚大學 人工智慧研究中心\n\n官方網址： https://m4.cgu.edu.tw/'
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
      name: '智慧醫療影像',
    },
    footer: {
      desc: '引領未來的創新計畫，致力於透過技術與合作創造社會價值。我們相信每一個小小的改變，都能匯聚成推動世界的巨大力量。',
      quickLinks: '快速連結',
      legal: '法律資訊',
      p1: '隱私權政策',
      rights: '© 2026 長庚大學人工智慧研究中心. 版權所有。',
      contact: '聯絡方式',
      address: '單位位置：長庚大學管理大樓11樓\n　　　　　人工智慧研究中心',
      phone: '聯絡電話：886-3-2118800 ext 3003#53',
      email: '電子信箱：bettysu@cgu.edu.tw',
      updated: '最後更新時間：2026-05-14',
      externalWarning: '點擊連結後將前往外部網站',
    },
  },
  en: enData,
};

// --- Components ---

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

const NavDropdown = ({ link, location, t }: { link: any, location: any, t: any, key?: any }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={link.href}
        className={`text-sm font-medium transition-colors flex items-center gap-1 py-2 ${location.pathname === link.href ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
          }`}
      >
        {link.name}
        {link.subItems && (
          <ChevronRight size={12} className={`transition-transform duration-200 ${isHovered ? 'rotate-90' : ''}`} />
        )}
      </Link>

      <AnimatePresence>
        {isHovered && link.subItems && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 pt-2 w-64 z-50"
          >
            <div className="bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden py-3 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />
              {link.subItems.map((sub, idx) => (
                <Link
                  key={idx}
                  to={sub.href}
                  className="block px-5 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors border-l-4 border-transparent hover:border-blue-600 font-medium"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = ({ lang, setLang, t }: { lang: string, setLang: any, t: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: any[] = [
    {
      name: t.nav.about,
      href: '/about',
    },
    {
      name: t.nav.team,
      href: '/team',
    },
    {
      name: t.nav.recruitment,
      href: '/recruitment'
    },
    {
      name: t.nav.conferences,
      href: '/conferences',
    },
    {
      name: t.nav.science,
      href: '/science'
    },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-50/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={getImageUrl("/assets/M4_Logo.webp")}
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
                title={t.footer.externalWarning}
              >
                {link.name}
              </a>
            ) : (
              <NavDropdown key={link.name} link={link} location={location} t={t} />
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
                <div key={link.name} className="flex flex-col gap-2">
                  {link.href.startsWith('http') ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-bold text-slate-900 flex items-center justify-between"
                      onClick={() => setIsOpen(false)}
                      title={t.footer.externalWarning}
                    >
                      {link.name}
                      <ArrowRight size={16} className="text-slate-400" />
                    </a>
                  ) : (
                    <>
                      <Link
                        to={link.href}
                        className={`text-base font-bold flex items-center justify-between ${location.pathname === link.href ? 'text-blue-600' : 'text-slate-900'}`}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                        <ChevronRight size={16} className="text-slate-400" />
                      </Link>
                      {link.subItems && (
                        <div className="pl-4 flex flex-col gap-2 border-l-2 border-slate-100 ml-1">
                          {link.subItems.map((sub, idx) => (
                            <Link
                              key={idx}
                              to={sub.href}
                              className="text-sm font-medium text-slate-500 hover:text-blue-600 py-1"
                              onClick={() => setIsOpen(false)}
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ t, lang }) => {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden min-h-[80vh] flex flex-col justify-center">
      {/* Background Image - 請將主視覺圖片命名為 main-visual.webp 並放置於 public/assets/ 資料夾下 */}
      <div className="fixed top-[80px] left-0 right-0 bottom-0 -z-20 pointer-events-none flex items-center justify-center">
        <img 
          src={getImageUrl("/assets/main-visual.webp")} 
          alt="Main Visual Background" 
          className="w-full h-full object-cover object-top"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Placeholder fallback if image is not found
            (e.target as HTMLImageElement).src = "https://picsum.photos/seed/hero-fallback/1920/1080";
          }}
        />
      </div>

      {/* Background Accents (Keep for subtle color pop) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 mix-blend-multiply pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-100 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-2 px-6 rounded-full bg-white/90 shadow-sm border border-indigo-50 text-indigo-600 text-base md:text-xl font-bold tracking-widest mb-4 backdrop-blur-md">
            {t.hero.badge}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-8 [text-shadow:_2px_2px_0_#fff,_-2px_-2px_0_#fff,_2px_-2px_0_#fff,_-2px_2px_0_#fff,_0_2px_0_#fff,_2px_0_0_#fff,_0_-2px_0_#fff,_-2px_0_0_#fff,_0_8px_16px_rgba(0,0,0,0.1)]">
            <span className="block mb-4">{t.hero.title}</span>
            <span className="inline-block text-xl sm:text-2xl md:text-3xl lg:text-3xl text-blue-800 leading-relaxed">
              {t.hero.subtitle}
            </span>
          </h1>
          <p className="max-w-6xl text-lg md:text-xl text-slate-900 font-bold leading-relaxed bg-white/60 p-6 rounded-2xl backdrop-blur-sm border border-white/60 shadow-sm">
            {t.hero.desc}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const ActivityNewsPreview = ({ t, lang }) => {
  return (
    <section className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block py-1 px-4 rounded-full bg-blue-50 text-blue-600 text-sm font-bold tracking-wider uppercase mb-4">
                {t.news.badge}
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                {t.news.title}
              </h2>
            </motion.div>
          </div>
          <Link 
            to="/news" 
            className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
          >
            {lang === 'zh' ? '更多訊息' : 'More News'} <ArrowRight size={20} />
          </Link>
        </div>

        {t.news.items.length > 0 ? (
          <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl shadow-blue-50/50 border border-blue-100 overflow-hidden">
            <div className="grid grid-cols-1 divide-y divide-slate-100">
              <div className="bg-slate-50 px-8 py-4 grid grid-cols-12 gap-4 text-sm font-bold text-slate-500 uppercase tracking-wider">
                <div className="col-span-2">{lang === 'zh' ? '日期' : 'Date'}</div>
                <div className="col-span-10">{lang === 'zh' ? '活動主題與詳情' : 'Activity Details'}</div>
              </div>
              {[...t.news.items]
                .sort((a, b) => b.date.localeCompare(a.date))
                .slice(0, 5)
                .map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    {item.link && item.link !== '#' ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-6 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 hover:bg-blue-50/50 transition-all group items-start"
                      >
                        <div className="md:col-span-3 flex flex-col gap-1 md:gap-2">
                          <div className="text-slate-900 font-bold text-sm md:text-base whitespace-nowrap">{item.date}</div>
                          {item.time && (
                            <div className="text-slate-500 text-xs flex items-center gap-1.5 font-medium">
                              <Clock size={12} className="text-blue-400 shrink-0" />
                              <span>{item.time}</span>
                            </div>
                          )}
                          {item.location && (
                            <div className="text-slate-500 text-xs flex items-start gap-1.5 font-medium">
                              <MapPin size={12} className="text-blue-400 shrink-0 mt-0.5" />
                              <span className="leading-tight">{item.location}</span>
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-9">
                          <div className="text-slate-900 font-bold group-hover:text-blue-600 transition-colors text-sm md:text-lg mb-2">
                            <span className="mr-2">{item.title}</span>
                            <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] md:text-xs font-bold whitespace-nowrap align-middle">
                              <ExternalLink size={10} />
                              <span>{lang === 'zh' ? '前往外部網站' : 'Go to Site'}</span>
                            </div>
                          </div>
                          <div className="text-slate-500 text-xs md:text-sm font-medium italic">
                            {item.desc.split('\n')[0].split('/').map((part, idx) => (
                              <div key={idx} className={idx > 0 ? "mt-1 pl-4 relative before:content-['/'] before:absolute before:left-0 before:text-slate-300" : ""}>
                                {part.trim()}
                              </div>
                            ))}
                          </div>
                        </div>
                      </a>
                    ) : (
                      <Link
                        to="/news"
                        className="px-6 py-6 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 hover:bg-blue-50/50 transition-all group items-start"
                      >
                        <div className="md:col-span-3 flex flex-col gap-1 md:gap-2">
                          <div className="text-slate-900 font-bold text-sm md:text-base whitespace-nowrap">{item.date}</div>
                          {item.time && (
                            <div className="text-slate-500 text-xs flex items-center gap-1.5 font-medium">
                              <Clock size={12} className="text-blue-400 shrink-0" />
                              <span>{item.time}</span>
                            </div>
                          )}
                          {item.location && (
                            <div className="text-slate-500 text-xs flex items-start gap-1.5 font-medium">
                              <MapPin size={12} className="text-blue-400 shrink-0 mt-0.5" />
                              <span className="leading-tight">{item.location}</span>
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-9">
                          <div className="text-slate-900 font-bold group-hover:text-blue-600 flex items-start gap-2 transition-colors text-sm md:text-lg mb-2">
                            <span className="">{item.title}</span>
                            <ArrowRight size={18} className="shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all mt-1 md:mt-0" />
                          </div>
                          <div className="text-slate-500 text-xs md:text-sm font-medium italic">
                            {item.desc.split('\n')[0].split('/').map((part, idx) => (
                              <div key={idx} className={idx > 0 ? "mt-1 pl-4 relative before:content-['/'] before:absolute before:left-0 before:text-slate-300" : ""}>
                                {part.trim()}
                              </div>
                            ))}
                          </div>
                        </div>
                      </Link>
                    )}
                  </motion.div>
                ))}
            </div>
          </div>
        ) : (
          <div className="py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Newspaper size={32} />
            </div>
            <p className="text-slate-400 font-medium">
              {t.lang === 'zh' ? '目前尚無活動訊息' : 'No activity news at the moment'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

const InfographicCards = ({ t }) => {
  return (
    <section className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.infographic.cards.map((card, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
              <p className="text-slate-600 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const InfographicSection = ({ t, isNested = false }) => {
  const content = (
    <div className={`${isNested ? '' : 'max-w-7xl mx-auto px-6'}`}>
      <div className={`text-center ${isNested ? 'mb-8' : 'mb-16'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {isNested ? (
            <h3 className="text-2xl md:text-3xl font-black text-blue-600 mb-4">
              {t.infographic.badge}
            </h3>
          ) : (
            <>
              <span className="inline-block py-1 px-4 rounded-full bg-blue-50 text-blue-600 text-sm font-bold tracking-wider uppercase mb-4">
                {t.infographic.badge}
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
                {t.infographic.title}
              </h2>
            </>
          )}
          <p className={`${isNested ? 'text-base' : 'text-lg'} max-w-3xl mx-auto text-slate-600`}>
            {t.infographic.desc}
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={`relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-50 ${isNested ? 'p-2 md:p-4' : 'p-4 md:p-8'}`}
      >
        <img 
          src={getImageUrl(t.infographic.image)} 
          alt="M4 MEDCLAW Infographic" 
          className="w-full h-auto rounded-xl shadow-inner"
          referrerPolicy="no-referrer"
        />
        
        <div className="absolute inset-0 pointer-events-none border-[12px] border-white/10 rounded-3xl"></div>
      </motion.div>
    </div>
  );

  if (isNested) return <div className="py-4">{content}</div>;

  return (
    <section className="py-20 bg-white">
      {content}
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
    <section id="about" className="pt-32 pb-16 bg-transparent overflow-hidden h-auto">
      {/* Background Image - 請將計畫內容背景圖片命名為 bg-about.webp 並放置於 public/assets/ 資料夾下 */}
      <div className="fixed top-[80px] left-0 -z-20 pointer-events-none p-4 md:p-12 lg:p-16">
        <img 
          src={getImageUrl("/assets/bg-about.webp")} 
          alt="About Background" 
          className="w-auto h-auto max-w-[80vw] sm:max-w-sm md:max-w-md lg:max-w-lg object-contain object-left-top opacity-90"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://picsum.photos/seed/about-bg/1920/1080";
          }}
        />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Project Overview */}
        <div className="text-left w-full mb-8 bg-white/80 p-8 rounded-3xl backdrop-blur-sm shadow-sm border border-white/50">
          <span className="text-indigo-600 font-bold tracking-widest uppercase text-xl">{t.about.badge}</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-4 mb-6">{t.about.title}</h2>
          <p className="text-xl text-slate-600 leading-relaxed whitespace-pre-wrap">
            {t.about.desc}
          </p>
        </div>

        {/* Pagination Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 border-b border-slate-200 pb-6">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(index)}
              className={`px-5 py-3 rounded-2xl font-bold transition-all text-sm md:text-base border-2 ${activeTab === index
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100'
                  : 'bg-indigo-50/50 text-indigo-600 border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200'
                }`}
            >
              {section.title.includes('、') ? section.title.split('、')[1] : section.title.includes('. ') ? section.title.split('. ')[1] : section.title}
            </button>
          ))}
        </div>

        {/* Paginated Content */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <div className="flex flex-col gap-8">
                <div className="w-full text-left">
                  <h3 className="text-3xl font-bold text-indigo-600">
                    {sections[activeTab].title}
                  </h3>
                  <p className="text-slate-500 mt-2 text-sm font-medium uppercase tracking-wider">
                    Section {activeTab + 1} of {sections.length}
                  </p>
                </div>
                <div className="w-full text-left">
                  <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-indigo-50">
                    {sections[activeTab].id === 'goals' && (
                      <InfographicSection t={t} isNested={true} />
                    )}
                    {sections[activeTab].id === 'process' && (
                      <Flowchart t={t} lang={lang} isNested={true} />
                    )}
                    <div className="text-lg text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {renderBoldText(sections[activeTab].content)}
                    </div>

                    {/* Special handling for Milestones (Section V) */}
                    {sections[activeTab].id === 'milestones' && (
                      <div className="mt-12 space-y-8 relative">
                        <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-100" />
                        {t.timeline.steps.map((step, i) => (
                          <div key={i} className="flex gap-6 relative">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 border-4 border-white shadow-lg flex items-center justify-center text-white shrink-0 z-10">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-50 animate-pulse" />
                            </div>
                            <div>
                              <span className="text-indigo-600 font-bold text-sm tracking-wider uppercase">{step.date}</span>
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
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                          activeTab === 0 
                            ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:scale-95'
                        }`}
                      >
                        <ChevronRight className="rotate-180" size={20} />
                        {lang === 'zh' ? '上一節' : 'Previous'}
                      </button>

                      <div className="hidden sm:flex gap-2">
                        {sections.map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all ${activeTab === i ? 'bg-indigo-600 w-6' : 'bg-slate-200'}`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={nextTab}
                        disabled={activeTab === sections.length - 1}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                          activeTab === sections.length - 1 
                            ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95'
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

        {/* External Link */}
        <div className="mt-16 text-center">
          <a
            href="https://www.twaicoe.org/medical-model-beyond-scaling-a-modular-foundation-model-framework-for-data-efficient-and-trustworthy-medical-imaging-cn"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-amber-500 text-white px-10 py-5 rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-2xl shadow-amber-100 group text-lg"
          >
            {t.about.externalLink}
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <p className="mt-3 text-xs text-slate-400 font-medium">
            <Info size={12} className="inline mr-1" />
            {t.footer.externalWarning}
          </p>
        </div>
      </div>
    </section>
  );
};

const Recruitment = ({ t, lang }) => {
  return (
    <section id="recruitment" className="pt-32 pb-20 bg-transparent min-h-screen">
      {/* Background Image - 請將徵聘資訊背景圖片命名為 bg-recruitment.webp 並放置於 public/assets/ 資料夾下 */}
      <div className="fixed top-[80px] left-0 -z-20 pointer-events-none p-4 md:p-12 lg:p-16">
        <img 
          src={getImageUrl("/assets/bg-recruitment.webp")} 
          alt="Recruitment Background" 
          className="w-auto h-auto max-w-[80vw] sm:max-w-sm md:max-w-md lg:max-w-lg object-contain object-left-top opacity-90"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://picsum.photos/seed/recruitment-bg/1920/1080";
          }}
        />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-10 bg-white/80 p-8 rounded-3xl backdrop-blur-sm shadow-sm border border-white/50 max-w-3xl mx-auto">
          <span className="text-blue-600 font-bold tracking-widest uppercase text-xl">{t.recruitment.badge}</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-4">{t.recruitment.title}</h2>
          <p className="text-lg text-slate-600 mt-4">{t.recruitment.desc}</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-blue-50/50 border border-blue-100 overflow-hidden">
          <div className="grid grid-cols-1 divide-y divide-slate-100">
            <div className="bg-slate-50 px-8 py-4 grid grid-cols-12 gap-4 text-sm font-bold text-slate-500 uppercase tracking-wider">
              <div className="col-span-3">{lang === 'zh' ? '日期' : 'Date'}</div>
              <div className="col-span-9">{lang === 'zh' ? '職缺' : 'Job Title'}</div>
            </div>
            {[...t.recruitment.jobs]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((job, i) => (
                <a
                  key={i}
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-6 grid grid-cols-12 gap-4 hover:bg-blue-50/50 transition-all group items-center"
                >
                <div className="col-span-3 text-slate-500 font-medium">{job.date}</div>
                <div className="col-span-9">
                  <div className="text-slate-900 font-bold group-hover:text-blue-600 flex items-center gap-2 transition-colors">
                    <span className="truncate">{job.title}</span>
                    <ArrowRight size={16} className="shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="mt-1 text-xs text-slate-400 flex items-center gap-1">
                    <Info size={12} className="shrink-0" />
                    <span>{t.footer.externalWarning}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

const News = ({ t, lang }) => {
  return (
    <section id="news" className="pt-32 pb-20 bg-transparent min-h-screen">
      {/* Background Image - 請將活動訊息背景圖片命名為 bg-news.webp 並放置於 public/assets/ 資料夾下 */}
      <div className="fixed top-[80px] left-0 -z-20 pointer-events-none p-4 md:p-12 lg:p-16">
        <img 
          src={getImageUrl("/assets/bg-news.webp")} 
          alt="News Background" 
          className="w-auto h-auto max-w-[80vw] sm:max-w-sm md:max-w-md lg:max-w-lg object-contain object-left-top opacity-90"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://picsum.photos/seed/news-bg/1920/1080";
          }}
        />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 bg-white/80 p-8 rounded-3xl backdrop-blur-sm shadow-sm border border-white/50 max-w-3xl mx-auto">
          <span className="text-blue-600 font-bold tracking-widest uppercase text-sm bg-blue-50 px-4 py-2 rounded-full">{t.news.badge}</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-6">{t.news.title}</h2>
          <div className="w-12 h-1 bg-blue-600 mx-auto mt-6 rounded-full" />
        </div>
        
        {t.news.items.length > 0 ? (
          <div className="space-y-8 max-w-4xl mx-auto">
            {t.news.items.map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row gap-8 p-8 rounded-3xl bg-white shadow-sm border border-slate-100 items-start hover:shadow-md transition-shadow relative"
              >
                <div className="bg-blue-50 text-blue-600 font-bold px-4 py-2 rounded-xl text-sm whitespace-nowrap h-fit text-center min-w-[120px]">
                  <div>{item.date}</div>
                  {item.time && (
                    <div className="text-[10px] mt-1 text-blue-400 font-medium flex items-center justify-center gap-1">
                      <Clock size={10} />
                      {item.time}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                    {item.link && item.link !== '#' && (
                      <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs font-bold">
                        <ExternalLink size={12} />
                        <span>{lang === 'zh' ? '前往外部網站' : 'Go to Site'}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-6 mb-4 text-sm text-slate-500 font-medium">
                    {item.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-blue-500" />
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {item.desc.split('\n').map((line, lIdx) => (
                      <div key={lIdx} className={lIdx > 0 ? "mt-4" : ""}>
                        {lIdx === 0 ? (
                          line.split('/').map((part, pIdx) => (
                            <div key={pIdx} className={pIdx > 0 ? "mt-1 pl-4 relative before:content-['/'] before:absolute before:left-0 before:text-slate-300" : ""}>
                              {part.trim()}
                            </div>
                          ))
                        ) : (
                          line
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {item.link && item.link !== '#' && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10" aria-label="External Link" />
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 max-w-4xl mx-auto">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Newspaper size={32} />
            </div>
            <p className="text-slate-400 font-medium">{lang === 'zh' ? '目前尚無活動訊息' : 'No activity news at the moment'}</p>
          </div>
        )}
      </div>
    </section>
  );
};

const Science = ({ t, lang }) => {
  return (
    <section id="science" className="pt-32 pb-20 bg-transparent min-h-screen">
      {/* Background Image - 請將AI新知背景圖片命名為 bg-science.webp 並放置於 public/assets/ 資料夾下 */}
      <div className="fixed top-[80px] left-0 -z-20 pointer-events-none p-4 md:p-12 lg:p-16">
        <img 
          src={getImageUrl("/assets/bg-science.webp")} 
          alt="Science Background" 
          className="w-auto h-auto max-w-[80vw] sm:max-w-sm md:max-w-md lg:max-w-lg object-contain object-left-top opacity-90"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://picsum.photos/seed/science-bg/1920/1080";
          }}
        />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 bg-white/80 p-8 rounded-3xl backdrop-blur-sm shadow-sm border border-white/50 max-w-3xl mx-auto">
          <span className="text-blue-600 font-bold tracking-widest uppercase text-sm bg-blue-50 px-4 py-2 rounded-full">{t.science.badge}</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-6">{t.science.title}</h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">{t.science.desc}</p>
          <div className="w-12 h-1 bg-blue-600 mx-auto mt-6 rounded-full" />
        </div>

        <div className="flex flex-col gap-8 max-w-5xl mx-auto">
          {t.science.items.length > 0 ? (
            [...t.science.items].sort((a, b) => b.date.localeCompare(a.date)).map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group flex flex-col md:flex-row gap-8 items-start"
              >
                <div className="flex flex-col items-center md:items-start gap-3 shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-100">
                    <Zap size={24} />
                  </div>
                  <span className="text-sm font-bold text-slate-400 whitespace-nowrap">{item.date}</span>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4 text-sm text-slate-500 italic">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{item.author}</span>
                    </div>
                    {item.source && (
                      <div className="flex items-center gap-1">
                        <span className="text-slate-300">|</span>
                        <span>{lang === 'zh' ? '轉自：' : 'Source: '}</span>
                        <span className="font-medium">{item.source}</span>
                      </div>
                    )}
                  </div>
                  <p className={`text-slate-600 leading-relaxed ${item.summary ? 'mb-6' : 'mb-4'}`}>
                    {item.desc}
                  </p>
                  {item.summary && (
                    <div className="mb-6 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <p className="text-slate-600 text-sm leading-relaxed">{item.summary}</p>
                    </div>
                  )}
                  <div className="mt-6">
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 font-bold group-hover:gap-3 transition-all mb-1"
                    >
                      {lang === 'zh' ? '閱讀更多' : 'Read More'} <ArrowRight size={18} />
                    </a>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <ExternalLink size={10} />
                      {t.footer.externalWarning}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">
                {lang === 'zh' ? '內容正在準備中，敬請期待。' : 'Content is being prepared, please stay tuned.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const ConferenceItem = ({ event, t, lang }: { event: any, t: any, lang: any, key?: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white/80 rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md mb-4">
      <div
        className="p-6 flex flex-col md:flex-row gap-8 items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Representative Image */}
        <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0 shadow-inner bg-slate-50 flex items-center justify-center group">
          <img
            src={getImageUrl(event.img)}
            alt={event.title}
            className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${event.title}/400/300`;
            }}
          />
        </div>

        {/* Basic Info */}
        <div className="flex-1 w-full">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={14} className="text-blue-600" />
                <span className="text-sm font-bold text-blue-600">{event.date}</span>
                {event.isUpcoming && (
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {t.conferences.upcoming}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{event.title}</h3>
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                <Target size={14} />
                {event.loc}
              </div>
              <p className="text-slate-600 text-sm line-clamp-2">
                {event.desc}
              </p>
            </div>
            <button
              className={`p-2 rounded-full bg-slate-50 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-blue-600 bg-blue-50' : ''}`}
            >
              <ChevronRight size={20} className="rotate-90" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-50 bg-slate-50/30"
          >
            <div className="p-8 md:pl-56">
              {event.subtitle && (
                <div className="text-lg font-medium text-slate-600 mb-4 italic">
                  {event.subtitle}
                </div>
              )}
              <div className="prose prose-slate max-w-none mb-8">
                <p className="text-slate-700 leading-relaxed">
                  {event.desc}
                </p>
              </div>

              {/* More images or details could go here */}
              {/* Gallery Section */}
              {event.gallery && event.gallery.length > 0 && (
                <div className="mb-8">
                  <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Presentation size={18} className="text-blue-600" />
                    {lang === 'zh' ? '會議剪影' : 'Conference Gallery'}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {event.gallery.map((imgUrl, idx) => (
                      <div key={idx} className="aspect-video rounded-xl overflow-hidden shadow-sm border border-white bg-slate-100 group">
                        <img
                          src={getImageUrl(imgUrl)}
                          alt={`Gallery ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/gallery-${idx}/400/300`;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center">
                  <h4 className="font-bold text-slate-900 mb-2">{lang === 'zh' ? '會議亮點' : 'Conference Highlights'}</h4>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li className="flex gap-2"><CheckCircle2 size={14} className="text-blue-500 shrink-0 mt-0.5" /> {lang === 'zh' ? '跨領域專家交流' : 'Interdisciplinary expert exchange'}</li>
                    <li className="flex gap-2"><CheckCircle2 size={14} className="text-blue-500 shrink-0 mt-0.5" /> {lang === 'zh' ? '最新技術趨勢探討' : 'Latest technology trends discussion'}</li>
                    <li className="flex gap-2"><CheckCircle2 size={14} className="text-blue-500 shrink-0 mt-0.5" /> {lang === 'zh' ? '實務應用案例分享' : 'Practical application case sharing'}</li>
                  </ul>
                </div>
              </div>

              {event.url && (
                <div className="flex flex-col items-start gap-3">
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 group"
                  >
                    {t.conferences.officialSite}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                  <p className="text-[10px] text-slate-400 font-medium">
                    <Info size={10} className="inline mr-1" />
                    {t.footer.externalWarning}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ConferenceMarquee = () => {
  const bgImages = [
    'assets/acml2025_1.webp',
    'assets/acml2025_2.webp',
    'assets/acml2025_3.webp',
    'assets/acml2025_4.webp',
    'assets/acml2025_5.webp',
    'assets/acml2025_6.webp',
  ];

  const marqueeImages = [...bgImages, ...bgImages];

  return (
    <div className="relative w-full overflow-hidden py-12 mb-16 border-y border-slate-100 bg-white opacity-75">
      <motion.div 
        className="flex gap-6 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ 
          repeat: Infinity, 
          ease: "linear", 
          duration: 30 
        }}
      >
        {marqueeImages.map((src, index) => (
          <div key={index} className="w-72 md:w-96 aspect-video rounded-2xl overflow-hidden shadow-sm shrink-0 border-4 border-white bg-slate-50">
            <img 
              src={getImageUrl(src)} 
              alt={`Conference Moment`} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://picsum.photos/seed/conf-${index}/400/300`;
              }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const Conferences = ({ t, lang }) => {
  const upcomingEvents = t.conferences.events.filter(e => e.isUpcoming);
  const pastEvents = t.conferences.events.filter(e => !e.isUpcoming);

  return (
    <section id="conferences" className="pt-32 pb-20 relative min-h-screen bg-transparent">
      {/* Background Image - 請將學術會議背景圖片命名為 bg-conferences.webp 並放置於 public/assets/ 資料夾下 */}
      <div className="fixed top-[80px] left-0 -z-20 pointer-events-none p-4 md:p-12 lg:p-16">
        <img 
          src={getImageUrl("/assets/bg-conferences.webp")} 
          alt="Conferences Background" 
          className="w-auto h-auto max-w-[80vw] sm:max-w-sm md:max-w-md lg:max-w-lg object-contain object-left-top opacity-90"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://picsum.photos/seed/conferences-bg/1920/1080";
          }}
        />
      </div>
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12 bg-white/80 p-8 rounded-3xl backdrop-blur-sm shadow-sm border border-white/50 max-w-3xl mx-auto">
          <span className="text-blue-600 font-bold tracking-widest uppercase text-sm bg-blue-50 px-4 py-2 rounded-full">{t.conferences.badge}</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-6">{t.conferences.title}</h2>
          <div className="w-12 h-1 bg-blue-600 mx-auto mt-6 rounded-full" />
        </div>
      </div>

      <ConferenceMarquee />

      <div className="max-w-5xl mx-auto px-6 relative z-10">

        {/* Upcoming Section */}
        {upcomingEvents.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-slate-200 flex-1" />
              <h3 className="text-lg font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                <Zap size={18} />
                {t.conferences.upcoming}
              </h3>
              <div className="h-px bg-slate-200 flex-1" />
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event, i) => (
                <ConferenceItem key={`upcoming-${i}`} event={event} t={t} lang={lang} />
              ))}
            </div>
          </div>
        )}

        {/* Past Section */}
        {pastEvents.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-slate-200 flex-1" />
              <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={18} />
                {t.conferences.past}
              </h3>
              <div className="h-px bg-slate-200 flex-1" />
            </div>
            <div className="space-y-4">
              {pastEvents.map((event, i) => (
                <ConferenceItem key={`past-${i}`} event={event} t={t} lang={lang} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const Privacy = ({ t, lang }) => {
  const [showFull, setShowFull] = useState(false);

  return (
    <section id="privacy" className="pt-32 pb-20 bg-transparent min-h-screen">
      {/* Background Image - 請將隱私權政策背景圖片命名為 bg-privacy.webp 並放置於 public/assets/ 資料夾下 */}
      <div className="fixed top-[80px] left-0 -z-20 pointer-events-none p-4 md:p-12 lg:p-16">
        <img 
          src={getImageUrl("/assets/bg-privacy.webp")} 
          alt="Privacy Background" 
          className="w-auto h-auto max-w-[80vw] sm:max-w-sm md:max-w-md lg:max-w-lg object-contain object-left-top opacity-90"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://picsum.photos/seed/privacy-bg/1920/1080";
          }}
        />
      </div>
      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={40} />
        </div>
        <span className="text-emerald-600 font-bold tracking-widest uppercase text-xl">{t.privacy.badge}</span>
        <h2 className="text-4xl font-bold text-slate-900 mt-4 mb-6">{t.privacy.title}</h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          {t.privacy.desc}
        </p>
        
        {!showFull ? (
          <button 
            onClick={() => setShowFull(true)}
            className="mt-10 text-blue-600 font-bold underline underline-offset-8 hover:text-blue-700 transition-colors"
          >
            {lang === 'zh' ? '閱讀完整政策文件' : 'Read Full Policy Document'}
          </button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-left bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100"
          >
            <div className="prose prose-slate max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-slate-600 leading-relaxed text-base">
                {t.privacy.fullPolicy}
              </pre>
            </div>
            <button 
              onClick={() => setShowFull(false)}
              className="mt-12 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
            >
              {lang === 'zh' ? '收合文件' : 'Collapse Document'}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
      /*
      隱私權保護政策 (Privacy Policy)
      1. 資訊蒐集說明 (Information Collection)
      本網站為純靜態之學術資訊展示網頁。我們不會透過任何表單、Cookie 或登入系統主動要求您輸入或蒐集您的個人識別資料（如姓名、電子郵件、電話等）。
      This is a static academic website. We do not proactively collect any personally identifiable information (PII) such as names, emails, or phone numbers through forms, cookies, or login systems.
      
      2. 自動化紀錄說明 (Server Log Data)
      當您瀏覽本網站時，託管伺服器可能會自動記錄您的基本連線資訊，包括但不限於 IP 地址、瀏覽器類型、造訪時間及所點選的網頁位址。這些資訊僅用於維護系統安全、異常排查以及網站流量統計，不會用於識別特定個人之身分。
      When you visit, our hosting server may automatically record basic connection data, including IP addresses, browser types, and access timestamps. This data is used solely for system security, troubleshooting, and traffic analysis.
      
      3. 外部連結聲明 (External Links)
      本網站可能包含通往其他第三方網站（如學術期刊、研究單位、社群媒體）的連結。對於這些外部網站的內容或其隱私權政策，本研究中心不負任何法律責任，建議您在離開本站時先行閱讀該網站的隱私權聲明。
      Our website may contain links to third-party sites. We are not responsible for the content or privacy practices of these external websites. We encourage you to read the privacy statements of any site you visit.
      
      4. 政策修訂 (Changes to This Policy)
      本研究中心保留隨時修改本隱私權政策的權利。任何修訂將於本頁面發佈後立即生效。
      We reserve the right to update this policy at any time. Any changes will take effect immediately upon posting to this page.
      
      5. 聯絡我們 (Contact Us)
      若您對本政策或本網站有任何疑問，歡迎透過網站下方提供的聯繫方式與我們聯繫。
      If you have questions about this policy, please contact us via the information provided in the footer.
      */

const TeamMember = ({ member, lang, t }: any) => {
  const name = lang === 'en' ? member.nameEn : member.name;
  const title = lang === 'en' ? member.titleEn : member.title;
  const expertise = lang === 'en' ? member.expertiseEn : member.expertise;

  return (
    <div className="flex flex-col items-center text-center group bg-white/80 p-6 rounded-3xl backdrop-blur-sm shadow-sm border border-white/50 h-full">
      <div className="w-32 h-32 rounded-full overflow-hidden mb-8 ring-8 ring-slate-50 group-hover:ring-blue-50 transition-all duration-500 shadow-xl bg-white">
        <img
          src={getImageUrl(member.img)}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f1f5f9&color=1d4ed8&bold=true`;
          }}
        />
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-1">{name}</h3>

      <p className="text-blue-700 font-bold text-base mb-4 leading-relaxed line-clamp-2 min-h-[3rem]">
        {title}
      </p>

      <div className="flex gap-4 mb-4">
        {member.website && (
          <a
            href={member.website}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
            title={`${lang === 'zh' ? '網站' : 'Website'} - ${t.footer.externalWarning}`}
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

      <div className="w-full pt-2 border-t border-slate-100">
        <p className="text-slate-800 text-sm font-medium leading-loose px-4 line-clamp-3">
          {expertise.join(' • ')}
        </p>
      </div>
    </div>
  );
};

const Team = ({ t, lang }) => {
  const row1 = teamData.slice(0, 2);
  const row2 = teamData.slice(2, 6);
  const row3 = teamData.slice(6, 11);
  const row4 = teamData.slice(11, 12);

  return (
    <section id="team" className="pt-32 pb-20 bg-transparent min-h-screen">
      {/* Background Image - 請將團隊介紹背景圖片命名為 bg-team.webp 並放置於 public/assets/ 資料夾下 */}
      <div className="fixed top-[80px] left-0 -z-20 pointer-events-none p-4 md:p-12 lg:p-16">
        <img 
          src={getImageUrl("/assets/bg-team.webp")} 
          alt="Team Background" 
          className="w-auto h-auto max-w-[80vw] sm:max-w-sm md:max-w-md lg:max-w-lg object-contain object-left-top opacity-90"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://picsum.photos/seed/team-bg/1920/1080";
          }}
        />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 bg-white/80 p-8 rounded-3xl backdrop-blur-sm shadow-sm border border-white/50 max-w-3xl mx-auto">
          <span className="text-blue-700 font-bold tracking-widest uppercase text-xl">{t.team.badge}</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-4">{t.team.title}</h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto mt-6" />
        </div>

        <div className="space-y-24">
          {/* Row 1: 2 Members */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-2xl mx-auto">
            {row1.map((member, i) => (
              <TeamMember key={i} member={member} lang={lang} t={t} />
            ))}
          </div>

          {/* Row 2: 4 Members */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {row2.map((member, i) => (
              <TeamMember key={i} member={member} lang={lang} t={t} />
            ))}
          </div>

          {/* Row 3: 5 Members */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12">
            {row3.map((member, i) => (
              <TeamMember key={i} member={member} lang={lang} t={t} />
            ))}
          </div>

          {/* Row 4: 1 Member */}
          <div className="flex justify-center">
            <div className="max-w-[300px] w-full">
              {row4.map((member, i) => (
                <TeamMember key={i} member={member} lang={lang} t={t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Flowchart = ({ t, lang, src = "/assets/pipeline.webp", title = "", isNested = false }) => {
  const content = (
    <div className={`${isNested ? '' : 'max-w-7xl mx-auto px-6'}`}>
      <div className="text-center mb-10 bg-white/80 p-8 rounded-3xl backdrop-blur-sm shadow-sm border border-white/50 max-w-3xl mx-auto">
        <span className="text-blue-600 font-bold tracking-widest uppercase text-xl">{lang === 'zh' ? '技術架構' : 'Technical Architecture'}</span>
        <h2 className="text-4xl font-bold text-slate-900 mt-4">{title}</h2>
      </div>
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-50 p-4 md:p-8">
        <img
          src={getImageUrl(src || "/assets/pipeline.webp")}
          alt={title || "Flowchart"}
          className="w-full h-auto rounded-2xl"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://picsum.photos/seed/technical-pipeline/1600/900";
          }}
        />
        <div className="mt-8 text-center text-slate-500 text-sm italic">
          {lang === 'zh' ? '* 流程圖' : '* Flowchart'}
        </div>
      </div>
    </div>
  );

  if (isNested) return <div className="py-4">{content}</div>;

  return (
    <section className="py-16 bg-white">
      {content}
    </section>
  );
};

const Partners = ({ t }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const partners = [
    { name: 'National Science and Technology Council', logo: '/assets/NSTC_Logo.webp', url: 'https://www.nstc.gov.tw/' },
    { name: 'Chang Gung University', logo: '/assets/CGU_Logo.webp', url: 'https://www.cgu.edu.tw/' },
    { name: 'Artificial Intelligence Research Center', logo: '/assets/logo-ai-res.webp', url: 'https://www.cgu.edu.tw/aic' },
    { name: 'Taiwan AI Center of Excellence', logo: '/assets/logo-ai-coe.webp', url: 'https://www.twaicoe.org/' },
    { name: 'College of Intelligent Computing', logo: '/assets/logo-ai-coc.webp', url: 'https://www.cgu.edu.tw/coic' },
    { name: 'Department of Artificial Intelligence', logo: '/assets/logo-ai-dai.webp', url: 'https://www.cgu.edu.tw/ai' },
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
    <section className="py-12 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 mb-8 flex justify-between items-end">
        <h2 className="text-xl font-bold text-slate-400 uppercase tracking-[0.3em]">
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
            <a
              key={i}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              title={t.footer.externalWarning}
              className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-500 opacity-60 hover:opacity-100 cursor-pointer"
            >
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
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-6 text-center">
        <p className="text-xs text-slate-400 font-medium">
          <Info size={12} className="inline mr-1" />
          {t.footer.externalWarning}
        </p>
      </div>
    </section>
  );
};

const Footer = ({ t }) => {
  return (
    <footer className="bg-slate-50 text-slate-600 py-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-8">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={getImageUrl("/assets/M4_Logo.webp")}
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
            <h4 className="text-slate-900 font-bold mb-4 text-base uppercase tracking-wider">{t.footer.quickLinks}</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="hover:text-blue-600 transition-colors">{t.nav.about}</Link></li>
              <li><Link to="/team" className="hover:text-blue-600 transition-colors">{t.nav.team}</Link></li>
              <li><Link to="/recruitment" className="hover:text-blue-600 transition-colors">{t.nav.recruitment}</Link></li>
              <li><Link to="/news" className="hover:text-blue-600 transition-colors">{t.nav.news}</Link></li>
              <li><Link to="/science" className="hover:text-blue-600 transition-colors">{t.nav.science}</Link></li>
              <li><Link to="/conferences" className="hover:text-blue-600 transition-colors">{t.nav.conferences}</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-slate-900 font-bold mb-4 text-base uppercase tracking-wider">{t.footer.legal}</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/privacy" className="hover:text-blue-600 transition-colors">{t.footer.p1}</Link></li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <h4 className="text-slate-900 font-bold mb-4 text-base uppercase tracking-wider">{t.footer.contact}</h4>
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
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-start items-start md:items-center gap-6 text-xs font-medium">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <p className="text-slate-500">{t.footer.rights}</p>
            <span className="hidden md:inline text-slate-200">|</span>
            <p className="text-slate-400">{t.footer.updated}</p>
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
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50/50 font-sans selection:bg-blue-100 selection:text-blue-900">
        <Navbar lang={lang} setLang={setLang} t={t} />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero t={t} lang={lang} />
                <ActivityNewsPreview t={t} lang={lang} />
                <InfographicCards t={t} />
              </>
            } />
            <Route path="/about" element={<About t={t} lang={lang} />} />
            <Route path="/team" element={<Team t={t} lang={lang} />} />
            <Route path="/recruitment" element={<Recruitment t={t} lang={lang} />} />
            <Route path="/news" element={<News t={t} lang={lang} />} />
            <Route path="/science" element={<Science t={t} lang={lang} />} />
            <Route path="/conferences" element={<Conferences t={t} lang={lang} />} />
            <Route path="/privacy" element={<Privacy t={t} lang={lang} />} />
          </Routes>
        </main>
        <Partners t={t} />
        <Footer t={t} />
      </div>
    </HashRouter>
  );
}

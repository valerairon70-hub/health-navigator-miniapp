/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Zap,
  Moon,
  Droplets,
  Scale,
  Brain,
  Search,
  Share2,
  CheckCircle2,
  Home,
  MessageCircle,
} from 'lucide-react';
import { TOPICS, SPECIALIST, SOCIAL_PROOF, OFFER, TESTIMONIALS, Topic } from './constants';

declare global {
  interface Window {
    Telegram: any;
  }
}

type Screen = 'intro' | 'welcome' | 'explanation' | 'action' | 'thankyou';

const SCREEN_STEP: Record<Screen, number> = {
  intro: 0,
  welcome: 1,
  explanation: 2,
  action: 3,
  thankyou: 0,
};

function OfferModal({ onClose }: { onClose: () => void }) {
  const handleAccept = () => {
    const url = `https://t.me/${SPECIALIST.username}`;
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(url);
    } else {
      window.open(url, '_blank');
    }
    onClose();
  };

  return (
    <motion.div
      key="offer-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="bg-[#f5f5f0] rounded-3xl p-6 w-full max-w-sm space-y-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center text-5xl">{OFFER.emoji}</div>

        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold font-sans text-[#1a1a1a]">{OFFER.title}</h2>
          <p className="text-sm font-sans opacity-60 leading-relaxed">{OFFER.subtitle}</p>
        </div>

        <div className="space-y-2">
          {OFFER.bullets.map((bullet, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-[#5A5A40]/10 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5A5A40]" />
              </div>
              <p className="text-sm font-sans opacity-70 leading-snug">{bullet}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-1">
          <button
            onClick={handleAccept}
            className="w-full py-4 bg-[#5A5A40] text-white rounded-2xl font-sans font-bold text-sm shadow-lg hover:bg-[#4a4a35] transition-all"
          >
            {OFFER.buttonText}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-sm font-sans opacity-40 hover:opacity-60 transition-opacity"
          >
            {OFFER.skipText}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProgressBar({ screen }: { screen: Screen }) {
  const step = SCREEN_STEP[screen];
  if (step === 0) return null;
  return (
    <div className="flex gap-1.5 mb-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
            i <= step ? 'bg-[#5A5A40]' : 'bg-black/10'
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-2">
      <p className="text-xs font-sans opacity-50 px-1">Истории клиентов</p>
      <div
        className="flex overflow-x-auto gap-3 pb-1 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          const index = Math.round(el.scrollLeft / el.offsetWidth);
          setActiveIndex(index);
        }}
      >
        {TESTIMONIALS.map((t) => (
          <div
            key={t.id}
            className="min-w-full snap-start px-4 py-3 bg-[#5A5A40]/5 rounded-xl border-l-2 border-[#5A5A40]/30"
          >
            <p className="text-xs font-sans text-[#5A5A40] font-medium mb-1 opacity-70">{t.topic}</p>
            <p className="text-sm font-sans opacity-70 italic leading-relaxed">{t.text}</p>
            <p className="text-xs font-sans opacity-50 mt-2">— {t.author}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-1.5 pt-0.5">
        {TESTIMONIALS.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-200"
            style={{
              width: i === activeIndex ? 16 : 6,
              height: 6,
              backgroundColor: i === activeIndex ? '#5A5A40' : '#5A5A40',
              opacity: i === activeIndex ? 1 : 0.25,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SpecialistCard() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-black/5">
        <div className="w-14 h-14 rounded-full overflow-hidden shrink-0">
          <img src={SPECIALIST.photo} alt={SPECIALIST.name} className="w-full h-full object-cover" />
        </div>
        <div className="space-y-0.5">
          <p className="font-medium font-sans">{SPECIALIST.name}</p>
          <p className="text-xs font-sans opacity-60">{SPECIALIST.role}</p>
          <p className="text-xs font-sans text-[#5A5A40] font-medium">{SPECIALIST.fact}</p>
        </div>
      </div>
      <TestimonialsCarousel />
    </div>
  );
}

function BottomNav({
  screen,
  onStart,
  onWrite,
  onShare,
}: {
  screen: Screen;
  onStart: () => void;
  onWrite: () => void;
  onShare: () => void;
}) {
  const items = [
    { label: 'Начать', icon: Home, action: onStart, active: screen === 'intro' || screen === 'welcome' },
    { label: 'Написать', icon: MessageCircle, action: onWrite, active: false },
    { label: 'Поделиться', icon: Share2, action: onShare, active: false },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#f5f5f0]/95 backdrop-blur-sm border-t border-black/5">
      <div className="max-w-md mx-auto flex">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className="flex-1 flex flex-col items-center gap-1 py-3 transition-all"
          >
            <item.icon
              className="w-5 h-5 transition-all"
              style={{ color: item.active ? '#5A5A40' : '#1a1a1a', opacity: item.active ? 1 : 0.35 }}
            />
            <span
              className="text-[10px] font-sans font-medium tracking-wide"
              style={{ color: item.active ? '#5A5A40' : '#1a1a1a', opacity: item.active ? 1 : 0.35 }}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showOffer, setShowOffer] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [expandedArea, setExpandedArea] = useState<string | null>(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#f5f5f0');
      const firstName = tg.initDataUnsafe?.user?.first_name;
      if (firstName) setUserName(firstName);
    }
  }, []);

  const handleCloseOffer = () => {
    localStorage.setItem(OFFER.storageKey, '1');
    setShowOffer(false);
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    if (topic.id === 'other') {
      setShowCustomInput(true);
      return;
    }
    setScreen('explanation');
    const alreadyShown = localStorage.getItem(OFFER.storageKey);
    if (!alreadyShown) {
      setTimeout(() => setShowOffer(true), 1000);
    }
  };

  const handleCustomSubmit = () => {
    if (!customText.trim()) return;
    setShowCustomInput(false);
    setScreen('explanation');
    const alreadyShown = localStorage.getItem(OFFER.storageKey);
    if (!alreadyShown) {
      setTimeout(() => setShowOffer(true), 1000);
    }
  };

  const goBack = () => {
    if (showCustomInput) {
      setShowCustomInput(false);
      return;
    }
    if (screen === 'welcome') setScreen('intro');
    if (screen === 'explanation') setScreen('welcome');
    if (screen === 'action') setScreen('explanation');
  };

  const getTopicIcon = (id: string) => {
    switch (id) {
      case 'energy': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'sleep': return <Moon className="w-5 h-5 text-indigo-400" />;
      case 'digestion': return <Droplets className="w-5 h-5 text-blue-400" />;
      case 'weight': return <Scale className="w-5 h-5 text-emerald-400" />;
      case 'stress': return <Brain className="w-5 h-5 text-rose-400" />;
      default: return <Search className="w-5 h-5 text-slate-400" />;
    }
  };

  const handleFinalAction = () => {
    if (selectedTopic?.id === 'other' && customText.trim()) {
      try { navigator.clipboard.writeText(customText); } catch {}
    }
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(
        `https://t.me/${SPECIALIST.username}`
      );
    } else {
      window.open(`https://t.me/${SPECIALIST.username}`, '_blank');
    }
    setScreen('thankyou');
  };

  const handleShare = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(
        `https://t.me/share/url?url=https://t.me/${SPECIALIST.botUsername}&text=${encodeURIComponent(SPECIALIST.shareText)}`
      );
    }
  };

  const handleWrite = () => {
    const url = `https://t.me/${SPECIALIST.username}`;
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(url);
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1a1a1a] font-serif">
      <AnimatePresence>
        {showOffer && <OfferModal onClose={handleCloseOffer} />}
      </AnimatePresence>
      <div className="max-w-md mx-auto px-6 py-8 flex flex-col min-h-screen pb-24">

        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#5A5A40] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-sm font-sans font-semibold tracking-wider uppercase opacity-60">
              Навигатор
            </h1>
          </div>
          {(screen === 'welcome' || screen === 'explanation' || screen === 'action') && (
            <button
              onClick={goBack}
              className="p-2 rounded-full hover:bg-black/5 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
        </header>

        {/* Progress bar */}
        <ProgressBar screen={screen} />

        <main className="flex-grow">
          <AnimatePresence mode="wait">

            {/* Screen 0: Intro */}
            {screen === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col justify-between h-full space-y-8"
              >
                <div className="space-y-6 pt-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-sans font-bold rounded-full uppercase tracking-wide">
                      Бесплатно
                    </span>
                    {SOCIAL_PROOF.count > 0 && (
                      <span className="text-xs font-sans opacity-50">
                        {SOCIAL_PROOF.count} {SOCIAL_PROOF.label}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-3xl font-light leading-tight">
                      {userName ? `${userName}, за 2 минуты` : 'За 2 минуты'} — узнай главную причину своего симптома и получи первый конкретный шаг
                    </h2>
                    <p className="text-base font-sans opacity-60 leading-relaxed">
                      Ответь на 3 вопроса. Специалист объяснит, что происходит, — без воды и медицинских терминов.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      '3 вопроса — 2 минуты',
                      'Простой язык, без медицинских терминов',
                      'Живой специалист с реальными результатами',
                    ].map((text, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#5A5A40]/10 flex items-center justify-center shrink-0">
                          <div className="w-2 h-2 rounded-full bg-[#5A5A40]" />
                        </div>
                        <p className="text-sm font-sans opacity-70">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setScreen('welcome')}
                  className="w-full py-5 bg-[#5A5A40] text-white rounded-2xl font-sans font-bold text-sm shadow-lg hover:bg-[#4a4a35] transition-all flex items-center justify-center gap-2"
                >
                  Узнать, что со мной происходит
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Screen 1: Topic Selection */}
            {screen === 'welcome' && !showCustomInput && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <p className="text-xs font-sans font-bold uppercase tracking-widest opacity-40">
                    Шаг 1 из 3
                  </p>
                  <h2 className="text-3xl font-light leading-tight">
                    Что сейчас беспокоит твоё самочувствие?
                  </h2>
                  <p className="text-sm font-sans opacity-60">
                    Выбери одну наиболее актуальную тему
                  </p>
                </div>

                <div className="grid gap-3">
                  {TOPICS.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicSelect(topic)}
                      className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-black/5 shadow-sm hover:shadow-md hover:border-[#5A5A40]/30 transition-all text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-white transition-colors">
                          {getTopicIcon(topic.id)}
                        </div>
                        <span className="text-lg font-medium">{topic.title}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Screen 1b: Custom input */}
            {screen === 'welcome' && showCustomInput && (
              <motion.div
                key="custom-input"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <p className="text-xs font-sans font-bold uppercase tracking-widest opacity-40">
                    Шаг 1 из 3
                  </p>
                  <h2 className="text-3xl font-light leading-tight">
                    Опиши своё состояние
                  </h2>
                  <p className="text-sm font-sans opacity-60">
                    Напиши своими словами — что тебя беспокоит прямо сейчас
                  </p>
                </div>

                <textarea
                  autoFocus
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Например: последние 2 месяца постоянно устаю, даже после сна нет сил. Плюс раздражительность и тяжесть после еды..."
                  className="w-full h-40 p-4 bg-white rounded-2xl border border-black/10 text-sm font-sans leading-relaxed resize-none focus:outline-none focus:border-[#5A5A40]/40 placeholder:opacity-40"
                />

                <button
                  onClick={handleCustomSubmit}
                  disabled={!customText.trim()}
                  className="w-full py-5 bg-[#5A5A40] text-white rounded-2xl font-sans font-bold text-sm shadow-lg hover:bg-[#4a4a35] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Продолжить
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Screen 2: Explanation */}
            {screen === 'explanation' && selectedTopic && (
              <motion.div
                key="explanation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <p className="text-xs font-sans font-bold uppercase tracking-widest opacity-40">
                    Шаг 2 из 3
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5A5A40]/10 text-[#5A5A40] text-xs font-sans font-bold uppercase tracking-widest">
                    {getTopicIcon(selectedTopic.id)}
                    {selectedTopic.title}
                  </div>
                  <h2 className="text-2xl font-light leading-snug">
                    {selectedTopic.explanation}
                  </h2>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-sans font-bold uppercase tracking-widest opacity-40">
                    На что стоит обратить внимание:
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedTopic.focusAreas.map((area, i) => {
                      const isOpen = expandedArea === area.title;
                      return (
                        <div
                          key={i}
                          onClick={() => setExpandedArea(isOpen ? null : area.title)}
                          className={`p-3 bg-white rounded-xl border text-sm font-sans cursor-pointer transition-all ${isOpen ? 'border-[#5A5A40]/30 col-span-2' : 'border-black/5'}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium">{area.title}</span>
                            <ChevronRight
                              className="w-3.5 h-3.5 shrink-0 opacity-30 transition-transform"
                              style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                            />
                          </div>
                          {isOpen && (
                            <p className="mt-2 text-xs opacity-60 leading-relaxed font-sans">
                              {area.hint}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {selectedTopic.id === 'other' && customText.trim() && (
                  <div className="p-4 bg-white rounded-xl border border-black/5">
                    <p className="text-xs font-sans opacity-50 mb-2">Твой запрос:</p>
                    <p className="text-sm font-sans opacity-80 italic leading-relaxed">«{customText}»</p>
                  </div>
                )}

                <div className="p-6 bg-[#5A5A40] text-white rounded-3xl space-y-4 shadow-xl">
                  <p className="text-base leading-relaxed opacity-90">
                    Хочешь разобраться по-настоящему — не просто «пей воду и высыпайся»? Специалист посмотрит именно твою ситуацию.
                  </p>
                  <button
                    onClick={() => setScreen('action')}
                    className="w-full py-4 bg-white text-[#5A5A40] rounded-2xl font-sans font-bold uppercase tracking-widest text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                  >
                    Продолжить
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Screen 3: Action — specialist card + single CTA */}
            {screen === 'action' && selectedTopic && (
              <motion.div
                key="action"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <p className="text-xs font-sans font-bold uppercase tracking-widest opacity-40">
                    Шаг 3 из 3
                  </p>
                  <h2 className="text-2xl font-light leading-tight">
                    Кто разберёт твою ситуацию
                  </h2>
                </div>

                <SpecialistCard />

                {/* Оффер — что именно получит человек */}
                <div className="p-5 bg-white rounded-2xl border border-black/5 space-y-3">
                  <p className="text-sm font-sans font-bold text-[#1a1a1a]">
                    Что будет на бесплатном разборе:
                  </p>
                  <div className="space-y-2">
                    {[
                      '1 главная причина твоих симптомов',
                      '2–3 конкретных шага что делать прямо сейчас',
                      'Ответ на один твой главный вопрос',
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        </div>
                        <p className="text-sm font-sans opacity-70">{item}</p>
                      </div>
                    ))}
                  </div>
                  {SPECIALIST.slotsLeft > 0 && (
                    <p className="text-xs font-sans text-amber-700 bg-amber-50 px-3 py-2 rounded-lg font-medium">
                      Осталось {SPECIALIST.slotsLeft} {SPECIALIST.slotsLeft === 1 ? 'место' : SPECIALIST.slotsLeft <= 4 ? 'места' : 'мест'} на этой неделе
                    </p>
                  )}
                </div>

                <button
                  onClick={handleFinalAction}
                  className="w-full py-5 bg-[#5A5A40] text-white rounded-2xl font-sans font-bold text-base shadow-lg hover:bg-[#4a4a35] transition-all flex items-center justify-center gap-2"
                >
                  Получить бесплатный разбор
                  <ChevronRight className="w-5 h-5" />
                </button>

                <p className="text-xs font-sans text-center opacity-40 leading-relaxed px-4">
                  Без обязательств — просто разговор.
                </p>
              </motion.div>
            )}

            {/* Screen 4: Thank You */}
            {screen === 'thankyou' && (
              <motion.div
                key="thankyou"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center space-y-8 pt-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <CheckCircle2 className="w-20 h-20 text-[#5A5A40]" />
                </motion.div>

                <div className="text-center space-y-3">
                  <h2 className="text-3xl font-light leading-tight">
                    Отлично!
                  </h2>
                  <p className="text-base font-sans opacity-60 leading-relaxed">
                    {selectedTopic?.id === 'other' && customText.trim()
                      ? 'Твой запрос скопирован в буфер. Вставь его в чат с Валерием — он ответит в течение нескольких часов.'
                      : 'Валерий получил твой запрос и ответит в Telegram в течение нескольких часов в рабочие дни.'}
                  </p>
                  {selectedTopic?.id === 'other' && customText.trim() && (
                    <div className="mt-3 p-3 bg-[#5A5A40]/5 rounded-xl">
                      <p className="text-xs font-sans opacity-50 mb-1">Скопировано:</p>
                      <p className="text-sm font-sans opacity-70 italic">«{customText}»</p>
                    </div>
                  )}
                </div>

                <div className="w-full p-5 bg-white rounded-2xl border border-black/5 space-y-3">
                  <p className="text-sm font-sans font-bold opacity-60 uppercase tracking-widest">
                    Что будет дальше
                  </p>
                  <div className="space-y-3">
                    {[
                      { step: '1', text: 'Валерий напишет тебе в Telegram' },
                      { step: '2', text: 'Коротко расскажешь о своей ситуации' },
                      { step: '3', text: 'Получишь конкретный разбор и первый шаг' },
                    ].map((item) => (
                      <div key={item.step} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#5A5A40] flex items-center justify-center shrink-0">
                          <span className="text-white text-xs font-sans font-bold">{item.step}</span>
                        </div>
                        <p className="text-sm font-sans opacity-70">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full space-y-3">
                  <p className="text-xs font-sans text-center opacity-50">
                    Знаешь кого-то, кому это может помочь?
                  </p>
                  <button
                    onClick={handleShare}
                    className="w-full py-4 bg-white border border-[#5A5A40]/20 text-[#5A5A40] rounded-2xl font-sans font-bold text-sm hover:bg-[#5A5A40]/5 transition-all flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Поделиться навигатором
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        <footer className="mt-12 pt-6 border-t border-black/5 text-center">
          <p className="text-[10px] font-sans uppercase tracking-[0.2em] opacity-30">
            Навигатор самочувствия • 2026
          </p>
        </footer>
      </div>

      <BottomNav
        screen={screen}
        onStart={() => setScreen('intro')}
        onWrite={handleWrite}
        onShare={handleShare}
      />
    </div>
  );
}

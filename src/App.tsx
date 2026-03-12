/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight,
  MessageCircle,
  ClipboardCheck,
  Search,
  ArrowLeft,
  Sparkles,
  Zap,
  Moon,
  Droplets,
  Scale,
  Brain,
} from 'lucide-react';
import { TOPICS, NEXT_STEPS, SPECIALIST, SOCIAL_PROOF, Topic } from './constants';

declare global {
  interface Window {
    Telegram: any;
  }
}

type Screen = 'intro' | 'welcome' | 'explanation' | 'selection' | 'action';

// Прогресс-бар: сколько шагов из 3 пройдено
const SCREEN_STEP: Record<Screen, number> = {
  intro: 0,
  welcome: 1,
  explanation: 2,
  selection: 3,
  action: 3,
};

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
      <div className="px-4 py-3 bg-[#5A5A40]/5 rounded-xl border-l-2 border-[#5A5A40]/30">
        <p className="text-sm font-sans opacity-70 italic leading-relaxed">
          {SPECIALIST.testimonial}
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#f5f5f0');
    }
  }, []);

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setScreen('explanation');
  };

  const handleNextStep = (stepId: string) => {
    setSelectedStep(stepId);
    setScreen('action');
  };

  const goBack = () => {
    if (screen === 'welcome') setScreen('intro');
    if (screen === 'explanation') setScreen('welcome');
    if (screen === 'selection') setScreen('explanation');
    if (screen === 'action') setScreen('selection');
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
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(
        `https://t.me/${SPECIALIST.username}`
      );
    } else {
      window.open(`https://t.me/${SPECIALIST.username}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1a1a1a] font-serif">
      <div className="max-w-md mx-auto px-6 py-8 flex flex-col min-h-screen">

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
          {screen !== 'intro' && (
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
                  {/* Бесплатно + соцдоказательство */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-sans font-bold rounded-full uppercase tracking-wide">
                      Бесплатно
                    </span>
                    <span className="text-xs font-sans opacity-50">
                      {SOCIAL_PROOF.count} {SOCIAL_PROOF.label}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-3xl font-light leading-tight">
                      Почему ты устаёшь, плохо спишь или не можешь сбросить вес — и что за этим стоит
                    </h2>
                    <p className="text-base font-sans opacity-60 leading-relaxed">
                      Ответь на 3 вопроса и получи бесплатное объяснение своих симптомов от специалиста.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      '3 вопроса — 2 минуты',
                      'Простой язык, без медицинских терминов',
                      'Реальный специалист, не бот',
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
            {screen === 'welcome' && (
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
                    {selectedTopic.focusAreas.map((area, i) => (
                      <div
                        key={i}
                        className="p-3 bg-white rounded-xl border border-black/5 text-sm font-sans"
                      >
                        {area}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-[#5A5A40] text-white rounded-3xl space-y-4 shadow-xl">
                  <p className="text-base leading-relaxed opacity-90">
                    Чтобы не гадать по симптомам — важно смотреть на организм системно. Следующий шаг поможет выбрать формат разговора.
                  </p>
                  <button
                    onClick={() => setScreen('selection')}
                    className="w-full py-4 bg-white text-[#5A5A40] rounded-2xl font-sans font-bold uppercase tracking-widest text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                  >
                    Продолжить
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Screen 3: Next Step Selection */}
            {screen === 'selection' && (
              <motion.div
                key="selection"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <p className="text-xs font-sans font-bold uppercase tracking-widest opacity-40">
                    Шаг 3 из 3
                  </p>
                  <h2 className="text-3xl font-light leading-tight">
                    Как удобнее начать?
                  </h2>
                  <p className="text-sm font-sans opacity-60">
                    Выбери формат — без обязательств
                  </p>
                </div>

                <div className="space-y-4">
                  {NEXT_STEPS.map((step) => (
                    <button
                      key={step.id}
                      onClick={() => handleNextStep(step.id)}
                      className="w-full p-6 bg-white rounded-3xl border border-black/5 shadow-sm hover:shadow-md hover:border-[#5A5A40]/30 transition-all text-left group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1 p-2 rounded-xl bg-[#5A5A40]/5 group-hover:bg-[#5A5A40]/10 transition-colors">
                          {step.id === 'review' && <Search className="w-5 h-5 text-[#5A5A40]" />}
                          {step.id === 'tracker' && <ClipboardCheck className="w-5 h-5 text-[#5A5A40]" />}
                          {step.id === 'question' && <MessageCircle className="w-5 h-5 text-[#5A5A40]" />}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-lg font-medium">{step.title}</h4>
                          <p className="text-sm font-sans opacity-60 leading-snug">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Screen 4: Action */}
            {screen === 'action' && selectedStep && selectedTopic && (
              <motion.div
                key="action"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8"
              >
                <div className="text-center space-y-3 py-6">
                  <div className="w-20 h-20 bg-[#5A5A40]/10 rounded-full flex items-center justify-center mx-auto">
                    {selectedStep === 'review' && <Search className="w-10 h-10 text-[#5A5A40]" />}
                    {selectedStep === 'tracker' && <ClipboardCheck className="w-10 h-10 text-[#5A5A40]" />}
                    {selectedStep === 'question' && <MessageCircle className="w-10 h-10 text-[#5A5A40]" />}
                  </div>
                  <h2 className="text-2xl font-light leading-tight">
                    {selectedStep === 'review' && 'Первичный разбор'}
                    {selectedStep === 'tracker' && 'Трекер здоровья'}
                    {selectedStep === 'question' && 'Задать вопрос'}
                  </h2>
                  <p className="text-base font-sans opacity-60 max-w-xs mx-auto leading-relaxed">
                    {selectedStep === 'review' && `Тема: ${selectedTopic.title}. Специалист получит её сразу при открытии чата.`}
                    {selectedStep === 'tracker' && 'Системный взгляд на показатели организма вместе со специалистом.'}
                    {selectedStep === 'question' && 'Уточни любые детали, которые тебя беспокоят.'}
                  </p>
                </div>

                {/* Карточка специалиста */}
                <SpecialistCard />

                {/* Срочность */}
                <div className="flex items-center justify-center gap-2 py-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-sm font-sans text-emerald-700 font-medium">
                    Осталось {SPECIALIST.slotsLeft} места на этой неделе
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleFinalAction}
                    className="w-full py-5 bg-[#5A5A40] text-white rounded-2xl font-sans font-bold text-sm shadow-lg hover:bg-[#4a4a35] transition-all flex items-center justify-center gap-3"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Получить бесплатный разбор
                  </button>
                  <p className="text-xs font-sans text-center opacity-40 leading-relaxed px-4">
                    Без обязательств. Просто разговор со специалистом.
                  </p>
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
    </div>
  );
}

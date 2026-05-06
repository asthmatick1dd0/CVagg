import React, { useState, useRef, useEffect } from 'react';
import { useResumeContext } from '@/contexts/ResumeContext';
import { aiApi } from '@/services/aiService';
import type { ChatMessage, Analysis } from '@/types/ai.types';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Textarea } from '@/components/ui/textarea';

const genId = () => Math.random().toString(36).slice(2, 10);

const AnalysisBlock = ({ analysis }: { analysis: Analysis }) => {
  const scoreColor = analysis.overall_score >= 70 ? 'text-green-500'
    : analysis.overall_score >= 40 ? 'text-yellow-500'
      : 'text-red-500';

  return (
    <div className="space-y-4 text-sm">
      <div className="flex items-center gap-3">
        <span className="text-gray-500">Оценка:</span>
        <span className={`text-2xl font-bold ${scoreColor}`}>
          {analysis.overall_score}/100
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${analysis.overall_score >= 70 ? 'bg-green-500' :
            analysis.overall_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
          style={{ width: `${analysis.overall_score}%` }}
        />
      </div>

      {analysis.summary && <p className="italic text-gray-600">{analysis.summary}</p>}

      {analysis.strengths?.length > 0 && (
        <details open>
          <summary className="cursor-pointer font-semibold text-green-700">Сильные стороны</summary>
          <ul className="mt-2 ml-5 list-disc space-y-1 text-gray-700">
            {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </details>
      )}

      {analysis.weaknesses?.length > 0 && (
        <details open>
          <summary className="cursor-pointer font-semibold text-yellow-700">Слабые стороны</summary>
          <ul className="mt-2 ml-5 list-disc space-y-1 text-gray-700">
            {analysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </details>
      )}

      {analysis.suggestions?.length > 0 && (
        <details open>
          <summary className="cursor-pointer font-semibold text-blue-700">Рекомендации</summary>
          <ul className="mt-2 ml-5 list-disc space-y-1 text-gray-700">
            {analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </details>
      )}
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex items-end gap-3">
    {/* Маскот думает */}
    <div className="flex-shrink-0 self-end">
      <img
        src="/mascot.svg"
        alt="mascot"
        className="w-10 h-10 animate-pulse"
      />
    </div>
    <div className="relative bg-white border border-gray-200 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3">
      {/* Хвостик облачка */}
      <div className="absolute -left-2 bottom-2 w-3 h-3 bg-white border-l border-b border-gray-200 rotate-45" />
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </div>
    </div>
  </div>
);

const MascotBubble = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-end gap-1 max-w-[90%]">
    <div className="flex-shrink-0 self-end">
      <img
        src="/mascot.svg"
        alt="mascot"
        className="-mb-8 w-40 h-40 drop-shadow-sm"
      />
    </div>
    <div className="relative bg-white border border-gray-200 shadow-sm rounded-2xl rounded-bl-xs px-4 py-3 min-w-0">
      <div className="relative z-10">
        {children}
      </div>
    </div>
  </div>
);

const QUICK_PROMPTS = [
  'Проведи полный анализ резюме',
  'Какие навыки стоит добавить?',
  'Оцени мой опыт работы',
];

/* TODO: Выражения маскота в зависимости от score 
const getMascotMood = (messages: ChatMessage[]): string => {
  const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
  if (!lastAssistant?.analysis) return 'normal';
  const score = lastAssistant.analysis.overall_score;
  if (score >= 70) return 'happy';
  if (score >= 40) return 'thinking';
  return 'worried'; 
}; */

export const AIChat = () => {
  const { resumeData } = useResumeContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const userId = resumeData?.user_id || 0;
  const resumeId = resumeData?.id;

  useEffect(() => {
    const container = messagesContainerRef.current;
  if (!container) return;
  
  container.scrollTop = container.scrollHeight;
  }, [messages, loading]);

  const addMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    setMessages(prev => [
      ...prev,
      { ...msg, id: genId(), timestamp: new Date() },
    ]);
  };

  const runFullAnalysis = async () => {
    if (loading || !resumeId) return;

    addMessage({ role: 'user', text: 'Проведи полный анализ моего резюме' });
    setLoading(true);

    try {
      const resp = await aiApi.analyzeResume(resumeId, userId, resumeData);
      addMessage({
        role: 'assistant',
        text: null,
        analysis: resp.data.analysis || null,
      });
    } catch (e: any) {
      console.error('AI Error:', e.response?.data || e);
      addMessage({
        role: 'assistant',
        text: `Ошибка: ${e.response?.data?.message || e.message || 'Не удалось выполнить анализ'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading || !resumeId) return;

    const trimmed = text.trim();
    addMessage({ role: 'user', text: trimmed });
    setInput('');
    setLoading(true);

    const isAnalyzeRequest =
      trimmed.toLowerCase().includes('анализ');

    try {
      if (isAnalyzeRequest) {
        const resp = await aiApi.analyzeResume(resumeId, userId, resumeData);
        addMessage({
          role: 'assistant',
          text: null,
          analysis: resp.data.analysis || null,
        });
      } else {
        const resp = await aiApi.sendMessage(resumeId, userId, resumeData, text);
        addMessage({
          role: 'assistant',
          text: resp.data.message,
        });
      }
    } catch (e: any) {
      console.error('AI Error:', e.response?.data || e);
      addMessage({
        role: 'assistant',
        text: `Ошибка: ${e.response?.data?.message || e.message || 'Не удалось получить ответ'}`,
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus({ preventScroll: true });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-white rounded-lg overflow-hidden border border-gray-300 border-[3px]">
      {/* Шапка */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-300 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/mascot.svg" alt="mascot" className="w-6 h-6" />
          <h3 className="font-semibold text-black text-sm">AI-ассистент</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={runFullAnalysis}
            disabled={loading || !resumeId}
          >
            Анализ
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={clearChat}
            className="border border-primary"
          >
            Очистить
          </Button>
        </div>
      </div>

      {/* Область сообщений */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">

        {messages.length === 0 && (
          <div className="min-h-[85%] flex flex-col items-center justify-center text-center gap-5">
            <img
              src="/mascot.svg"
              alt="mascot"
              className="w-40 h-40 drop-shadow-md animate-bounce"
              style={{ animationDuration: '2s' }}
            />
            <div className="relative bg-white border border-gray-200 shadow-sm rounded-2xl px-5 py-4 max-w-xs">
              <div
                className="absolute -top-[9px] left-1/2 -translate-x-1/2 w-[14px] h-[14px]
                            bg-white border-l border-t border-gray-200 rotate-45 rounded-tl-sm"
              />
              <p className="text-gray-600 text-sm relative z-10">
                Привет! Я помогу улучшить твоё резюме. Задай вопрос или выбери действие.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-2 max-w-sm">
              {QUICK_PROMPTS.map((prompt) => (
                <Button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  disabled={loading}
                  className="text-xs px-3 py-2 rounded-lg bg-white border border-gray-200
                             text-secondary-foreground hover:bg-primary/10 hover:border-primary-300
                             hover:text-primary transition-all disabled:opacity-50"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Сообщения */}
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === 'user' ? (
              <div className="flex justify-end">
                <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-br-xs bg-primary text-white">
                  {msg.text && (
                    <div className="text-sm whitespace-pre-wrap">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <MascotBubble>
                {msg.text && (
                  <div className={`text-sm text-black whitespace-pre-wrap ${msg.analysis ? 'mb-3' : ''}`}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}
                {msg.analysis && <AnalysisBlock analysis={msg.analysis} />}
              </MascotBubble>
            )}
          </div>
        ))}

        {loading && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-gray-300 bg-white">
        <div className="flex items-end gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Напишите сообщение..."
            disabled={loading}
            rows={1}
            className="flex-1 text-black"
            style={{
              height: 'auto',
              minHeight: '42px',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 96) + 'px';
            }}
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim() || !resumeId}
            size="icon"
            className="rounded-xl h-[42px] w-[42px] flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
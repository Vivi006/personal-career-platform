'use client';

import { FormEvent, useState } from 'react';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Chatbot() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    setError('');
    setQuestion('');
    setMessages((current) => [...current, { role: 'user', content: trimmedQuestion }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmedQuestion }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Impossible de contacter le chatbot.');
      }

      setMessages((current) => [...current, { role: 'assistant', content: data.answer }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section aria-labelledby="chatbot-title" className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Assistant IA</p>
        <h2 id="chatbot-title" className="mt-2 text-2xl font-bold text-white">Une question sur le candidat ?</h2>
        <p className="mt-2 text-sm text-slate-400">Les réponses sont limitées aux informations publiques du portfolio.</p>
      </div>

      <div className="mb-5 min-h-24 space-y-3" aria-live="polite">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
              message.role === 'user'
                ? 'ml-8 bg-blue-500/15 text-blue-100'
                : 'mr-8 bg-slate-950 text-slate-200'
            }`}
          >
            {message.content}
          </div>
        ))}
        {loading && <p className="text-sm text-slate-500">Recherche dans les données publiques...</p>}
      </div>

      {error && <p className="mb-4 text-sm text-red-300" role="alert">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="chatbot-question" className="sr-only">Votre question</label>
        <input
          id="chatbot-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          maxLength={2000}
          placeholder="Ex. Quelles sont ses compétences ?"
          className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-blue-500 placeholder:text-slate-600 focus:ring-2"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Envoi...' : 'Demander'}
        </button>
      </form>
    </section>
  );
}

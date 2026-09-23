'use client';

import { FormEvent, useEffect, useState } from 'react';

type Service = {
  id: string;
  name: string;
  duration: number;
  price: number | null;
};

const fallbackServices: Service[] = [
  { id: 'service-consultation-strategique', name: 'Consultation stratégique', duration: 30, price: null },
  { id: 'service-portfolio', name: 'Création ou refonte de portfolio', duration: 60, price: null },
  { id: 'service-site-conversion', name: 'Site vitrine & conversion', duration: 60, price: null },
  { id: 'service-automatisation-crm', name: 'Automatisation CRM & IA', duration: 45, price: null },
];

export default function AppointmentBooking() {
  const [services, setServices] = useState<Service[]>([]);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [date, setDate] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/services', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : [])
      .then((data: Service[]) => setServices(data.length ? data : fallbackServices))
      .catch(() => setServices(fallbackServices));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestName, guestEmail, date: new Date(date).toISOString(), serviceId }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Impossible d’envoyer la demande.');

      setMessage('Votre demande est envoyée. Vitiana vous contactera pour confirmer le créneau.');
      setGuestName('');
      setGuestEmail('');
      setDate('');
      setServiceId('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-3xl border border-slate-800 bg-slate-950/80 p-6 md:grid-cols-2">
      <label className="text-sm text-slate-300">
        Votre nom
        <input required value={guestName} onChange={(event) => setGuestName(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-400" />
      </label>
      <label className="text-sm text-slate-300">
        Votre adresse email
        <input required type="email" value={guestEmail} onChange={(event) => setGuestEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-400" />
      </label>
      <label className="text-sm text-slate-300">
        Type d’échange
        <select required value={serviceId} onChange={(event) => setServiceId(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-400">
          <option value="">Sélectionner une prestation</option>
          {services.map((service) => (
            <option key={service.id || service.name} value={service.id}>{service.name} · {service.duration} min</option>
          ))}
        </select>
      </label>
      <label className="text-sm text-slate-300">
        Date et heure souhaitées
        <input required type="datetime-local" value={date} onChange={(event) => setDate(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-400" />
      </label>
      <div className="md:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p role="status" className="text-sm text-slate-400">{message}</p>
        <button type="submit" disabled={loading || !serviceId} className="rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? 'Envoi en cours...' : 'Demander ce rendez-vous'}
        </button>
      </div>
    </form>
  );
}

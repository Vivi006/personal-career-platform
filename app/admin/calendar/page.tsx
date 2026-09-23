'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Appointment = {
  id: string;
  guestName: string;
  guestEmail: string;
  date: string;
  status: string;
  service: { name: string; duration: number };
};

const statuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

export default function AdminCalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState('');

  async function load() {
    const response = await fetch('/api/appointments');
    if (!response.ok) {
      setError('Impossible de charger les rendez-vous.');
      return;
    }
    setAppointments(await response.json());
  }

  useEffect(() => { void load(); }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    await load();
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-sm text-blue-300 hover:text-blue-200">← Tableau de bord</Link>
        <h1 className="mt-6 text-3xl font-bold">Calendrier des rendez-vous</h1>
        {error && <p className="mt-4 text-red-300">{error}</p>}
        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr><th className="p-4">Date</th><th className="p-4">Contact</th><th className="p-4">Service</th><th className="p-4">Statut</th></tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-b border-slate-800/70">
                  <td className="p-4">{new Date(appointment.date).toLocaleString('fr-FR')}</td>
                  <td className="p-4"><div>{appointment.guestName}</div><div className="text-xs text-slate-500">{appointment.guestEmail}</div></td>
                  <td className="p-4">{appointment.service.name}</td>
                  <td className="p-4">
                    <select value={appointment.status} onChange={(event) => void updateStatus(appointment.id, event.target.value)} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">
                      {statuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!appointments.length && <p className="p-8 text-center text-slate-400">Aucun rendez-vous.</p>}
        </div>
      </div>
    </main>
  );
}

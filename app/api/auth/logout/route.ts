import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json(
    { success: true, message: 'Déconnexion réussie.' },
    { status: 200 }
  );
  response.headers.set('Cache-Control', 'no-store, max-age=0');

  response.cookies.delete('admin_token');

  return response;
}
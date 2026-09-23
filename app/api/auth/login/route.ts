import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../../lib/prisma';
import { signJWT } from '../../../../lib/auth';
import { enforceRateLimit } from '../../../../lib/rate-limit';
import { loginSchema } from '../../../../lib/validations';

export async function POST(request: Request) {
  try {
    const rateLimitResponse = await enforceRateLimit(request, 'auth');

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const result = loginSchema.safeParse(await request.json());

    if (!result.success) {
      return NextResponse.json(
        { error: 'Données de connexion invalides.', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Identifiants invalides ou accès non autorisé.' },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Identifiants invalides.' },
        { status: 401 }
      );
    }

    const token = await signJWT({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      { success: true, message: 'Connexion réussie.' },
      { status: 200 }
    );

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Erreur Login:', error);
    return NextResponse.json(
      { error: 'Une erreur serveur est survenue.' },
      { status: 500 }
    );
  }
}
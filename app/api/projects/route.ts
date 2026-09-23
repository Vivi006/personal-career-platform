import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { verifyJWT } from '../../../lib/auth';
import { cookies } from 'next/headers';
import { enforceRateLimit } from '../../../lib/rate-limit';
import { projectSchema } from '../../../lib/validations';

// GET : Récupérer tous les projets
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Erreur GET Projects:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des projets.' },
      { status: 500 }
    );
  }
}

// POST : Créer un nouveau projet (Protégé Admin)
export async function POST(request: Request) {
  try {
    const rateLimitResponse = await enforceRateLimit(request, 'publicForm');

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !(await verifyJWT(token))) {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
    }

    const result = projectSchema.safeParse(await request.json());

    if (!result.success) {
      return NextResponse.json(
        { error: 'Données de projet invalides.', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { title, description, link, githubUrl, imageUrl, tags } = result.data;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        link: link || null,
        githubUrl: githubUrl || null,
        imageUrl: imageUrl || null,
        tags,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Erreur POST Project:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du projet.' },
      { status: 500 }
    );
  }
}
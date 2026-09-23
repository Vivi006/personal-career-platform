import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { verifyJWT } from '../../../../lib/auth';
import { cookies } from 'next/headers';
import { enforceRateLimit } from '../../../../lib/rate-limit';
import { projectSchema } from '../../../../lib/validations';

// PUT : Modifier un projet par ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const rateLimitResponse = await enforceRateLimit(request, 'publicForm');

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const { id } = await params;
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

    const { title, description, link, githubUrl, imageUrl, tags, published } = result.data;

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        link: link || null,
        githubUrl: githubUrl || null,
        imageUrl: imageUrl || null,
        tags,
        published: published ?? true,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Erreur PUT Project:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du projet.' },
      { status: 500 }
    );
  }
}

// DELETE : Supprimer un projet par ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !(await verifyJWT(token))) {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
    }

    await prisma.project.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Projet supprimé.' });
  } catch (error) {
    console.error('Erreur DELETE Project:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du projet.' },
      { status: 500 }
    );
  }
}
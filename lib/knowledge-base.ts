import { prisma } from './prisma';

export type KnowledgeDocument = {
  sourceType: 'project' | 'experience' | 'skill' | 'article';
  sourceId: string;
  text: string;
};

export async function loadPublicKnowledgeBase(): Promise<KnowledgeDocument[]> {
  const [projects, experiences, skills, articles] = await Promise.all([
    prisma.project.findMany({
      where: { published: true },
      select: { id: true, title: true, description: true, content: true, tags: true },
    }),
    prisma.experience.findMany({
      select: { id: true, company: true, role: true, startDate: true, endDate: true, description: true },
      orderBy: { startDate: 'desc' },
    }),
    prisma.skill.findMany({
      select: { id: true, name: true, category: true, level: true },
      orderBy: { level: 'desc' },
    }),
    prisma.article.findMany({
      where: { published: true },
      select: { id: true, title: true, slug: true, content: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return [
    ...projects.map((project) => ({
      sourceType: 'project' as const,
      sourceId: project.id,
      text: [
        `Projet: ${project.title}`,
        `Description: ${project.description}`,
        project.content ? `Détails: ${project.content}` : '',
        project.tags.length ? `Technologies: ${project.tags.join(', ')}` : '',
      ].filter(Boolean).join('\n'),
    })),
    ...experiences.map((experience) => ({
      sourceType: 'experience' as const,
      sourceId: experience.id,
      text: [
        `Expérience: ${experience.role} chez ${experience.company}`,
        `Période: ${experience.startDate.toISOString()} - ${experience.endDate?.toISOString() ?? 'aujourd’hui'}`,
        experience.description ? `Description: ${experience.description}` : '',
      ].filter(Boolean).join('\n'),
    })),
    ...skills.map((skill) => ({
      sourceType: 'skill' as const,
      sourceId: skill.id,
      text: [
        `Compétence: ${skill.name}`,
        skill.category ? `Catégorie: ${skill.category}` : '',
        skill.level !== null ? `Niveau: ${skill.level}/5` : '',
      ].filter(Boolean).join('\n'),
    })),
    ...articles.map((article) => ({
      sourceType: 'article' as const,
      sourceId: article.id,
      text: `Article: ${article.title}\nSlug: ${article.slug}\nContenu: ${article.content}`,
    })),
  ];
}

export function rankKnowledgeDocuments(documents: KnowledgeDocument[], question: string) {
  const terms = [...new Set(question.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu) ?? [])];

  return documents
    .map((document) => {
      const normalizedText = document.text.toLowerCase();
      const score = terms.reduce(
        (total, term) => total + (normalizedText.includes(term) ? 1 : 0),
        0,
      );

      return { document, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ document }) => document);
}

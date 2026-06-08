import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const blog = await prisma.blog.findUnique({
      where: { slug: slug },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error: any) {
    console.error('Fetch Blog by Slug Error:', error);
    return NextResponse.json({ error: 'Error fetching blog' }, { status: 500 });
  }
}

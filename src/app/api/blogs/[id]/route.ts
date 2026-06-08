import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const blog = await prisma.blog.findUnique({
      where: { id: id },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error: any) {
    console.error('Fetch Blog Error:', error);
    return NextResponse.json({ error: 'Error fetching blog' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, slug, content, image, author, category, tags, active } = body;

    const blog = await prisma.blog.update({
      where: { id: id },
      data: {
        title,
        slug,
        content,
        image,
        author: author || 'Admin',
        category,
        tags,
        active,
      },
    });

    return NextResponse.json({ success: true, blog });
  } catch (error: any) {
    console.error('Update Blog Error:', error);
    return NextResponse.json({ error: 'Error updating blog' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.blog.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true, message: 'Blog deleted' });
  } catch (error: any) {
    console.error('Delete Blog Error:', error);
    return NextResponse.json({ error: 'Error deleting blog' }, { status: 500 });
  }
}

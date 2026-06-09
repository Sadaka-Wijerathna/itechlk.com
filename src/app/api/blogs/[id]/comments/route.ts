import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: blogId } = await params;
    const body = await req.json();
    const { name, email, comment } = body;

    if (!name || !email || !comment) {
      return NextResponse.json({ error: 'Name, Email, and Comment are required' }, { status: 400 });
    }

    // Verify the blog exists
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const newComment = await prisma.blogComment.create({
      data: {
        blogId,
        name,
        email,
        comment,
        approved: false, // Starts as pending moderation
      },
    });

    return NextResponse.json({ success: true, comment: newComment }, { status: 201 });
  } catch (error: any) {
    console.error('Create Blog Comment Error:', error);
    return NextResponse.json({ error: 'Error submitting comment' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const comments = await prisma.blogComment.findMany({
      include: {
        blog: {
          select: {
            title: true,
            slug: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(comments);
  } catch (error: any) {
    console.error('Fetch Admin Comments Error:', error);
    return NextResponse.json({ error: 'Error fetching comments' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, approved } = body;

    if (!id || typeof approved !== 'boolean') {
      return NextResponse.json({ error: 'Missing comment ID or approved status' }, { status: 400 });
    }

    const comment = await prisma.blogComment.update({
      where: { id },
      data: { approved },
    });

    return NextResponse.json({ success: true, comment });
  } catch (error: any) {
    console.error('Update Comment Status Error:', error);
    return NextResponse.json({ error: 'Error updating comment' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing comment ID' }, { status: 400 });
    }

    await prisma.blogComment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Comment deleted' });
  } catch (error: any) {
    console.error('Delete Comment Error:', error);
    return NextResponse.json({ error: 'Error deleting comment' }, { status: 500 });
  }
}

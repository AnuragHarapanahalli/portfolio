import { NextRequest, NextResponse } from 'next/server';
import {
  getAllProjects,
  createProject,
  updateProject,
  updateProjectOrder,
  deleteProject,
} from '@/lib/projects-service';
import { isSupabaseConfigured } from '@/lib/supabase';

function isAuthorized(request: NextRequest): boolean {
  return request.cookies.get('admin_session')?.value === 'authenticated' ||
    request.headers.get('authorization') === `Bearer ${process.env.ADMIN_SECRET || 'admin123'}`;
}

export async function GET() {
  try {
    const projects = await getAllProjects();
    return NextResponse.json({
      projects,
      storageType: isSupabaseConfigured() ? 'supabase' : 'local',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();

    if (!data.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const newProject = await createProject({
      title: data.title,
      tagline: data.tagline || '',
      description: data.description || '',
      category: data.category || 'General',
      tags: Array.isArray(data.tags) ? data.tags : [],
      deploymentType: data.deploymentType,
      renderUrl: data.renderUrl || '',
      healthEndpoint: data.healthEndpoint || '/health',
      githubUrl: data.githubUrl || '',
      demoUrl: data.demoUrl || data.renderUrl || '',
      imageUrl: data.imageUrl || '',
      featured: Boolean(data.featured),
      order: data.order,
    });

    return NextResponse.json({
      success: true,
      project: newProject,
      storageType: isSupabaseConfigured() ? 'supabase' : 'local',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();

    // Check for sequence reorder request
    if (data.orderedIds && Array.isArray(data.orderedIds)) {
      const updatedList = await updateProjectOrder(data.orderedIds);
      return NextResponse.json({
        success: true,
        projects: updatedList,
        storageType: isSupabaseConfigured() ? 'supabase' : 'local',
      });
    }

    const { id, ...updates } = data;

    if (!id) {
      return NextResponse.json({ error: 'Project ID or orderedIds is required' }, { status: 400 });
    }

    const updated = await updateProject(id, updates);
    return NextResponse.json({
      success: true,
      project: updated,
      storageType: isSupabaseConfigured() ? 'supabase' : 'local',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const success = await deleteProject(id);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

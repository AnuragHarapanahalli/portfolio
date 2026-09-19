import { Project } from '@/types/project';
import defaultProjects from '@/data/projects.json';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';

// In-memory cache / fallback for serverless execution
let localProjectsCache: Project[] = [...(defaultProjects as Project[])].sort(
  (a, b) => (a.order ?? 99) - (b.order ?? 99)
);

function syncLocalFile() {
  try {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'data', 'projects.json');
    if (fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(localProjectsCache, null, 2), 'utf-8');
    }
  } catch {
    // Ignore in read-only / serverless runtime
  }
}

function isTableMissingError(error: any): boolean {
  return (
    error?.code === 'PGRST205' ||
    error?.code === '42P01' ||
    String(error?.message || '').toLowerCase().includes('schema cache') ||
    String(error?.message || '').toLowerCase().includes('does not exist')
  );
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('order', { ascending: true, nullsFirst: false });

        if (!error && data && data.length > 0) {
          return data.map((item: any) => ({
            id: item.id,
            title: item.title,
            tagline: item.tagline || '',
            description: item.description || '',
            category: item.category || 'General',
            tags: Array.isArray(item.tags) ? item.tags : (item.tags ? JSON.parse(item.tags) : []),
            deploymentType: item.deployment_type || item.deploymentType,
            renderUrl: item.render_url || item.renderUrl || '',
            healthEndpoint: item.health_endpoint || item.healthEndpoint || '',
            githubUrl: item.github_url || item.githubUrl || '',
            demoUrl: item.demo_url || item.demoUrl || '',
            imageUrl: item.image_url || item.imageUrl || '',
            featured: Boolean(item.featured),
            order: item.order ?? 99,
            createdAt: item.created_at || item.createdAt || new Date().toISOString(),
          }));
        }
      }
    }
  } catch (err) {
    console.error('Error fetching from Supabase, using local fallback:', err);
  }

  // Fallback to local data
  return [...localProjectsCache].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export async function createProject(project: Omit<Project, 'id'> & { id?: string }): Promise<Project> {
  const newProject: Project = {
    ...project,
    id: project.id || `proj-${Date.now()}`,
    createdAt: new Date().toISOString(),
    order: project.order ?? localProjectsCache.length + 1,
  };

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const payload = {
        id: newProject.id,
        title: newProject.title,
        tagline: newProject.tagline,
        description: newProject.description,
        category: newProject.category,
        tags: newProject.tags,
        deployment_type: newProject.deploymentType,
        render_url: newProject.renderUrl,
        health_endpoint: newProject.healthEndpoint,
        github_url: newProject.githubUrl,
        demo_url: newProject.demoUrl,
        image_url: newProject.imageUrl,
        featured: newProject.featured,
        order: newProject.order,
        created_at: newProject.createdAt,
      };

      const { error } = await supabase.from('projects').insert(payload);
      if (error) {
        console.warn('Supabase insert warning:', error.message);
        if (!isTableMissingError(error)) {
          throw new Error(`Failed to save to Supabase: ${error.message}`);
        }
      } else {
        localProjectsCache.push(newProject);
        localProjectsCache.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
        syncLocalFile();
        return newProject;
      }
    }
  }

  // Update in-memory fallback
  localProjectsCache.push(newProject);
  localProjectsCache.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  syncLocalFile();
  return newProject;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const payload: any = {};
      if (updates.title !== undefined) payload.title = updates.title;
      if (updates.tagline !== undefined) payload.tagline = updates.tagline;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.category !== undefined) payload.category = updates.category;
      if (updates.tags !== undefined) payload.tags = updates.tags;
      if (updates.deploymentType !== undefined) payload.deployment_type = updates.deploymentType;
      if (updates.renderUrl !== undefined) payload.render_url = updates.renderUrl;
      if (updates.healthEndpoint !== undefined) payload.health_endpoint = updates.healthEndpoint;
      if (updates.githubUrl !== undefined) payload.github_url = updates.githubUrl;
      if (updates.demoUrl !== undefined) payload.demo_url = updates.demoUrl;
      if (updates.imageUrl !== undefined) payload.image_url = updates.imageUrl;
      if (updates.featured !== undefined) payload.featured = updates.featured;
      if (updates.order !== undefined) payload.order = updates.order;

      const { error } = await supabase.from('projects').update(payload).eq('id', id);
      if (error) {
        console.warn('Supabase update warning:', error.message);
        if (!isTableMissingError(error)) {
          throw new Error(`Failed to update in Supabase: ${error.message}`);
        }
      }
    }
  }

  const idx = localProjectsCache.findIndex((p) => p.id === id);
  if (idx !== -1) {
    localProjectsCache[idx] = { ...localProjectsCache[idx], ...updates };
    if (updates.order !== undefined) {
      localProjectsCache.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    }
    syncLocalFile();
    return localProjectsCache[idx];
  }

  throw new Error('Project not found');
}

export async function updateProjectOrder(orderedIds: string[]): Promise<Project[]> {
  // Update in-memory cache with new sequence index
  orderedIds.forEach((id, index) => {
    const proj = localProjectsCache.find((p) => p.id === id);
    if (proj) {
      proj.order = index + 1;
    }
  });

  localProjectsCache.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  // Sync with Supabase if configured
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const updatePromises = orderedIds.map((id, index) =>
          supabase.from('projects').update({ order: index + 1 }).eq('id', id)
        );
        await Promise.allSettled(updatePromises);
      } catch (err) {
        console.warn('Failed to update project sequence in Supabase:', err);
      }
    }
  }

  syncLocalFile();
  return [...localProjectsCache];
}

export async function deleteProject(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) {
        console.warn('Supabase delete warning:', error.message);
        if (!isTableMissingError(error)) {
          throw new Error(`Failed to delete from Supabase: ${error.message}`);
        }
      }
    }
  }

  const prevLen = localProjectsCache.length;
  localProjectsCache = localProjectsCache.filter((p) => p.id !== id);
  syncLocalFile();
  return localProjectsCache.length < prevLen;
}

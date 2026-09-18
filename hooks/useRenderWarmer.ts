'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Project, ProjectHealthInfo } from '@/types/project';

// Determine if a project is a Render backend container that needs cold-start pre-warming
export function isRenderProject(project: Project): boolean {
  if (project.deploymentType === 'static' || project.deploymentType === 'vercel') {
    return false;
  }
  if (project.deploymentType === 'render') {
    return Boolean(project.renderUrl || project.demoUrl);
  }
  // Default fallback: if renderUrl is provided and doesn't explicitly belong to static/vercel
  return Boolean(project.renderUrl);
}

export function useRenderWarmer(projects: Project[]) {
  const [healthMap, setHealthMap] = useState<Record<string, ProjectHealthInfo>>({});
  const [isWarmingAll, setIsWarmingAll] = useState(false);
  const polledCountRef = useRef<Record<string, number>>({});
  const activePingsRef = useRef<Set<string>>(new Set());

  // Ping a single project
  const pingProject = useCallback(async (project: Project, attempt = 1) => {
    // Only Render services require pre-warming
    if (!isRenderProject(project)) return;

    const targetUrl = project.renderUrl || project.demoUrl;
    if (!targetUrl) return;

    const fullTarget = project.healthEndpoint
      ? `${targetUrl.replace(/\/$/, '')}${project.healthEndpoint.startsWith('/') ? '' : '/'}${project.healthEndpoint}`
      : targetUrl;

    setHealthMap((prev) => ({
      ...prev,
      [project.id]: {
        id: project.id,
        status: 'warming',
        lastPinged: new Date().toLocaleTimeString(),
        latencyMs: prev[project.id]?.latencyMs,
      },
    }));

    // 1. Direct browser fire-and-forget ping with no-cors
    // This immediately hits Render's proxy edge and wakes up the container!
    try {
      fetch(fullTarget, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-store',
      }).catch(() => {});
    } catch {
      // Ignore cross-origin browser constraints
    }

    // 2. Query our internal serverless API to get precise telemetry
    try {
      const res = await fetch(`/api/health-check?url=${encodeURIComponent(fullTarget)}`, {
        cache: 'no-store',
      });
      const data = await res.json();

      setHealthMap((prev) => ({
        ...prev,
        [project.id]: {
          id: project.id,
          status: data.status || 'warming',
          latencyMs: data.latencyMs,
          lastPinged: new Date().toLocaleTimeString(),
          errorMessage: data.message,
        },
      }));

      // If still warming and hasn't exceeded 4 attempts, retry in 8s
      if (data.status === 'warming' && attempt < 5) {
        polledCountRef.current[project.id] = (polledCountRef.current[project.id] || 0) + 1;
        setTimeout(() => {
          pingProject(project, attempt + 1);
        }, 8000);
      }
    } catch {
      setHealthMap((prev) => ({
        ...prev,
        [project.id]: {
          id: project.id,
          status: 'warming',
          lastPinged: new Date().toLocaleTimeString(),
        },
      }));
    }
  }, []);

  // Warm all Render projects at once
  const warmAll = useCallback(async () => {
    setIsWarmingAll(true);
    const promises = projects
      .filter(isRenderProject)
      .map((p) => pingProject(p, 1));

    await Promise.allSettled(promises);
    setIsWarmingAll(false);
  }, [projects, pingProject]);

  // Initial trigger on mount for Render backends
  useEffect(() => {
    if (projects.length === 0) return;

    // Small delay to ensure smooth initial hydration and rendering
    const timer = setTimeout(() => {
      projects.forEach((proj) => {
        if (isRenderProject(proj) && !activePingsRef.current.has(proj.id)) {
          activePingsRef.current.add(proj.id);
          pingProject(proj, 1);
        }
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [projects, pingProject]);

  // Trigger high-priority ping on hover
  const warmOnHover = useCallback(
    (projectId: string) => {
      const project = projects.find((p) => p.id === projectId);
      if (!project || !isRenderProject(project)) return;

      const current = healthMap[projectId];
      // Only re-ping if not already online
      if (current?.status !== 'online') {
        pingProject(project, 1);
      }
    },
    [projects, healthMap, pingProject]
  );

  // Compute summary stats
  const renderProjects = projects.filter(isRenderProject);
  const onlineRender = Object.values(healthMap).filter((h) => h.status === 'online').length;
  const warmingRender = Object.values(healthMap).filter((h) => h.status === 'warming').length;

  const stats = {
    total: renderProjects.length,
    online: onlineRender,
    warming: warmingRender,
    idle: Math.max(0, renderProjects.length - Object.keys(healthMap).length),
  };

  return {
    healthMap,
    warmProject: pingProject,
    warmOnHover,
    warmAll,
    isWarmingAll,
    stats,
  };
}

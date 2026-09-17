'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Project } from '@/types/project';
import { StampButton } from '@/components/StampButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Lock,
  Plus,
  Trash2,
  Edit,
  Download,
  RefreshCw,
  ArrowLeft,
  Database,
  XCircle,
  Radio,
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [storageType, setStorageType] = useState<'supabase' | 'local'>('local');
  const [fetchingProjects, setFetchingProjects] = useState(false);

  // Test ping states per project
  const [pingStates, setPingStates] = useState<Record<string, { status: string; latency?: number }>>({});

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    tagline: '',
    description: '',
    category: 'Full-Stack Web',
    tags: [],
    renderUrl: '',
    healthEndpoint: '/health',
    githubUrl: '',
    demoUrl: '',
    imageUrl: '',
    featured: false,
  });
  const [tagsInput, setTagsInput] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch projects on load
  const loadProjects = async () => {
    setFetchingProjects(true);
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
        setStorageType(data.storageType || 'local');
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setFetchingProjects(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Handle PIN Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        loadProjects();
      } else {
        setAuthError(data.error || 'Authentication failed. Incorrect passcode.');
      }
    } catch {
      setAuthError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setIsAuthenticated(false);
    setPasscode('');
  };

  // Open Modal for Add
  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      tagline: '',
      description: '',
      category: 'Full-Stack Web',
      tags: [],
      renderUrl: '',
      healthEndpoint: '/health',
      githubUrl: '',
      demoUrl: '',
      imageUrl: '',
      featured: false,
    });
    setTagsInput('');
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({ ...project });
    setTagsInput(project.tags ? project.tags.join(', ') : '');
    setIsModalOpen(true);
  };

  // Save Project (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    setSaving(true);
    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      tags: parsedTags,
    };

    try {
      if (editingProject) {
        const res = await fetch('/api/admin/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingProject.id, ...payload }),
        });
        if (res.ok) {
          setIsModalOpen(false);
          loadProjects();
        }
      } else {
        const res = await fetch('/api/admin/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setIsModalOpen(false);
          loadProjects();
        }
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  // Delete Project
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this project sheet?')) return;

    try {
      const res = await fetch(`/api/admin/projects?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        loadProjects();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Test Ping a Render Project
  const handleTestPing = async (project: Project) => {
    if (!project.renderUrl) return;

    const fullUrl = project.healthEndpoint
      ? `${project.renderUrl.replace(/\/$/, '')}${project.healthEndpoint.startsWith('/') ? '' : '/'}${project.healthEndpoint}`
      : project.renderUrl;

    setPingStates((prev) => ({
      ...prev,
      [project.id]: { status: 'warming' },
    }));

    try {
      const res = await fetch(`/api/health-check?url=${encodeURIComponent(fullUrl)}`);
      const data = await res.json();
      setPingStates((prev) => ({
        ...prev,
        [project.id]: { status: data.status, latency: data.latencyMs },
      }));
    } catch {
      setPingStates((prev) => ({
        ...prev,
        [project.id]: { status: 'error' },
      }));
    }
  };

  // Export projects.json
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(projects, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projects.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-parchment-100 dark:bg-dark-bg text-charcoal-900 dark:text-parchment-100 pb-20 transition-colors">
      {/* Top Header */}
      <header className="border-b border-charcoal-900/20 dark:border-white/10 bg-parchment-50/90 dark:bg-charcoal-900/90 backdrop-blur-md px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 font-mono text-xs text-charcoal-700 dark:text-charcoal-300 hover:text-blueprint-600 dark:hover:text-blueprint-400 transition-colors bg-parchment-200 dark:bg-charcoal-800 px-2.5 py-1 rounded-xs border border-charcoal-900/20 dark:border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Portfolio</span>
          </Link>

          <div className="h-4 w-[1px] bg-charcoal-300 dark:bg-charcoal-700 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold tracking-tight text-charcoal-900 dark:text-white">
              DISPATCH // PROJECT MANAGER
            </span>
            <span className="text-charcoal-400 font-mono text-xs">/</span>
            <span
              className={`font-mono text-[10px] px-2 py-0.5 rounded-xs border font-semibold ${
                storageType === 'supabase'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
              }`}
            >
              {storageType === 'supabase' ? '● SUPABASE POSTGRESQL' : '○ LOCAL JSON STORE'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="font-mono text-xs text-terracotta-600 dark:text-terracotta-400 hover:underline cursor-pointer"
            >
              Sign Out
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-10">
        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="max-w-md mx-auto mt-12 bg-parchment-50 dark:bg-charcoal-900 border border-charcoal-900/30 dark:border-white/15 rounded-[3px] shadow-paper-lg p-8 select-none">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-sm bg-blueprint-500 text-white flex items-center justify-center mx-auto mb-3 shadow-paper-sm">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="font-display text-2xl font-bold text-charcoal-900 dark:text-white">
                Admin Authentication
              </h2>
              <p className="mt-1 font-mono text-xs text-charcoal-600 dark:text-charcoal-400">
                Enter your security passcode to manage portfolio project sheets.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-charcoal-700 dark:text-charcoal-300 mb-1 font-semibold">
                  Admin Passcode
                </label>
                <input
                  type="password"
                  placeholder="Enter admin passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-parchment-100 dark:bg-charcoal-800 border border-charcoal-900/30 dark:border-white/15 rounded-[2px] font-mono text-sm focus:outline-none focus:border-blueprint-500 text-charcoal-900 dark:text-white shadow-paper-sm"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-[2px] font-mono text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <StampButton
                type="submit"
                variant="blueprint"
                size="md"
                className="w-full justify-center"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Unlock Dispatch Panel'}
              </StampButton>

              <div className="pt-3 text-center font-mono text-[11px] text-charcoal-500 dark:text-charcoal-400">
                Configure custom passcode via <code className="text-blueprint-600 dark:text-blueprint-400">ADMIN_SECRET</code> in your Vercel project environment settings.
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Project Management Dashboard */
          <div>
            {/* Dashboard Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-charcoal-900/20 dark:border-white/10">
              <div>
                <h1 className="font-display text-3xl font-bold text-charcoal-900 dark:text-white tracking-tight">
                  Portfolio Projects Index
                </h1>
                <p className="mt-1 font-mono text-xs text-charcoal-600 dark:text-charcoal-400">
                  {projects.length} specifications cataloged. Changes apply live to your portfolio.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleExportJson}
                  className="px-3 py-2 bg-parchment-50 dark:bg-charcoal-800 border border-charcoal-900/25 dark:border-white/15 rounded-[2px] font-mono text-xs text-charcoal-800 dark:text-charcoal-200 hover:bg-parchment-200 dark:hover:bg-charcoal-700 shadow-paper-sm flex items-center gap-1.5 cursor-pointer"
                  title="Download raw projects.json file"
                >
                  <Download className="w-3.5 h-3.5 text-blueprint-600 dark:text-blueprint-400" />
                  <span>Export JSON</span>
                </button>

                <StampButton
                  onClick={handleOpenAdd}
                  variant="terracotta"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add Project Spec
                </StampButton>
              </div>
            </div>

            {/* Storage Info Banner */}
            <div className="mb-8 p-4 bg-parchment-50 dark:bg-charcoal-800 border border-charcoal-900/20 dark:border-white/15 rounded-[2px] shadow-paper-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-blueprint-600 dark:text-blueprint-400 shrink-0" />
                <div>
                  <span className="font-bold text-charcoal-900 dark:text-white">
                    Storage Provider: {storageType === 'supabase' ? 'Supabase PostgreSQL' : 'Local File / Memory'}
                  </span>
                  <p className="text-[11px] text-charcoal-600 dark:text-charcoal-400 mt-0.5">
                    {storageType === 'supabase'
                      ? 'Connected to your cloud database. Updates appear instantly in production.'
                      : 'Running in fallback mode. Connect Supabase by setting NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'}
                  </p>
                </div>
              </div>

              <button
                onClick={loadProjects}
                disabled={fetchingProjects}
                className="text-blueprint-600 dark:text-blueprint-400 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
              >
                <RefreshCw className={`w-3 h-3 ${fetchingProjects ? 'animate-spin' : ''}`} />
                <span>Reload</span>
              </button>
            </div>

            {/* Projects Table / List */}
            <div className="space-y-4">
              {projects.map((p, idx) => {
                const ping = pingStates[p.id];
                return (
                  <div
                    key={p.id}
                    className="bg-parchment-50 dark:bg-charcoal-900 border border-charcoal-900/25 dark:border-white/15 rounded-[3px] shadow-paper p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 rounded-[2px] bg-parchment-200 dark:bg-charcoal-800 border border-charcoal-900/20 dark:border-white/10 flex items-center justify-center font-mono font-bold text-xs text-blueprint-600 dark:text-blueprint-400 shrink-0">
                        #{String(idx + 1).padStart(2, '0')}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-display font-bold text-lg text-charcoal-900 dark:text-white">
                            {p.title}
                          </h3>
                          <span className="px-2 py-0.5 bg-parchment-200 dark:bg-charcoal-800 border border-charcoal-900/10 dark:border-white/10 rounded-xs font-mono text-[10px] uppercase text-charcoal-700 dark:text-charcoal-300">
                            {p.category}
                          </span>
                          {p.featured && (
                            <span className="px-1.5 py-0.2 bg-terracotta-600 text-white rounded-xs font-mono text-[9px] font-bold uppercase">
                              Featured
                            </span>
                          )}
                        </div>

                        {p.tagline && (
                          <p className="font-mono text-xs text-charcoal-600 dark:text-charcoal-400 line-clamp-1 mb-2">
                            {p.tagline}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-charcoal-500 dark:text-charcoal-400">
                          {p.renderUrl && (
                            <span className="flex items-center gap-1 text-blueprint-600 dark:text-blueprint-400 truncate max-w-xs">
                              <Radio className="w-3 h-3" />
                              <span className="truncate">{p.renderUrl}</span>
                            </span>
                          )}
                          {p.githubUrl && (
                            <span className="truncate max-w-[150px]">
                              Repo: {p.githubUrl.replace(/^https?:\/\/github\.com\//, '')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions and Render Ping Test */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-charcoal-900/10 dark:border-white/10">
                      {p.renderUrl && (
                        <button
                          onClick={() => handleTestPing(p)}
                          className="px-2.5 py-1.5 bg-parchment-200 dark:bg-charcoal-800 border border-charcoal-900/20 dark:border-white/15 rounded-[2px] font-mono text-xs hover:bg-parchment-300 dark:hover:bg-charcoal-700 transition-colors flex items-center gap-1.5 text-charcoal-800 dark:text-charcoal-200 cursor-pointer"
                          title="Test ping to wake up container"
                        >
                          <Radio
                            className={`w-3 h-3 text-blueprint-600 dark:text-blueprint-400 ${
                              ping?.status === 'warming' ? 'animate-spin' : ''
                            }`}
                          />
                          <span>
                            {ping?.latency ? `${ping.latency}ms` : 'Ping Render'}
                          </span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 hover:bg-parchment-200 dark:hover:bg-charcoal-800 rounded text-charcoal-700 dark:text-charcoal-300 hover:text-blueprint-600 dark:hover:text-blueprint-400 transition-colors cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded text-charcoal-500 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add/Edit Project Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-parchment-50 dark:bg-charcoal-900 border border-charcoal-900/30 dark:border-white/20 rounded-[3px] shadow-paper-lg max-w-2xl w-full p-6 sm:p-8 my-8 select-none">
              <div className="flex items-center justify-between border-b border-charcoal-900/20 dark:border-white/10 pb-4 mb-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-charcoal-900 dark:text-white">
                    {editingProject ? 'Edit Project Sheet' : 'Draft New Project Sheet'}
                  </h2>
                  <span className="font-mono text-xs text-charcoal-500 dark:text-charcoal-400">
                    Direct entry to portfolio index
                  </span>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="font-mono text-xs text-charcoal-500 dark:text-charcoal-400 hover:text-charcoal-900 dark:hover:text-white cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-charcoal-700 dark:text-charcoal-300 mb-1 font-semibold">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Distributed Mesh"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 bg-parchment-100 dark:bg-charcoal-800 border border-charcoal-900/30 dark:border-white/15 rounded-[2px] text-charcoal-900 dark:text-white focus:outline-none focus:border-blueprint-500 shadow-paper-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-charcoal-700 dark:text-charcoal-300 mb-1 font-semibold">
                      Category
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Distributed AI, Full-Stack"
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-parchment-100 dark:bg-charcoal-800 border border-charcoal-900/30 dark:border-white/15 rounded-[2px] text-charcoal-900 dark:text-white focus:outline-none focus:border-blueprint-500 shadow-paper-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-charcoal-700 dark:text-charcoal-300 mb-1 font-semibold">
                    Tagline / One-liner
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. High throughput architectural indexing pipeline"
                    value={formData.tagline || ''}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-3 py-2 bg-parchment-100 dark:bg-charcoal-800 border border-charcoal-900/30 dark:border-white/15 rounded-[2px] text-charcoal-900 dark:text-white focus:outline-none focus:border-blueprint-500 shadow-paper-sm"
                  />
                </div>

                <div>
                  <label className="block text-charcoal-700 dark:text-charcoal-300 mb-1 font-semibold">
                    Detailed Engineering Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe systems architecture, latency characteristics, and algorithms..."
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-parchment-100 dark:bg-charcoal-800 border border-charcoal-900/30 dark:border-white/15 rounded-[2px] text-charcoal-900 dark:text-white focus:outline-none focus:border-blueprint-500 shadow-paper-sm font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-charcoal-700 dark:text-charcoal-300 mb-1 font-semibold">
                      Render Service URL (Wakes up on visit!)
                    </label>
                    <input
                      type="url"
                      placeholder="https://my-app.onrender.com"
                      value={formData.renderUrl || ''}
                      onChange={(e) => setFormData({ ...formData, renderUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-parchment-100 dark:bg-charcoal-800 border border-charcoal-900/30 dark:border-white/15 rounded-[2px] text-charcoal-900 dark:text-white focus:outline-none focus:border-blueprint-500 shadow-paper-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-charcoal-700 dark:text-charcoal-300 mb-1 font-semibold">
                      Health Check Endpoint
                    </label>
                    <input
                      type="text"
                      placeholder="/health or /ping"
                      value={formData.healthEndpoint || ''}
                      onChange={(e) => setFormData({ ...formData, healthEndpoint: e.target.value })}
                      className="w-full px-3 py-2 bg-parchment-100 dark:bg-charcoal-800 border border-charcoal-900/30 dark:border-white/15 rounded-[2px] text-charcoal-900 dark:text-white focus:outline-none focus:border-blueprint-500 shadow-paper-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-charcoal-700 dark:text-charcoal-300 mb-1 font-semibold">
                      GitHub Repository URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={formData.githubUrl || ''}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-parchment-100 dark:bg-charcoal-800 border border-charcoal-900/30 dark:border-white/15 rounded-[2px] text-charcoal-900 dark:text-white focus:outline-none focus:border-blueprint-500 shadow-paper-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-charcoal-700 dark:text-charcoal-300 mb-1 font-semibold">
                      Image Mockup URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.imageUrl || ''}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-parchment-100 dark:bg-charcoal-800 border border-charcoal-900/30 dark:border-white/15 rounded-[2px] text-charcoal-900 dark:text-white focus:outline-none focus:border-blueprint-500 shadow-paper-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-charcoal-700 dark:text-charcoal-300 mb-1 font-semibold">
                    Tech Stack Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="TypeScript, Render, Go, PostgreSQL, WebSockets"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-3 py-2 bg-parchment-100 dark:bg-charcoal-800 border border-charcoal-900/30 dark:border-white/15 rounded-[2px] text-charcoal-900 dark:text-white focus:outline-none focus:border-blueprint-500 shadow-paper-sm"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="featuredCheckbox"
                    checked={Boolean(formData.featured)}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-blueprint-600 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="featuredCheckbox" className="text-charcoal-800 dark:text-charcoal-200 cursor-pointer">
                    Feature this project prominently on the portfolio
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-charcoal-900/20 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-charcoal-600 dark:text-charcoal-400 hover:text-charcoal-900 dark:hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>

                  <StampButton type="submit" variant="blueprint" size="sm" disabled={saving}>
                    {saving ? 'Writing Spec...' : editingProject ? 'Update Project Spec' : 'Publish Project Spec'}
                  </StampButton>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

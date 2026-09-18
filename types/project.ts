export type DeploymentType = 'render' | 'vercel' | 'aws' | 'live' | 'static';

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  tags: string[];
  renderUrl?: string;
  deploymentType?: DeploymentType;
  healthEndpoint?: string;
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  featured?: boolean;
  order?: number;
  createdAt?: string;
}

export type ProjectHealthStatus = 'idle' | 'warming' | 'online' | 'error';

export interface ProjectHealthInfo {
  id: string;
  status: ProjectHealthStatus;
  latencyMs?: number;
  lastPinged?: string;
  errorMessage?: string;
}

export interface PortfolioConfig {
  name: string;
  title: string;
  tagline: string;
  email: string;
  heroHeadlineTop: string;
  heroHeadlineStroke: string;
  heroAnnotation1: string;
  heroAnnotation2: string;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

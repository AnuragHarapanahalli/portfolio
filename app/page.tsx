import { getAllProjects } from '@/lib/projects-service';
import { PortfolioApp } from '@/components/PortfolioApp';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const projects = await getAllProjects();

  return <PortfolioApp initialProjects={projects} />;
}

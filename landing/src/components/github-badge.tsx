import { Star } from "lucide-react";
import { GithubLogo } from "@/components/logos";

interface GitHubBadgeProps {
  repo: string;
  className?: string;
}

async function getStars(repo: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.stargazers_count;
  } catch {
    return null;
  }
}

export async function GitHubBadge({ repo, className }: GitHubBadgeProps) {
  const stars = await getStars(repo);

  return (
    <a
      href={`https://github.com/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors ${className}`}
    >
      <GithubLogo className="h-4 w-4" />
      <span className="font-medium">GitHub</span>
      {stars !== null && (
        <>
          <span className="w-px h-3 bg-border" />
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{formatStars(stars)}</span>
          </span>
        </>
      )}
    </a>
  );
}

function formatStars(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}


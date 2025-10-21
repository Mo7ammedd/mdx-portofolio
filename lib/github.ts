interface GitHubRepo {
  stargazers_count: number
  forks_count: number
  watchers_count: number
  open_issues_count: number
}

interface RepoStats {
  stars: number
  forks: number
}

export async function getGitHubRepoStats(owner: string, repo: string): Promise<RepoStats | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
        next: {
          revalidate: 3600,
        },
      }
    )

    if (!response.ok) {
      return null
    }

    const data: GitHubRepo = await response.json()

    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
    }
  } catch (error) {
    console.error('Error fetching GitHub stats:', error)
    return null
  }
}

export function extractGitHubInfo(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/)
  if (!match) return null
  
  return {
    owner: match[1],
    repo: match[2],
  }
}

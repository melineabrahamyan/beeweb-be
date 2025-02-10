import { Workspace } from '../workspace.entity';

export const getMaxSuffix = (
  slug: string,
  workspaces: Partial<Workspace>[],
): number => {
  const maxSuffix = workspaces
    .map((ws) => ws.name.match(new RegExp(`^${slug}(\\d+)?$`))) // Match numbers  O(n)
    .filter((match) => match && match[1]) // Keep only valid numbers  O(n)
    .map((match) => parseInt(match![1], 10)) // Convert to numbers  O(n)
    .reduce((max, num) => Math.max(max, num), 0); // Find max  O(n)

  return maxSuffix;
};

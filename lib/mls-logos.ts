export async function fetchMLSLogoMap(keys: string[]): Promise<Record<string, string>> {
  const uniqueKeys = [...new Set(keys.map((k) => k.trim()).filter(Boolean))];
  if (uniqueKeys.length === 0) return {};

  try {
    const params = new URLSearchParams({ teams: uniqueKeys.join(',') });
    const res = await fetch(`/api/mls-logos?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) return {};
    const data = await res.json();
    return (data?.logos as Record<string, string>) ?? {};
  } catch {
    return {};
  }
}

export function getMLSLogo(
  logos: Record<string, string>,
  ...candidates: Array<string | undefined>
): string | null {
  for (const candidate of candidates) {
    if (!candidate) continue;
    const logo = logos[candidate];
    if (typeof logo === 'string' && logo.length > 0) return logo;
  }
  return null;
}

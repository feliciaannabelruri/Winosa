export async function getSiteSettings() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/settings`,
      { next: { revalidate: 3600 } }
    );
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}
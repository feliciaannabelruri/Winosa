export const getAllServices = async (lang: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/services?lang=${lang}`,
    { cache: "no-store" }
  );

  const json = await res.json();
  return json.data;
};

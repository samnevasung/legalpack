export async function onRequest(context) {
  const response = await fetch(
    'https://legalpack-backend-production.up.railway.app/sitemap-properties.xml'
  );
  const xml = await response.text();
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}

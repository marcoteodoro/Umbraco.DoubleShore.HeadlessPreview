import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const path = searchParams.get('path') || '/';
  const id = searchParams.get('id');

  // Validate secret
  if (secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  // Enable draft mode
  const draft = await draftMode();
  draft.enable();

  console.log(`[Preview] Enabled draft mode for content ${id} at path ${path}`);
  
  // Redirect to the content path
  redirect(path);
}

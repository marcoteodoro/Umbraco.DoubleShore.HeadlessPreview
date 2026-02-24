import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') || '/';

  // Disable draft mode
  const draft = await draftMode();
  draft.disable();

  console.log('[Preview] Draft mode disabled');
  
  redirect(path);
}

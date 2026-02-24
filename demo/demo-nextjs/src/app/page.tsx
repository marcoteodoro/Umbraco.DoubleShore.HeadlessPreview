import { draftMode } from 'next/headers';

const UMBRACO_URL = process.env.UMBRACO_URL || 'http://localhost:5000';
const UMBRACO_API_KEY = process.env.UMBRACO_API_KEY || '';

async function getContent(path: string, preview: boolean) {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (preview && UMBRACO_API_KEY) {
      headers['Api-Key'] = UMBRACO_API_KEY;
      headers['Preview'] = 'true';
    }
    
    const res = await fetch(`${UMBRACO_URL}/umbraco/delivery/api/v2/content/item${path}`, {
      headers,
      cache: preview ? 'no-store' : 'force-cache',
    });
    
    if (!res.ok) {
      console.log(`Content fetch failed: ${res.status}`);
      return null;
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching content:', error);
    return null;
  }
}

export default async function Home() {
  const draft = await draftMode();
  const content = await getContent('/', draft.isEnabled);

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Umbraco Headless Preview Demo
        </h1>
        <p className="text-gray-600 mt-2">
          Demonstrating the Umbraco.DoubleShore.HeadlessPreview package
        </p>
      </header>

      <section className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Status</h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Preview Mode:</span>{' '}
            <span className={draft.isEnabled ? 'text-green-600' : 'text-gray-500'}>
              {draft.isEnabled ? '✓ Active' : 'Inactive'}
            </span>
          </p>
          <p>
            <span className="font-medium">Umbraco URL:</span>{' '}
            <code className="bg-gray-200 px-2 py-1 rounded text-sm">{UMBRACO_URL}</code>
          </p>
        </div>
      </section>

      {content ? (
        <section className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Content from Umbraco</h2>
          <div className="prose max-w-none">
            <h3>{content.name}</h3>
            {content.properties?.bodyText && (
              <div dangerouslySetInnerHTML={{ __html: content.properties.bodyText }} />
            )}
            {content.properties?.title && (
              <p><strong>Title:</strong> {content.properties.title}</p>
            )}
          </div>
          <details className="mt-4">
            <summary className="cursor-pointer text-gray-500 text-sm">Raw JSON</summary>
            <pre className="bg-gray-100 p-4 rounded mt-2 text-xs overflow-auto">
              {JSON.stringify(content, null, 2)}
            </pre>
          </details>
        </section>
      ) : (
        <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">No Content Found</h2>
          <p className="text-yellow-700">
            Make sure Umbraco is running at <code>{UMBRACO_URL}</code> and has published content.
          </p>
          <div className="mt-4 text-sm text-yellow-600">
            <p className="font-medium">Setup instructions:</p>
            <ol className="list-decimal ml-5 mt-2 space-y-1">
              <li>Start Umbraco: <code>cd demo/DemoUmbraco && dotnet run</code></li>
              <li>Create a document type with a Rich Text property (alias: bodyText)</li>
              <li>Create and publish content</li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </section>
      )}

      <footer className="mt-12 pt-4 border-t text-center text-gray-500 text-sm">
        <p>
          Built with ❤️ by{' '}
          <a href="https://double-shore.com" className="text-blue-600 hover:underline">
            Double Shore
          </a>
        </p>
      </footer>
    </main>
  );
}

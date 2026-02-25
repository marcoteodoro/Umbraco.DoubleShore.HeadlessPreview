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
    <main className="min-h-screen bg-[#f5f5ff]">
      {/* Header */}
      <header className="bg-white border-b border-[#e5e5ef]">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2027b7] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[#111111]">Headless Preview</h1>
              <p className="text-xs text-[#6b7280]">by Double Shore</p>
            </div>
          </div>
          <a 
            href="https://double-shore.com" 
            target="_blank"
            className="text-sm text-[#2027b7] hover:underline"
          >
            double-shore.com →
          </a>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Status Card */}
        <div className="bg-white rounded-2xl border border-[#e5e5ef] p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${draft.isEnabled ? 'bg-[#cfff5e] animate-pulse' : 'bg-[#e5e5ef]'}`} />
              <div>
                <p className="text-sm text-[#6b7280]">Preview Mode</p>
                <p className={`font-medium ${draft.isEnabled ? 'text-[#2027b7]' : 'text-[#111111]'}`}>
                  {draft.isEnabled ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#f5f5ff] px-4 py-2 rounded-lg">
              <span className="text-xs text-[#6b7280]">Umbraco:</span>
              <code className="text-xs font-mono text-[#2027b7]">{UMBRACO_URL}</code>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {content ? (
          <div className="bg-white rounded-2xl border border-[#e5e5ef] overflow-hidden shadow-sm">
            <div className="bg-[#2027b7] px-6 py-4">
              <h2 className="text-white font-medium">Content from Umbraco</h2>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-[#111111] mb-4">{content.name}</h3>
              {content.properties?.bodyText && (
                <div 
                  className="prose prose-sm max-w-none text-[#333]"
                  dangerouslySetInnerHTML={{ __html: content.properties.bodyText }} 
                />
              )}
              {content.properties?.title && (
                <p className="mt-4 text-[#6b7280]">
                  <span className="font-medium text-[#111111]">Title:</span> {content.properties.title}
                </p>
              )}
              <details className="mt-6 group">
                <summary className="cursor-pointer text-xs text-[#6b7280] hover:text-[#2027b7] transition-colors">
                  View raw JSON
                </summary>
                <pre className="mt-3 bg-[#f5f5ff] p-4 rounded-lg text-xs overflow-auto text-[#333] border border-[#e5e5ef]">
                  {JSON.stringify(content, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#e5e5ef] overflow-hidden shadow-sm">
            <div className="bg-[#cfff5e] px-6 py-4">
              <h2 className="text-[#111111] font-medium">Getting Started</h2>
            </div>
            <div className="p-6">
              <p className="text-[#6b7280] mb-6">
                No content found at the root path. The Clean starter kit content is available - try accessing a specific page.
              </p>
              <div className="space-y-3">
                <p className="text-sm font-medium text-[#111111]">Quick Links:</p>
                <div className="flex flex-wrap gap-2">
                  <a href="/home" className="px-4 py-2 bg-[#f5f5ff] text-[#2027b7] rounded-lg text-sm hover:bg-[#2027b7] hover:text-white transition-colors">
                    /home
                  </a>
                  <a href="/contact" className="px-4 py-2 bg-[#f5f5ff] text-[#2027b7] rounded-lg text-sm hover:bg-[#2027b7] hover:text-white transition-colors">
                    /contact
                  </a>
                  <a href="/articles" className="px-4 py-2 bg-[#f5f5ff] text-[#2027b7] rounded-lg text-sm hover:bg-[#2027b7] hover:text-white transition-colors">
                    /articles
                  </a>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-[#e5e5ef]">
                <p className="text-sm font-medium text-[#111111] mb-3">Test Preview Mode:</p>
                <ol className="text-sm text-[#6b7280] space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-[#2027b7] text-white rounded-full text-xs flex items-center justify-center">1</span>
                    <span>Open Umbraco backoffice at <code className="text-[#2027b7]">https://localhost:5001/umbraco</code></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-[#2027b7] text-white rounded-full text-xs flex items-center justify-center">2</span>
                    <span>Edit any content page</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-[#2027b7] text-white rounded-full text-xs flex items-center justify-center">3</span>
                    <span>Click <strong>"Preview on Frontend"</strong> from the preview dropdown</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#e5e5ef] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between flex-wrap gap-4">
          <p className="text-sm text-[#6b7280]">
            Built by{' '}
            <a href="https://double-shore.com" className="text-[#2027b7] hover:underline font-medium">
              Double Shore
            </a>
          </p>
          <div className="flex items-center gap-4 text-sm">
            <a href="https://github.com/marcoteodoro/Umbraco.DoubleShore.HeadlessPreview" target="_blank" className="text-[#6b7280] hover:text-[#2027b7]">
              GitHub
            </a>
            <a href="https://www.nuget.org/packages/Umbraco.DoubleShore.HeadlessPreview" target="_blank" className="text-[#6b7280] hover:text-[#2027b7]">
              NuGet
            </a>
            <a href="mailto:info@double.pt" className="text-[#6b7280] hover:text-[#2027b7]">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

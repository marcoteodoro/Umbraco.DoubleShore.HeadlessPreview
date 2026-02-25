import { draftMode } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { ContentRows } from '@/components/ContentRenderer';

const UMBRACO_URL = process.env.UMBRACO_URL || 'http://localhost:5000';
const UMBRACO_API_KEY = process.env.UMBRACO_API_KEY || '';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UmbracoContent = any;

async function getContent(path: string, preview: boolean): Promise<UmbracoContent | null> {
  try {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (preview && UMBRACO_API_KEY) {
      headers['Api-Key'] = UMBRACO_API_KEY;
      headers['Preview'] = 'true';
    }
    const res = await fetch(`${UMBRACO_URL}/umbraco/delivery/api/v2/content/item${path}`, {
      headers,
      cache: preview ? 'no-store' : 'force-cache',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function getArticles(preview: boolean): Promise<UmbracoContent[]> {
  try {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (preview && UMBRACO_API_KEY) {
      headers['Api-Key'] = UMBRACO_API_KEY;
      headers['Preview'] = 'true';
    }
    const res = await fetch(
      `${UMBRACO_URL}/umbraco/delivery/api/v2/content?filter=contentType:article&take=10&sort=updateDate:desc`,
      { headers, cache: preview ? 'no-store' : 'force-cache' }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  } catch {
    return [];
  }
}

function HeroSection({ content }: { content: UmbracoContent }) {
  const mainImage = content?.properties?.mainImage?.[0];
  const imageUrl = mainImage?.url?.startsWith('/') ? `${UMBRACO_URL}${mainImage.url}` : mainImage?.url;
  const author = content?.properties?.author;
  const articleDate = content?.properties?.articleDate;
  const categories = content?.properties?.categories || [];

  return (
    <div className="relative bg-[#2027b7] text-white overflow-hidden">
      {imageUrl && (
        <div className="absolute inset-0 opacity-30">
          <Image src={imageUrl} alt={mainImage?.name || ''} fill className="object-cover" unoptimized />
        </div>
      )}
      <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-24">
        <Link href="/" className="text-sm opacity-75 hover:opacity-100 mb-4 inline-block">&larr; Back to Home</Link>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          {content?.properties?.title || content?.name}
        </h1>
        {content?.properties?.subtitle && (
          <p className="text-xl md:text-2xl opacity-90 mb-4">{content.properties.subtitle}</p>
        )}
        {articleDate && (
          <p className="text-sm opacity-75">
            Posted {author?.name ? `by ${author.name} ` : ''}on {new Date(articleDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((cat: UmbracoContent, idx: number) => (
              <span key={idx} className="text-xs bg-white/20 px-3 py-1 rounded-full">{cat.name}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const draft = await draftMode();
  const path = '/' + slug.join('/');
  
  // Fetch content and articles in parallel
  const [content, articles] = await Promise.all([
    getContent(path, draft.isEnabled),
    getArticles(draft.isEnabled)
  ]);

  return (
    <main className="min-h-screen bg-[#f5f5ff] flex flex-col">
      {draft.isEnabled && (
        <div className="bg-[#cfff5e] text-[#111111] px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-3">
          <span className="w-2 h-2 bg-[#2027b7] rounded-full animate-pulse" />
          Preview Mode Active
          <a href="/api/preview/exit" className="ml-2 px-3 py-1 bg-[#111111] text-white rounded text-xs hover:bg-[#333]">Exit Preview</a>
        </div>
      )}

      <header className="bg-white border-b border-[#e5e5ef]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2027b7] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-[#111111]">Headless Preview</span>
          </Link>
          <a href="https://double-shore.com" target="_blank" className="text-sm text-[#2027b7] hover:underline">
            double-shore.com &rarr;
          </a>
        </div>
      </header>

      {content ? (
        <>
          <HeroSection content={content} />
          <div className="max-w-5xl mx-auto px-6 py-12 w-full">
            {content?.properties?.contentRows?.items && (
              <div className="bg-white rounded-2xl border border-[#e5e5ef] p-6 md:p-8 shadow-sm">
                <ContentRows items={content.properties.contentRows.items} articles={articles} />
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="max-w-5xl mx-auto px-6 py-12 flex-1 text-center">
          <h2 className="text-xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-[#6b7280] mb-4">No content at <code className="bg-[#f5f5ff] px-2 py-1 rounded">{path}</code></p>
          <Link href="/" className="text-[#2027b7] hover:underline">Back to Home</Link>
        </div>
      )}

      <footer className="mt-auto border-t border-[#e5e5ef] bg-white py-6 text-center text-sm text-[#6b7280]">
        Built by <a href="https://double-shore.com" className="text-[#2027b7] hover:underline">Double Shore</a>
      </footer>
    </main>
  );
}
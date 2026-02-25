import { draftMode } from 'next/headers';
import Image from 'next/image';
import { ContentRows } from '@/components/ContentRenderer';

const UMBRACO_URL = process.env.UMBRACO_URL || 'http://localhost:5000';
const UMBRACO_API_KEY = process.env.UMBRACO_API_KEY || '';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UmbracoContent = any;

async function getContent(path: string, preview: boolean): Promise<UmbracoContent | null> {
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

async function getArticles(preview: boolean): Promise<UmbracoContent[]> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (preview && UMBRACO_API_KEY) {
      headers['Api-Key'] = UMBRACO_API_KEY;
      headers['Preview'] = 'true';
    }

    const res = await fetch(
      `${UMBRACO_URL}/umbraco/delivery/api/v2/content?filter=contentType:article&take=10&sort=updateDate:desc`,
      {
        headers,
        cache: preview ? 'no-store' : 'force-cache',
      }
    );

    if (!res.ok) {
      console.log(`Articles fetch failed: ${res.status}`);
      return [];
    }

    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

// Hero Section Component
function HeroSection({ content }: { content: UmbracoContent }) {
  const mainImage = content?.properties?.mainImage?.[0];
  const imageUrl = mainImage?.url?.startsWith('/') ? `${UMBRACO_URL}${mainImage.url}` : mainImage?.url;

  return (
    <div className="relative bg-[#2027b7] text-white overflow-hidden">
      {imageUrl && (
        <div className="absolute inset-0 opacity-30">
          <Image
            src={imageUrl}
            alt={mainImage?.name || ''}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
      <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-24">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          {content?.properties?.title || content?.name}
        </h1>
        {content?.properties?.subtitle && (
          <p className="text-xl md:text-2xl opacity-90">
            {content.properties.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

// Social Links Component
function SocialLinks({ items }: { items: UmbracoContent[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item: UmbracoContent, index: number) => {
        const icon = item?.content?.properties?.icon?.[0];
        const link = item?.content?.properties?.link?.[0];
        if (!link) return null;

        const iconUrl = icon?.url?.startsWith('/') ? `${UMBRACO_URL}${icon.url}` : icon?.url;

        return (
          <a
            key={index}
            href={link.url}
            title={link.title}
            target={link.target || '_blank'}
            className="w-10 h-10 bg-[#f5f5ff] hover:bg-[#2027b7] rounded-lg flex items-center justify-center transition-colors group"
          >
            {iconUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={iconUrl}
                alt={icon?.name || ''}
                className="w-5 h-5 group-hover:brightness-0 group-hover:invert"
              />
            ) : (
              <span className="text-[#2027b7] group-hover:text-white text-sm">🔗</span>
            )}
          </a>
        );
      })}
    </div>
  );
}

export default async function Home() {
  const draft = await draftMode();
  
  // Fetch content and articles in parallel
  let content = await getContent('/home', draft.isEnabled);
  if (!content) {
    content = await getContent('/', draft.isEnabled);
  }
  
  const articles = await getArticles(draft.isEnabled);

  return (
    <main className="min-h-screen bg-[#f5f5ff] flex flex-col">
      {/* Preview Banner */}
      {draft.isEnabled && (
        <div className="bg-[#cfff5e] text-[#111111] px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-3">
          <span className="w-2 h-2 bg-[#2027b7] rounded-full animate-pulse" />
          Preview Mode Active
          <a
            href="/api/preview/exit"
            className="ml-2 px-3 py-1 bg-[#111111] text-white rounded text-xs hover:bg-[#333]"
          >
            Exit Preview
          </a>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-[#e5e5ef]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2027b7] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[#111111]">Headless Preview Demo</h1>
              <p className="text-xs text-[#6b7280]">by Double Shore</p>
            </div>
          </div>
          <a href="https://double-shore.com" target="_blank" className="text-sm text-[#2027b7] hover:underline">
            double-shore.com →
          </a>
        </div>
      </header>

      {content ? (
        <>
          {/* Hero */}
          <HeroSection content={content} />

          {/* Main Content */}
          <div className="max-w-5xl mx-auto px-6 py-12 w-full">
            {/* Social Links */}
            {content?.properties?.socialIconLinks?.items && (
              <div className="mb-8">
                <SocialLinks items={content.properties.socialIconLinks.items} />
              </div>
            )}

            {/* Content Rows */}
            {content?.properties?.contentRows?.items && (
              <div className="bg-white rounded-2xl border border-[#e5e5ef] p-6 md:p-8 shadow-sm">
                <ContentRows items={content.properties.contentRows.items} articles={articles} />
              </div>
            )}

            {/* Debug: Raw JSON */}
            <details className="mt-8 group">
              <summary className="cursor-pointer text-xs text-[#6b7280] hover:text-[#2027b7] transition-colors">
                View raw JSON (debug)
              </summary>
              <pre className="mt-3 bg-white p-4 rounded-lg text-xs overflow-auto text-[#333] border border-[#e5e5ef] max-h-96">
                {JSON.stringify(content, null, 2)}
              </pre>
            </details>
          </div>
        </>
      ) : (
        <div className="max-w-5xl mx-auto px-6 py-12 flex-1">
          <div className="bg-white rounded-2xl border border-[#e5e5ef] p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-[#f5f5ff] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#111111] mb-2">No Content Found</h2>
            <p className="text-[#6b7280] mb-6">
              Make sure Umbraco is running at {UMBRACO_URL} and has published content.
            </p>
            <div className="text-sm text-[#6b7280]">
              <p className="mb-2">Try these commands to start Umbraco:</p>
              <code className="bg-[#f5f5ff] px-3 py-1 rounded text-[#2027b7]">
                cd demo/DemoUmbraco && dotnet run
              </code>
            </div>
          </div>
        </div>
      )}

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

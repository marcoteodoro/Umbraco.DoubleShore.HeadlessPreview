// Content Row Types Renderer for Umbraco Clean Starter Kit
import Image from 'next/image';
import Link from 'next/link';

const UMBRACO_URL = process.env.UMBRACO_URL || 'http://localhost:5000';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ContentItem = any;

interface ContentRowsProps {
  items: ContentItem[];
  articles?: ContentItem[];
}

// Rich Text Row
function RichTextRow({ content }: { content: ContentItem }) {
  const markup = content?.properties?.content?.markup || '';
  return (
    <div
      className="prose prose-lg max-w-none prose-headings:text-[#111111] prose-p:text-[#333] prose-a:text-[#2027b7]"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

// Image Row
function ImageRow({ content }: { content: ContentItem }) {
  const image = content?.properties?.image?.[0];
  const caption = content?.properties?.caption;

  if (!image) return null;

  const imageUrl = image.url?.startsWith('/') ? `${UMBRACO_URL}${image.url}` : image.url;

  return (
    <figure className="my-6">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-[#f5f5ff]">
        <Image
          src={imageUrl}
          alt={image.name || caption || 'Image'}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-[#6b7280] mt-2 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// Image Carousel Row
function ImageCarouselRow({ content }: { content: ContentItem }) {
  const images = content?.properties?.images || [];

  if (!images || images.length === 0) return null;

  return (
    <div className="my-6">
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#2027b7] scrollbar-track-[#f5f5ff]">
        {images.map((image: ContentItem, index: number) => {
          const imageUrl = image.url?.startsWith('/') ? `${UMBRACO_URL}${image.url}` : image.url;
          return (
            <div
              key={image.id || index}
              className="flex-shrink-0 w-80 aspect-video relative rounded-lg overflow-hidden bg-[#f5f5ff] snap-start"
            >
              <Image
                src={imageUrl}
                alt={image.name || `Carousel image ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          );
        })}
      </div>
      <p className="text-center text-xs text-[#6b7280] mt-2">
        {images.length} images - scroll to view more
      </p>
    </div>
  );
}

// Video Row (YouTube embed)
function VideoRow({ content }: { content: ContentItem }) {
  const videoUrl = content?.properties?.videoUrl || content?.properties?.video;
  const caption = content?.properties?.caption;

  if (!videoUrl) return null;

  const match = videoUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  const videoId = match?.[1];

  if (!videoId) {
    return <p className="text-[#6b7280] italic">Video URL not supported: {videoUrl}</p>;
  }

  return (
    <figure className="my-6">
      <div className="aspect-video rounded-lg overflow-hidden bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={caption || 'YouTube video'}
        />
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-[#6b7280] mt-2 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// Code Snippet Row
function CodeSnippetRow({ content }: { content: ContentItem }) {
  const code = content?.properties?.code || '';
  const title = content?.properties?.title;
  const language = content?.properties?.language || 'code';

  return (
    <div className="my-6">
      <div className="bg-[#1e1e1e] rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-[#333] text-xs text-[#999]">
          <span>{title || language}</span>
        </div>
        <pre className="p-4 overflow-x-auto text-sm text-[#d4d4d4]">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

// Article Post Preview - matches Clean Starter Kit's latestArticlesRow.cshtml
function ArticlePostPreview({ article }: { article: ContentItem }) {
  const title = article?.properties?.title || article?.name;
  const subtitle = article?.properties?.subtitle;
  const articleDate = article?.properties?.articleDate;
  const categories = article?.properties?.categories || [];
  const author = article?.properties?.author;
  const authorName = author?.properties?.name || author?.name || 'Unknown Author';

  // Format date as "MMMM dd, yyyy" to match original template
  const formattedDate = articleDate
    ? new Date(articleDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
      })
    : '';

  return (
    <div className="post-preview mb-6">
      <Link href={article?.route?.path || '#'} className="hover:no-underline group">
        <h2 className="text-2xl font-bold text-[#111111] group-hover:text-[#2027b7] transition-colors mb-1">
          {title}
        </h2>
        {subtitle && (
          <h3 className="text-lg text-[#6b7280] font-normal mt-1">{subtitle}</h3>
        )}
      </Link>
      <p className="text-sm text-[#6b7280] mt-2">
        Posted by <span className="font-medium">{authorName}</span> on {formattedDate}
      </p>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {categories.map((cat: ContentItem, idx: number) => (
            <span
              key={idx}
              className="text-xs bg-[#f8f9fa] text-[#212529] px-3 py-1 rounded-full border border-[#dee2e6]"
            >
              {cat.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Latest Articles Row - matches Clean Starter Kit's post-preview layout
function LatestArticlesRow({ content, articles }: { content: ContentItem; articles?: ContentItem[] }) {
  const articleList = content?.properties?.articleList;
  const pageSize = content?.properties?.pageSize || 3;

  // Use provided articles or empty array
  const displayArticles = articles?.slice(0, pageSize) || [];

  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-[#111111]">Latest Articles</h3>
        <Link
          href={articleList?.route?.path || '/blog'}
          className="text-sm text-[#2027b7] hover:underline"
        >
          View all articles &rarr;
        </Link>
      </div>
      {displayArticles.length > 0 ? (
        <div>
          {displayArticles.map((article: ContentItem, index: number) => (
            <div key={article.id || index}>
              <ArticlePostPreview article={article} />
              {index < displayArticles.length - 1 && (
                <hr className="border-t border-[#dee2e6] mb-6" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#6b7280]">No articles found</p>
      )}
    </div>
  );
}

// Content Row Dispatcher
function ContentRow({ item, articles }: { item: ContentItem; articles?: ContentItem[] }) {
  const contentType = item?.content?.contentType;
  const settings = item?.settings?.properties;

  if (settings?.hide) return null;

  switch (contentType) {
    case 'richTextRow':
      return <RichTextRow content={item.content} />;
    case 'imageRow':
      return <ImageRow content={item.content} />;
    case 'imageCarouselRow':
      return <ImageCarouselRow content={item.content} />;
    case 'videoRow':
      return <VideoRow content={item.content} />;
    case 'codeSnippetRow':
      return <CodeSnippetRow content={item.content} />;
    case 'latestArticlesRow':
      return <LatestArticlesRow content={item.content} articles={articles} />;
    default:
      return (
        <div className="my-4 p-3 bg-[#fff7ed] border border-[#fed7aa] rounded-lg text-sm text-[#c2410c]">
          Unknown content type: <code className="bg-[#fed7aa] px-1 rounded">{contentType}</code>
        </div>
      );
  }
}

// Main Content Rows Renderer
export function ContentRows({ items, articles }: ContentRowsProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-6">
      {items.map((item: ContentItem, index: number) => (
        <ContentRow key={item?.content?.id || index} item={item} articles={articles} />
      ))}
    </div>
  );
}

export default ContentRows;

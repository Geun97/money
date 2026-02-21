import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdSenseUnit from "@/components/AdSenseUnit";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: { slug: string };
};

// slug 디코딩 (한글/특수문자 대응)
function getSlugParam(params: { slug: string }): string {
  try {
    return decodeURIComponent(params.slug);
  } catch {
    return params.slug;
  }
}

// slug 또는 id로 포스트 한 건 조회 (우선 slug, 없으면 id)
async function getPostBySlugOrId(slugOrId: string) {
  const { data: bySlug } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slugOrId)
    .maybeSingle();

  if (bySlug) return bySlug;

  const { data: byId } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", slugOrId)
    .maybeSingle();

  return byId;
}

// 사이트 기준 URL (캐노니컬·OG용, Vercel은 VERCEL_URL 자동 주입)
function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://money-ivon.vercel.app";
}

// 동적 SEO·AEO 메타데이터 (상위 노출용: seo_title, seo_description, seo_keywords 활용)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slugOrId = getSlugParam(params);
  const post = await getPostBySlugOrId(slugOrId);

  if (!post) return { title: "Not Found | 대한민국 정책24" };

  const seoTitle = (post as { seo_title?: string }).seo_title || post.title;
  const seoDesc =
    (post as { seo_description?: string }).seo_description ||
    (post as { summary?: string }).summary ||
    "";
  const seoKeywords = (post as { seo_keywords?: string }).seo_keywords;
  const thumb =
    (post as { thumbnail_url?: string; thumbnail?: string; image_url?: string; cover_image?: string })
      .thumbnail_url ||
    (post as { thumbnail?: string }).thumbnail ||
    (post as { image_url?: string }).image_url ||
    (post as { cover_image?: string }).cover_image;

  const canonicalSlug =
    (post as { slug?: string }).slug && String((post as { slug?: string }).slug).trim()
      ? encodeURIComponent(String((post as { slug?: string }).slug).trim())
      : post.id;
  const canonicalUrl = `${getBaseUrl()}/posts/${canonicalSlug}`;

  return {
    title: `${seoTitle} | 대한민국 정책24`,
    description: seoDesc,
    keywords: seoKeywords ? (Array.isArray(seoKeywords) ? seoKeywords : [seoKeywords]) : undefined,
    authors: [{ name: "대한민국 정책24" }],
    openGraph: {
      type: "article",
      locale: "ko_KR",
      siteName: "대한민국 정책24",
      url: canonicalUrl,
      title: seoTitle,
      description: seoDesc,
      images: thumb ? [{ url: thumb, alt: post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDesc,
      images: thumb ? [thumb] : undefined,
    },
    alternates: { canonical: canonicalUrl },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export default async function PostPage({ params }: Props) {
  const slugOrId = getSlugParam(params);
  const post = await getPostBySlugOrId(slugOrId);

  if (!post) {
    notFound();
  }

  const date = new Date(post.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // 본문: text, content, body, body_markdown 등 Supabase 컬럼명 유연 대응
  const content =
    (post as { text?: string }).text ||
    (post as { content?: string }).content ||
    (post as { body?: string }).body ||
    (post as { body_markdown?: string }).body_markdown ||
    "";

  // 썸네일: thumbnail_url, thumbnail, image_url, cover_image 등
  const thumbnailUrl =
    (post as { thumbnail_url?: string }).thumbnail_url ||
    (post as { thumbnail?: string }).thumbnail ||
    (post as { image_url?: string }).image_url ||
    (post as { cover_image?: string }).cover_image;

  const tags = (post as { tags?: string[] }).tags;
  const displayTitle = (post as { seo_title?: string }).seo_title || post.title;
  const canonicalSlug =
    (post as { slug?: string }).slug && String((post as { slug?: string }).slug).trim()
      ? encodeURIComponent(String((post as { slug?: string }).slug).trim())
      : post.id;
  const canonicalUrl = `${getBaseUrl()}/posts/${canonicalSlug}`;

  // JSON-LD Article: 봇 크롤링·AEO·상위 노출용 구조화 데이터
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: displayTitle,
    description: (post as { seo_description?: string }).seo_description || (post as { summary?: string }).summary || "",
    image: thumbnailUrl ? [thumbnailUrl] : undefined,
    datePublished: post.created_at,
    dateModified: (post as { updated_at?: string }).updated_at || post.created_at,
    author: { "@type": "Organization", name: "대한민국 정책24" },
    publisher: { "@type": "Organization", name: "대한민국 정책24" },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };

  return (
    <article className="max-w-3xl mx-auto py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/"
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        목록으로 돌아가기
      </Link>

      <header className="mb-12 border-b border-gray-200 pb-8">
        <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wider mb-4">
          <span className="text-black">{(post as { category?: string }).category || "미분류"}</span>
          <span className="text-gray-400">{date}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight break-keep">
          {displayTitle}
        </h1>
        {Array.isArray(tags) && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* 썸네일: 있을 때만 영역 표시, 없으면 공간 없음 */}
      {thumbnailUrl && (
        <div className="w-full aspect-video mb-12 rounded-lg overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 글 상단 애드센스 (슬롯 ID는 환경 변수 또는 아래 slot 값 교체) */}
      <AdSenseUnit slot={process.env.NEXT_PUBLIC_ADSENSE_POST_SLOT} />

      {/* 본문: Markdown 렌더링 (링크 활성화, URL 자동 링크) */}
      <div className="prose prose-lg prose-neutral max-w-none break-keep prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:break-all">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href, children, ...props }) => {
              const isExternal = href?.startsWith("http");
              return (
                <a
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  {...props}
                >
                  {children}
                </a>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* 글 하단 애드센스 */}
      <AdSenseUnit slot={process.env.NEXT_PUBLIC_ADSENSE_POST_SLOT} />
    </article>
  );
}
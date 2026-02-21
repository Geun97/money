import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const revalidate = 60; // 60초마다 재생성 (ISR)

type Props = {
  params: { slug: string };
};

// 동적 SEO 메타데이터 생성 (Make.com 프롬프트에서 만든 seo_* 필드 활용)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: post } = await supabase
    .from('blog_posts')
    .select('seo_title, seo_description, seo_keywords, thumbnail_url, title, summary')
    .eq('slug', params.slug)
    .single();

  if (!post) {
    // slug로 못 찾으면 ID로 한 번 더 시도 (fallback)
    const { data: fallbackPost } = await supabase
      .from('blog_posts')
      .select('seo_title, seo_description, seo_keywords, thumbnail_url, title, summary')
      .eq('id', params.slug)
      .single();
    
    if (!fallbackPost) return { title: 'Not Found | 대한민국 정책24' };
    
    return {
      title: fallbackPost.seo_title || fallbackPost.title,
      description: fallbackPost.seo_description || fallbackPost.summary,
      keywords: fallbackPost.seo_keywords,
      openGraph: {
        title: fallbackPost.seo_title || fallbackPost.title,
        description: fallbackPost.seo_description || fallbackPost.summary,
        images: fallbackPost.thumbnail_url ? [fallbackPost.thumbnail_url] : [],
      },
    };
  }

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.summary,
    keywords: post.seo_keywords,
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.summary,
      images: post.thumbnail_url ? [post.thumbnail_url] : [],
    },
  };
}

export default async function PostPage({ params }: Props) {
  // slug 또는 id로 블로그 글 불러오기
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .or(`slug.eq.${params.slug},id.eq.${params.slug}`)
    .single();

  if (error || !post) {
    notFound();
  }

  const date = new Date(post.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  return (
    <article className="max-w-3xl mx-auto py-12">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        목록으로 돌아가기
      </Link>
      
      <header className="mb-12 border-b border-gray-200 pb-8">
        <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wider mb-4">
          <span className="text-black">{post.category || "미분류"}</span>
          <span className="text-gray-400">{date}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight break-keep">
          {post.title}
        </h1>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {post.thumbnail_url && (
        <div className="w-full aspect-video mb-12 rounded-lg overflow-hidden bg-gray-100">
          <img src={post.thumbnail_url} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Tailwind Typography 플러그인(prose)을 사용하여 Markdown 콘텐츠를 예쁘게 렌더링합니다 */}
      <div className="prose prose-lg prose-neutral max-w-none break-keep">
        <ReactMarkdown>{post.content || ""}</ReactMarkdown>
      </div>
    </article>
  );
}
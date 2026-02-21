import { supabase } from "@/lib/supabase";
import AnimatedHome from "@/components/AnimatedHome";

// Next.js ISR (Incremental Static Regeneration) 설정 
// 60초마다 새 글이 있는지 확인해서 백그라운드에서 페이지를 갱신합니다 (SEO 최적화)
export const revalidate = 60;

export default async function Home() {
  // Supabase에서 블로그 포스트 가져오기 (is_published가 true이거나 null인 글 포함)
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .or('is_published.eq.true,is_published.is.null')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts from Supabase:', error);
  }

  // 로컬/빌드 시 환경 변수 누락 시 로그 (Vercel 대시보드 로그에서 확인 가능)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('[정책24] NEXT_PUBLIC_SUPABASE_URL 또는 NEXT_PUBLIC_SUPABASE_ANON_KEY가 설정되지 않았습니다. Vercel 프로젝트 설정 → Environment Variables에서 추가해 주세요.');
  }

  // 가져온 데이터를 클라이언트 애니메이션 컴포넌트로 전달합니다
  return <AnimatedHome posts={posts || []} />;
}
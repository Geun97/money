import { supabase } from "@/lib/supabase";
import AnimatedHome from "@/components/AnimatedHome";

// 배포 직후 빌드 캐시 때문에 글이 안 보이는 것 방지: 매 요청마다 Supabase에서 조회
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  // Supabase에서 블로그 포스트 전체 조회 (원인 파악 후 필요 시 is_published 조건 복구)
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
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
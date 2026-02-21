import { supabase } from "@/lib/supabase";
import AnimatedHome from "@/components/AnimatedHome";

// Next.js ISR (Incremental Static Regeneration) 설정 
// 60초마다 새 글이 있는지 확인해서 백그라운드에서 페이지를 갱신합니다 (SEO 최적화)
export const revalidate = 60;

export default async function Home() {
  // Supabase에서 is_published가 true인 블로그 포스트들만 최신순으로 가져옵니다
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts from Supabase:', error);
  }

  // 가져온 데이터를 클라이언트 애니메이션 컴포넌트로 전달합니다
  return <AnimatedHome posts={posts || []} />;
}
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const envOk = !!(url && key);

  if (!envOk) {
    return NextResponse.json({
      ok: false,
      envSet: false,
      message: "NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY missing",
    });
  }

  const supabase = createClient(url, key);

  // 1) 필터 없이 전체 조회 (테이블/RLS/데이터 확인)
  const { data: allPosts, error: errAll } = await supabase
    .from("blog_posts")
    .select("id, title, slug, is_published, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  // 2) 현재 메인 페이지와 동일한 조건으로 조회
  const { data: filteredPosts, error: errFiltered } = await supabase
    .from("blog_posts")
    .select("id, title, slug, is_published, created_at")
    .or("is_published.eq.true,is_published.is.null")
    .order("created_at", { ascending: false })
    .limit(10);

  return NextResponse.json({
    ok: true,
    envSet: true,
    all: {
      count: allPosts?.length ?? 0,
      error: errAll?.message ?? null,
      code: errAll?.code ?? null,
      details: errAll?.details ?? null,
      sample: allPosts?.slice(0, 2) ?? [],
    },
    filtered: {
      count: filteredPosts?.length ?? 0,
      error: errFiltered?.message ?? null,
      code: errFiltered?.code ?? null,
      sample: filteredPosts?.slice(0, 2) ?? [],
    },
  });
}

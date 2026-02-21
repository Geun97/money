"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  created_at: string;
  thumbnail_url: string | null;
};

export default function AnimatedHome({ posts }: { posts: Post[] }) {
  return (
    <div className="flex flex-col gap-16">
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-12 md:py-24 border-b border-gray-200"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          가장 빠르고 정확한<br/>
          <span className="text-gray-500">정부지원금 소식.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
          대한민국 소상공인과 예비 창업자를 위한 정책자금, 지원사업 핵심 정보를 한눈에 파악하세요.
        </p>
      </motion.section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">최신 아티클</h2>
          <button className="text-sm font-medium hover:underline">모두 보기 →</button>
        </div>
        
        {posts.length === 0 ? (
          <div className="py-20 text-center text-gray-500 border border-dashed border-gray-200 rounded-lg">
            <p>아직 작성된 글이 없습니다.</p>
            <p className="text-sm mt-2">Supabase에서 블로그 글을 추가해 보세요!</p>
          </div>
        ) : (
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, idx) => {
              const date = new Date(post.created_at).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              });
              return (
                <motion.article 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group flex flex-col"
                >
                  <Link href={`/posts/${post.slug || post.id}`} className="block h-full">
                    <div className="aspect-[4/3] bg-gray-100 mb-4 rounded-sm overflow-hidden relative">
                      {post.thumbnail_url ? (
                        <img src={post.thumbnail_url} alt={post.title} className="object-cover w-full h-full" />
                      ) : (
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300 flex items-center justify-center text-gray-400 text-sm">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider mb-2">
                      <span className="text-black">{post.category || "미분류"}</span>
                      <span className="text-gray-400">{date}</span>
                    </div>
                    <h3 className="text-xl font-bold leading-snug mb-2 group-hover:underline underline-offset-4">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {post.summary}
                    </p>
                  </Link>
                </motion.article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
import Link from 'next/link';
import { Search } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tighter">
          대한민국 정책24
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/news" className="hover:underline underline-offset-4">최신 소식</Link>
          <Link href="/funds" className="hover:underline underline-offset-4">정책자금</Link>
          <Link href="/guide" className="hover:underline underline-offset-4">지원 가이드</Link>
        </nav>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Search className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
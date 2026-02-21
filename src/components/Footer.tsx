export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-12 text-center text-sm text-gray-500">
      <p>© {new Date().getFullYear()} 대한민국 정책24. All rights reserved.</p>
      <p className="mt-2">대한민국 소상공인을 위한 올바른 정책자금 정보</p>
    </footer>
  );
}
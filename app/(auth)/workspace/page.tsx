'use client';

import { HomeView } from '@/components/workspace/views/HomeView';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  return <HomeView setActiveView={(v: string) => router.push(v === 'home' ? '/workspace' : `/workspace/${v}`)} userRole="owner" />;
}
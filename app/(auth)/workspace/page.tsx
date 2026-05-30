'use client';

import { HomeView } from '@/components/workspace/views/HomeView';
import { NEXT_API_ROUTES } from '@/constants/routeHandler';
import { useApi } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {

  const {execute} = useApi({
    url:NEXT_API_ROUTES.WORKSPACE_CONTEXT_API,
    method:"GET"
   })

  useEffect(() => {
    (
      async () => {
        const res = await execute()
        console.log('Workspace context data:', res.data);
      }
    )()
  },[])

  return <HomeView/>;
}
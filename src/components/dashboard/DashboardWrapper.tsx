'use client';

import dynamic from 'next/dynamic';

const Dashboard = dynamic(() => import('@/components/dashboard/Dashboard'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl">Loading dashboard...</p>
    </div>
  ),
});

export default function DashboardWrapper() {
  return <Dashboard />;
}

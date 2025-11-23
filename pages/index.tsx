import { useState } from 'react';
import Head from 'next/head';
import HomePage from '@/components/HomePage';
import EnhancedTourismQuery from '@/components/EnhancedTourismQuery';

export default function Home() {
  const [showQuery, setShowQuery] = useState(false);

  return (
    <>
      <Head>
        <title>Multi-Agent Tourism System</title>
        <meta name="description" content="Plan your trip with weather, attractions, events, and more" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {!showQuery ? (
              <HomePage onStartPlanning={() => setShowQuery(true)} />
            ) : (
              <EnhancedTourismQuery onBack={() => setShowQuery(false)} />
            )}
          </div>
        </div>
      </main>
    </>
  );
}


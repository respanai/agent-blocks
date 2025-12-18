import React, { useEffect, useState } from 'react';
import { WrapUp } from './components/WrapUp';
import { LoadingScreen } from './components/LoadingScreen';
import { ErrorScreen } from './components/ErrorScreen';
export function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };
  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen onRetry={handleRetry} />;
  return <WrapUp />;
}
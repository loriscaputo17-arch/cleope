import React, { Suspense } from 'react';
import TicketsClient from './ticketsClient';

export default function TicketsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TicketsClient />
    </Suspense>
  );
}

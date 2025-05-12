'use client';
import { useState } from 'react';
import { Flex, Heading, Select } from '@/once-ui/components';
import EventSection from '@/components/EventSection';
import styles from './dashboard.module.scss';

export default function Dashboard() {
    const events = ['Downtown April 12th', 'Volt 17.04', 'Cleope Fashion Party 19.04', 'Aesthetica 26.04', 'Downtown 26.04', 'Volt 01.05', 'Downtown 03.05', 'Volt 08.05', 'Downtown 10.05', 'Volt 15.05', 'Downtown 17.05'];
    const [selectedEvent, setSelectedEvent] = useState(events[0]);

    return (
        <div style={{ width: '80vw'}}>
            <Heading variant="display-strong-l" marginBottom="l">Event Dashboard</Heading>

            <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                style={{
                    marginBottom: '2rem',
                    width: '300px',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    fontSize: '1rem',
                    backgroundColor: '#fff',
                    color: '#333',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'%23666\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1rem',
                }}
            >
                {events.map(event => (
                    <option key={event} value={event}>{event}</option>
                ))}
            </select>

            <EventSection event={selectedEvent} />
        </div>
    );
}


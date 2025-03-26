'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Flex, Heading, Text, Button } from '@/once-ui/components';
import Link from 'next/link';

const events = [
    {
        title: 'Fashion Night',
        city: 'Milano',
        date: '10 Marzo 2025',
        linkInstagram: 'https://www.instagram.com/p/EXAMPLE1/',
        slug: 'fashion-night-milano',
        description: 'Un evento esclusivo con le migliori sfilate di moda della stagione.'
    },
    {
        title: 'Luxury Showcase',
        city: 'Roma',
        date: '25 Febbraio 2025',
        linkInstagram: 'https://www.instagram.com/p/EXAMPLE2/',
        slug: 'luxury-showcase-roma',
        description: 'Scopri le ultime collezioni dei brand di lusso più iconici.'
    },
    {
        title: 'Exclusive Runway',
        city: 'Firenze',
        date: '18 Aprile 2025',
        linkInstagram: 'https://www.instagram.com/p/EXAMPLE4/',
        slug: 'exclusive-runway-firenze',
        description: 'Un evento speciale con ospiti VIP e presentazioni esclusive.'
    },
];

interface EventType {
    title: string;
    city: string;
    date: string;
    linkInstagram: string;
    slug: string;
    description: string;
}

export default function EventPage() {
    const params = useParams();
    const slug = params?.slug as string; 

    const [event, setEvent] = useState<EventType | null>(null);

    useEffect(() => {

        const foundEvent = events.find(e => e.slug === slug);
        setEvent(foundEvent || null);
    }, [slug]);

    if (!event) {
        return (
            <Flex direction="column" alignItems="center" justifyContent="center" style={{ height: '80vh' }}>
                <Heading as="h2" variant="display-strong-xs">Evento non trovato</Heading>
                <Link href="/">
                    <Button size="m" variant="primary" style={{ marginTop: '1rem' }}>
                        Torna alla Home
                    </Button>
                </Link>
            </Flex>
        );
    }

    return (
        <Flex direction="column" alignItems="center" fillWidth paddingY="xl">
            <Heading as="h1" variant="display-strong-m">{event.title}</Heading>
            <Text variant="body-default-l">{event.city} - {event.date}</Text>
            <Text variant="body-default-m" marginTop="m">{event.description}</Text>

            <Flex gap="16" marginTop="l">
                <a href={event.linkInstagram} target="_blank" rel="noopener noreferrer">
                    <Button size="m" variant="secondary">Instagram</Button>
                </a>
                <Link href="/">
                    <Button size="m" variant="primary">Torna agli Eventi</Button>
                </Link>
            </Flex>
        </Flex>
    );
}

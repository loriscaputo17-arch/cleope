'use client';

import { Flex, Heading, Text, Button } from '@/once-ui/components';
import Link from 'next/link';

const events = [
    {
        title: 'CLEOPE X Volt Club Milano',
        city: 'Milan',
        date: '27th March 2025',
        linkInstagram: 'https://wa.me/+393513895086',
        slug: 'night-party-milan',
    },
    {
        title: 'INSOMNIA X CLEOPE The Flat by Macan',
        city: 'Milan',
        date: '29th March 2025',
        linkInstagram: 'https://www.eventbrite.it/e/insomnia-x-cleope-the-flat-by-macan-tickets-1295655894659?aff=Cleope',
        slug: 'night-party-milan',
    },
    {
        title: 'CLEOPE X Volt Club Milano',
        city: 'Milan',
        date: '3rd April 2025',
        linkInstagram: 'https://wa.me/+393513895086',
        slug: 'night-party-milan',
    },
    {
        title: 'Fashion Party: BLUE GROOVE X CLEOPE - ARCA Milano',
        city: 'Milan',
        date: '4th April 2025',
        linkInstagram: 'https://dice.fm/event/92yk7n-cleope-x-blue-groove-4th-apr-arca-milano-tickets?lng=it',
        slug: 'night-party-milan',
    },
];

export default function EventList() {
    return (
        <Flex direction="column" alignItems="center" fillWidth paddingY="xl">
            <Heading as="h2" variant="display-strong-xs">Next events</Heading>

            <Flex direction="column" gap="l" marginTop="l" fillWidth>
                {events.map((event, index) => (

<a href={event.linkInstagram} target="_blank" rel="noopener noreferrer">
                    <div 
                        key={index} 
                        style={{
                            padding: '16px',
                            borderRadius: '20px',
                            background: 'rgba(3, 3, 3, 0.7098039216)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(10px)',
                            textAlign: 'center',
                            transition: '0.3s',
                        }}
                    >
                        <h2 style={{
                            fontSize: '20px',
                            fontWeight: '700'
                        }}>{event.title}</h2>
                        <Text variant="body-default-m">{event.city} - {event.date}</Text>

                        <Flex gap="m" marginTop="s" justifyContent="center">
                                <Button size="s" variant="secondary">Link</Button>
                        </Flex>
                    </div>
                    </a>
                ))}
            </Flex>
        </Flex>
    );
}

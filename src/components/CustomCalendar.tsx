'use client';

import { Flex, Heading, Text, Button } from '@/once-ui/components';

const events = [
    { id: 1, name: "CLEOPE x VOLT Club Milan", city: "Milan", date: "27th March 2025", type: "volt", special: true, link: "https://wa.me/+393513895086" },
    { id: 2, name: "INSOMNIA X CLEOPE The Flat by Macan", city: "Milan", date: "29th March 2025", type: "standard", ticket: "https://www.eventbrite.it/e/insomnia-x-cleope-the-flat-by-macan-tickets-1295655894659?aff=Cleope" },
    { id: 3, name: "Aesthetica Roma", city: "Roma", date: "3rd April 2025", type: "aesthetica", special: true, link: "https://www.instagram.com/aesthetica.ent/" },
    { id: 4, name: "CLEOPE x VOLT Club Milan", city: "Milan", date: "3rd April 2025", type: "volt", special: true, link: "https://wa.me/+393513895086" },
    { id: 5, name: "CLEOPE X BLUE GROOVE ARCA Milano", city: "Milan", date: "4th April 2025", type: "standard", ticket: "https://dice.fm/event/92yk7n-cleope-x-blue-groove-4th-apr-arca-milano-tickets?lng=it" },
    { id: 6, name: "CLEOPE x VOLT Club Milan", city: "Milan", date: "10th April 2025", type: "volt", special: true, link: "https://wa.me/+393513895086" },
    { id: 7, name: "CLEOPE x VOLT Club Milan", city: "Milan", date: "17th April 2025", type: "volt", special: true, link: "https://wa.me/+393513895086" },
];

// Funzione per convertire la data da "27th March 2025" a un oggetto Date valido
const parseDate = (dateString: string): Date | null => {
    const dateParts = dateString.match(/(\d+)(?:st|nd|rd|th)? (\w+) (\d{4})/);
    if (!dateParts) return null;

    const day = parseInt(dateParts[1], 10);
    const month = new Date(`${dateParts[2]} 1, 2000`).getMonth(); // Ottieni il numero del mese
    const year = parseInt(dateParts[3], 10);

    return new Date(year, month, day);
};

// Funzione per ottenere gli eventi futuri
const getFilteredEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Rimuove le ore per un confronto più preciso

    return events.filter(event => {
        const eventDate = parseDate(event.date);
        return eventDate && eventDate >= today;
    });
};

export default function EventList() {
    const filteredEvents = getFilteredEvents();

    return (
        <Flex direction="column" alignItems="center" fillWidth paddingY="xl">
            <Heading as="h2" variant="display-strong-xs">Next Events</Heading>

            <Flex direction="column" gap="l" marginTop="l" fillWidth>
                {filteredEvents.map((event) => (
                    <div 
                        key={event.id}
                        style={{
                            padding: '16px',
                            borderRadius: '20px',
                            background: 'rgba(3, 3, 3, 0.71)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(10px)',
                            textAlign: 'center',
                            transition: '0.3s',
                        }}
                    >
                        <h2 style={{
                            fontSize: '20px',
                            fontWeight: '700'
                        }}>{event.name}</h2>
                        <Text variant="body-default-m">{event.city} - {event.date}</Text>

                        <Flex gap="m" marginTop="s" justifyContent="center">
                            {event.ticket ? (
                                <a href={event.ticket} target="_blank" rel="noopener noreferrer">
                                    <Button size="s" variant="secondary">Buy Ticket</Button>
                                </a>
                            ) : (
                                <a href={event.link} target="_blank" rel="noopener noreferrer">
                                    <Button size="s" variant="secondary">Instagram</Button>
                                </a>
                            )}
                        </Flex>
                    </div>
                ))}
            </Flex>
        </Flex>
    );
}

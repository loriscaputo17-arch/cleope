'use client';

import { Flex, Heading, Text, Button } from '@/once-ui/components';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { FreeMode, Pagination, Navigation } from 'swiper/modules';
import Link from 'next/link';

const events = [
    {
        title: 'CLEOPE X Volt Club Milano',
        city: 'Milan',
        date: '20th March 2025',
        linkInstagram: 'https://www.instagram.com/cleopeofficial/',
        slug: 'night-party-milan',
    },
    {
        title: 'AESTHETICA powered by CLEOPE',
        city: 'Roma',
        date: '20th March 2025',
        linkInstagram: 'https://www.instagram.com/aesthetica.ent/',
        slug: 'night-party-milan',
    },
    {
        title: 'CLEOPE X Volt Club Milano',
        city: 'Milan',
        date: '13th March 2025',
        linkInstagram: 'https://www.instagram.com/p/DHBE6-XNjfW/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
        slug: 'night-party-milan',
    },
    {
        title: 'CLEOPE X Volt Club Milano',
        city: 'Milan',
        date: '6th March 2025',
        linkInstagram: 'https://www.instagram.com/cleopeofficial/',
        slug: 'night-party-milan',
    },
    {
        title: 'INSOMNIA X CLEOPE The Flat by Macan',
        city: 'Milan',
        date: '28th February 2025',
        linkInstagram: 'https://www.instagram.com/reel/DGRM6j7tmS8/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
        slug: 'night-party-milan',
    },
    {
        title: 'CLEOPE X Volt Club Milano',
        city: 'Milan',
        date: '27th February 2025',
        linkInstagram: 'https://www.instagram.com/cleopeofficial/',
        slug: 'night-party-milan',
    },
    {
        title: 'MAUNAKEA | ANAKIN | KOSMI sound by CLEOPE',
        city: 'Rinascente Milan',
        date: '22th February 2025',
        linkInstagram: 'https://www.instagram.com/reel/DGWU2Z_NWw2/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
        slug: 'night-party-milan',
    },
];

export default function EventsCarousel() {
    return (
        <Flex direction="column" alignItems="center" fillWidth>
            <Heading as="h2" variant="display-strong-xs" wrap="balance">
                Ultimi Eventi
            </Heading>

            <Swiper
                slidesPerView={1.2}
                spaceBetween={16}
                freeMode={true}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                navigation={true}
                breakpoints={{
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                modules={[FreeMode, Pagination, Navigation]}
                style={{ width: '100%', marginTop: '1rem' }}
            >
                {events.map((event, index) => (
                    <SwiperSlide key={index}>
                        <Flex
                            direction="column"
                            padding="l"
                            style={{
                                borderRadius: '12px',
                                transition: 'transform 0.3s ease',
                                cursor: 'pointer',
                                padding: '16px',
                                textAlign: 'center'
                            }}
                        >
                            <h2 style={{
                            fontSize: '20px',
                            fontWeight: '700'
                        }}>{event.title}</h2>
                            <Text variant="body-default-m">{event.city}</Text>
                            <Text variant="body-default-m" onBackground="neutral-weak">
                                {event.date}
                            </Text>

                            <Flex gap="8" marginTop="m" justifyContent="center">
                                {/* Link a Instagram */}
                                <a
                                    href={event.linkInstagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button size="s" variant="secondary">
                                        Instagram
                                    </Button>
                                </a>

                            </Flex>
                        </Flex>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Flex>
    );
}

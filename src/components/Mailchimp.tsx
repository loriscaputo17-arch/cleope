"use client";

import { mailchimp } from '@/app/resources'
import { Button, Flex, Heading, Input, Text, SmartImage, Background, Arrow } from '@/once-ui/components';
import { useState } from 'react';
import { useTranslations } from 'next-intl';


function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
    let timeout: ReturnType<typeof setTimeout>;
    return ((...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    }) as T;
}

type NewsletterProps = {
    display: boolean;
    title: string | JSX.Element;
    description: string | JSX.Element;
}

export const Mailchimp = (
    { newsletter }: { newsletter: NewsletterProps}
) => {
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [touched, setTouched] = useState<boolean>(false);

    const t = useTranslations();

    const validateEmail = (email: string): boolean => {
        if (email === '') {
            return true;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);

        if (!validateEmail(value)) {
            setError('Please enter a valid email address.');
        } else {
            setError('');
        }
    };

    const debouncedHandleChange = debounce(handleChange, 2000);

    const handleBlur = () => {
        setTouched(true);
        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
        }
    };

    return (
        <Flex
            style={{overflow: 'hidden'}}
            position="relative"
            fillWidth padding="xl"  radius="l" marginBottom="m"
            direction="column" alignItems="center" align="center"
            background="surface" border="neutral-medium" borderStyle="solid-1">
            <Background
                position="absolute"
                mask={mailchimp.effects.mask as any}
                gradient={mailchimp.effects.gradient as any}
                dots={mailchimp.effects.dots as any}
                lines={mailchimp.effects.lines as any}/>
            <Heading style={{position: 'relative'}}
                marginBottom="s"
                variant="display-strong-xs">
                Request to join the CLEOPE List at VOLT Milano
            </Heading>
            <Text
                style={{
                    position: 'relative',
                    maxWidth: 'var(--responsive-width-xs)'
                }}
                wrap="balance"
                marginBottom="l"
                onBackground="neutral-medium">
                Request to join our list for the VOLT event, held every Thursday.
            </Text>

            <Button
                                                id="about"
                                                data-border="rounded"
                                                href={`/volt`}
                                                variant="tertiary"
                                                size="m">
                                                <Flex
                                                    gap="8"
                                                    alignItems="center">
                                                        VOLT access
                                                        <Arrow trigger="#about"/>
                                                </Flex>
                                            </Button>

                                            <img width={'100%'}
                                                                    alt={'Volt Calendar'}
                                                                    src={'/images/febcalendar.png'}
                                                                    style={{
                                                                        border: '1px solid var(--neutral-alpha-weak)',
                                                                        marginTop: '3rem'
                                                                    }}/>
        </Flex>
    )
}
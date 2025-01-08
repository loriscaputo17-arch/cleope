import React from 'react';

import { Heading, Flex,Icon, IconButton, Text, Button,  Avatar, RevealFx, Arrow } from '@/once-ui/components';
import { Projects } from '@/components/work/Projects';

import { baseURL, routes, renderContent } from '@/app/resources'; 
import { Mailchimp } from '@/components';
import { Posts } from '@/components/blog/Posts';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import styles from '@/components/about/about.module.scss'

export async function generateMetadata(
	{params: {locale}}: { params: { locale: string }}
) {
	const t = await getTranslations();
    const { home } = renderContent(t);
	const title = home.title;
	const description = home.description;
	const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'website',
			url: `https://${baseURL}/${locale}`,
			images: [
				{
					url: ogImage,
					alt: title,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [ogImage],
		},
	};
}

export default function Home(
	{ params: {locale}}: { params: { locale: string }}
) {
	unstable_setRequestLocale(locale);
	const t = useTranslations();
	const { home, about, person, newsletter } = renderContent(t);
	return (
		<Flex
			maxWidth="m" fillWidth gap="xl"
			direction="column" alignItems="center">
			<script
				type="application/ld+json"
				suppressHydrationWarning
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'WebPage',
						name: home.title,
						description: home.description,
						url: `https://${baseURL}`,
						image: `${baseURL}/og?title=${encodeURIComponent(home.title)}`,
						publisher: {
							'@type': 'Person',
							name: person.name,
							image: {
								'@type': 'ImageObject',
								url: `${baseURL}${person.avatar}`,
							},
						},
					}),
				}}
			/>
			<Flex
				fillWidth
				direction="column"
				paddingY="l" gap="m">
					<Flex
						direction="column"
						fillWidth maxWidth="s">
						<RevealFx
							translateY="4" fillWidth justifyContent="flex-start" paddingBottom="m">
							<Heading
								wrap="balance"
								variant="display-strong-l">
								{home.headline}
							</Heading>
						</RevealFx>
						<RevealFx translateY="12" delay={0.4} style={{width: 'fit-content'}}>
							<Flex style={{width: 'fit-content', marginBottom: '1rem'}}>
								<Button
									id="volt"
									data-border="rounded"
									href={`/${locale}/volt`}
									size="m">
									<Flex
										gap="8"
										alignItems="center">
											VOLT Milan Access 16 Jan 2025
											<Arrow trigger="#volt"/>
									</Flex>
								</Button>
							</Flex>
						</RevealFx>
						<RevealFx style={{ marginTop:'2rem'}}
							translateY="8" delay={0.2} fillWidth justifyContent="flex-start" paddingBottom="m">
							<Text
								wrap="balance"
								onBackground="neutral-weak"
								variant="heading-default-xl"
								>
								{home.subline}
							</Text>
						</RevealFx>

						<RevealFx translateY="12" delay={0.4} style={{width: 'fit-content'}}>
							<Flex style={{width: 'fit-content'}}>
								<Button
									id="about"
									data-border="rounded"
									href={`/${locale}/about`}
									variant="tertiary"
									size="m">
									<Flex
										gap="8"
										alignItems="center">
											Cos'é Cleope?
											<Arrow trigger="#about"/>
									</Flex>
								</Button>
							</Flex>
						</RevealFx>
						
					</Flex>
				
			</Flex>
			<RevealFx translateY="16" delay={0.6}>
				<Projects range={[1,1]} locale={locale}/>
			</RevealFx>
			<Flex
					gap="24"
					mobileDirection="column"
					style={{width:'90%'}}
					>
					<div>
					<Heading
							as="h2"
							variant="display-strong-xs"
							wrap="balance">
							Hai un brand di moda?
						</Heading>
						<div style={{marginTop: '1rem', marginBottom: '1rem'}}>
							Collabora con noi. Allestiamo spazi espositivi personalizzati, sfilate e incrementiamo le vostre vendite. 
							Garantiamo visibilità online attraverso contenuti dedicati post-evento, aumentando la riconoscibilità del marchio.
						</div>
						<Flex
                                className={styles.blockAlign}
                                style={{
                                    backdropFilter: 'blur(var(--static-space-1))',
                                    border: '1px solid var(--brand-alpha-medium)',
                                    width: 'fit-content'
                                }}
                                alpha="brand-weak" radius="full"
                                fillWidth padding="4" gap="8" marginBottom="m"
                                alignItems="center">
                                <Flex paddingLeft="12">
                                    <Icon
                                        name="calendar"
                                        onBackground="brand-weak"/>
                                </Flex>
                                <Flex
                                    paddingX="8">
                                    Fissa una call
                                </Flex>
                                <IconButton
                                    href={'https://cal.com/cleope-events'}
                                    data-border="rounded"
                                    variant="tertiary"
                                    icon="chevronRight"/>
                            </Flex>
					</div>
				</Flex>
			{routes['/blog'] && (
				<Flex
					fillWidth gap="24"
					mobileDirection="column">
					<Flex flex={1} paddingLeft="l">
						<Heading
							as="h2"
							variant="display-strong-xs"
							wrap="balance">
							Ultimi Eventi
						</Heading>
					</Flex>
					<Flex
						flex={3} paddingX="20">
						<Posts range={[1,4]} columns="2" locale={locale}/>
					</Flex>
				</Flex>
			)}
			{ newsletter.display &&
				<Mailchimp newsletter={newsletter} />
			}
		</Flex>
	);
}

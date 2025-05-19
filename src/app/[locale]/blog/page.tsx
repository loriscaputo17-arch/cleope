import { Flex, Heading, Icon, IconButton, Button, Text } from '@/once-ui/components';
import { Mailchimp } from '@/components';
import { baseURL, renderContent } from '@/app/resources';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';

export async function generateMetadata(
	{ params: { locale } }: { params: { locale: string } }
) {
	const t = await getTranslations();
	const { blog } = renderContent(t);

	const title = blog.title;
	const description = blog.description;
	const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'website',
			url: `https://${baseURL}/${locale}/blog`,
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

const customPosts = [
	{
		titolo: "Cleope x Cvlture – Spazio Diaz, Milano",
		data: "14 Novembre 2024",
		linkInstagram: "https://www.instagram.com/cleopeofficial/"
	},
	{
		titolo: "Cleope x Volt – Milano",
		data: "12 Dicembre 2024",
		linkInstagram: "https://www.instagram.com/cleopeofficial/"
	},
	{
		titolo: "Fashion Party – Salerno",
		data: "29 Dicembre 2024",
		linkInstagram: "https://www.instagram.com/cleopeofficial/"
	},
	{
		titolo: "MoBlack @ Volt – Fashion Week",
		data: "27 Febbraio 2025",
		linkInstagram: "https://www.instagram.com/cleopeofficial/"
	},
	{
		titolo: "The Flat",
		data: "28 Febbraio 2025",
		linkInstagram: "https://www.instagram.com/cleopeofficial/"
	},
	{
		titolo: "The Flat",
		data: "28 Marzo 2025",
		linkInstagram: "https://www.instagram.com/cleopeofficial/"
	},
	{
		titolo: "Cleope x Blue Groove @ Arca – Fashion Party",
		data: "4 Aprile 2025",
		linkInstagram: "https://www.instagram.com/cleopeofficial/"
	},
	{
		titolo: "Cleope x Cvlture @ Salerno – Fashion Party",
		data: "19 Aprile 2025",
		linkInstagram: "https://www.instagram.com/cleopeofficial/"
	},
	{
		titolo: "Afrodite x Cleope @ Downtown",
		data: "26 Aprile 2025",
		linkInstagram: "https://www.instagram.com/cleopeofficial/"
	},
	{
		titolo: "Afrodite x Cleope @ Downtown",
		data: "3 Maggio 2025",
		linkInstagram: "https://www.instagram.com/cleopeofficial/"
	},
	{
		titolo: "Cleope Fashion Party @ Ibiza – Caffè Pascucci",
		data: "3 Maggio 2025",
		linkInstagram: "https://www.instagram.com/cleopeofficial/"
	},
	{
		titolo: "Cleope Fashion Party @ Tantra Ibiza",
		data: "4 Maggio 2025",
		linkInstagram: "https://www.instagram.com/cleopeofficial/"
	},
	{
		titolo: "Downtown x Afrodite x Cleope x Blue Groove",
		data: "10 Maggio 2025",
		linkInstagram: "https://www.instagram.com/cleopeofficial/"
	},
	{
		titolo: "Cleope x Blue Groove @ Arca Milano – Fashion Party",
		data: "10 Maggio 2025",
		linkInstagram: "https://www.instagram.com/cleopeofficial/"
	},
	{
		titolo: "Downtown x Afrodite x Cleope",
		data: "17 Maggio 2025",
		linkInstagram: "https://www.instagram.com/cleopeofficial/"
	},
	{
		titolo: "Every Thursday – Cleope x Volt @ Volt",
		data: "Ogni giovedì",
		linkInstagram: "https://www.instagram.com/cleopeofficial/"
	}
];

export default function Blog(
	{ params: { locale } }: { params: { locale: string } }
) {
	unstable_setRequestLocale(locale);

	const t = useTranslations();
	const { person, blog, newsletter } = renderContent(t);

	return (
		<Flex fillWidth maxWidth="s" direction="column">
			<script
				type="application/ld+json"
				suppressHydrationWarning
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'Blog',
						headline: blog.title,
						description: blog.description,
						url: `https://${baseURL}/blog`,
						image: `${baseURL}/og?title=${encodeURIComponent(blog.title)}`,
						author: {
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
			<Heading marginBottom="l" variant="display-strong-s">
				Cleope Events are HOT
			</Heading>

			<Button
				value="Subscribe"
				href={`/${locale}/volt`}
				size="m"
				style={{ width: 'fit-content', marginBottom: '1rem' }}
			>
				Next Events
			</Button>

			<Flex
				style={{
					backdropFilter: 'blur(var(--static-space-1))',
					border: '1px solid var(--brand-alpha-medium)',
					width: 'fit-content',
				}}
				alpha="brand-weak"
				radius="full"
				fillWidth
				padding="4"
				gap="8"
				marginBottom="m"
				alignItems="center"
			>
				<Flex paddingLeft="12">
					<Icon name="calendar" onBackground="brand-weak" />
				</Flex>
				<Flex paddingX="8">Brand Collaboration at VOLT</Flex>
				<IconButton
					href={'https://api.whatsapp.com/send/?phone=%2B393513895086'}
					data-border="rounded"
					variant="tertiary"
					icon="chevronRight"
				/>
			</Flex>

			{/* Rendering personalizzato dei post */}
			{customPosts.map((post, index) => (
				<div
					key={index}
					style={{paddingRight: '1rem', paddingBottom: '2rem'}}
				>
					<Heading marginBottom="2">
						{post.titolo}
					</Heading>
					<Text size="s" marginBottom="2">
						{post.data}
					</Text>
					<div style={{marginTop: '1rem'}}>
					<a href={post.linkInstagram} target="_blank" rel="noopener noreferrer">
						 Instagram
					</a>
					</div>
					
				</div>
			))}

			{newsletter.display && <Mailchimp newsletter={newsletter} />}
		</Flex>
	);
}

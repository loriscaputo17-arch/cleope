import { InlineCode } from "@/once-ui/components";

const person = {
    firstName: 'Selene',
    lastName:  'Yu',
    get name() {
        return `${this.firstName} ${this.lastName}`;
    },
    role:      'Design Engineer',
    avatar:    '/images/avatar.jpg',
    location:  'Asia/Jakarta',        // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
    languages: ['English', 'Bahasa']  // optional: Leave the array empty if you don't want to display languages
}

const newsletter = {
    display: true,
    title: <>Subscribe to {person.firstName}'s Newsletter</>,
    description: <>I occasionally write about design, technology, and share thoughts on the intersection of creativity and engineering.</>
}

const social = [
    // Links are automatically displayed.
    // Import new icons in /once-ui/icons.ts
    {
        name: 'TikTok',
        icon: 'tiktok',
        link: 'https://www.tiktok.com/@cleopeofficial?lang=en',
    },
    {
        name: 'Instagram',
        icon: 'instagram',
        link: 'https://www.instagram.com/cleopeofficial/',
    },
    {
        name: 'Email',
        icon: 'email',
        link: 'mailto:cleope.events@gmail.com',
    },
]

const home = {
    label: 'Home',
    title: `CLEOPE`,
    description: `CLEOPE - Fashion Party`,
    headline: <>Next Date?</>,
    subline: <>CLEOPE - Fashion Party | Night Party. Life is too short to be mass approved.</>
}

const about = {
    label: 'Cleope',
    title: 'Cleope',
    description: `What's Cleope?`,
    tableOfContent: {
        display: true,
        subItems: false
    },
    avatar: {
        display: true
    },
    calendar: {
        display: true,
        link: 'https://cal.com/cleope-events'
    },
    intro: {
        display: true,
        title: 'What\'s Cleope?',
        description: <>Selene is a Jakarta-based design engineer with a passion for transforming complex challenges into simple, elegant design solutions. Her work spans digital interfaces, interactive experiences, and the convergence of design and technology.</>
    },
    work: {
        display: true, // set to false to hide this section
        title: 'Fashion Party',
        experiences: [
            {
                company: 'Brand Exhibition & Runway Show',
                timeframe: '2022 - Present',
                role: 'Aperitif Time',
                achievements: [
                    <>Una serata con aperitivo e DJ set, arricchita da un’esposizione di brand di moda in aree dedicate, cocktail bar, sfilata con modelli e brand partner, e un DJ set finale per continuare la festa.</>,
                    <>Lo stile é protagonista. Il focus è sulla sfilata in collaborazione con modelli e brand, oltre alle esposizioni dei brand durante la serata, con la possibilità di vendere i loro prodotti. </>
                ],
                images: [ // optional: leave the array empty if you don't want to display images
                    {
                        src: '/images/projects/project-01/cover-04.jpg',
                        alt: 'Fashion Show',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/project-01/cover-02.jpg',
                        alt: 'Shooting',
                        width: 16,
                        height: 9
                    },
                ]
            },
            {
                company: 'Night Party',
                timeframe: '2022 - Present',
                role: 'Night Time',
                achievements: [
                    <>Il Night Party è un evento esclusivo dedicato alla musica e all’atmosfera, con una selezione musicale curata grazie alla collaborazione con DJ e format unici per ogni serata.</>,
                    <>Il focus della serata è sugli shooting fotografici realizzati in collaborazione con modelli, brand e ospiti presenti al party, per creare un’esperienza coinvolgente che unisce stile, intrattenimento e momenti indimenticabili.</>
                ],
                images: [ // optional: leave the array empty if you don't want to display images
                    {
                        src: '/images/projects/project-01/img-06.jpg',
                        alt: 'Fashion Show',
                        width: 16,
                        height: 9
                    },
                    {
                        src: '/images/projects/project-01/img-08.jpg',
                        alt: 'Shooting',
                        width: 16,
                        height: 9
                    },
                ]
            },
        ]
    },
    studies: {
        display: true, // set to false to hide this section
        title: 'Brand Collaboration',
        institutions: [
            {
                name: 'Brand Exhibition',
                description: <>Allestiamo spazi espositivi personalizzati e valorizzare i brand e incrementare le vendite e networking. Garantiamo visibilità online con contenuti dedicati post-evento offrendo servizi fotografici e multimediali, aumentando la riconoscibilità del marchio. Contattaci su cleope.events@gmail.com per partecipare al prossimo evento.</>,
                image: [
                    
                ]
            },
            {
                name: 'Runway Show',
                description: <>Per la sfilata, collaboriamo con i brand per organizzare una passerella sulla nostra pista, accompagnata da un DJ set e supportata da servizi fotografici e video professionali. I brand possono scegliere di lavorare con le nostre modelle o con le proprie. Sono disponibili pacchetti personalizzati per partecipare. Contattaci a cleope.events@gmail.com per riservare il tuo spazio al prossimo evento.</>,
                image: [
                    {
                        src: '/images/gallery/img-02.jpg',
                        alt: 'Fashion Show',
                        width: 16,
                        height: 9
                    },
                ]
            }
        ]
    },
    technical: {
        display: true, // set to false to hide this section
        title: 'Exclusivity',
        skills: [
            {
                title: '',
                description: <>I nostri eventi sono esclusivi, pensati per un pubblico selezionato in location straordinarie. La partecipazione è riservata a chi soddisfa i nostri criteri, con liste ospiti online che si aprono per ogni evento, garantendo un’esperienza unica e curata. Ogni data riunisce un mix di ospiti eccezionali, creando un’atmosfera senza paragoni.</>,
                // optional: leave the array empty if you don't want to display images
                images: [
                    {
                        src: '/images/projects/project-01/img-04.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 9
                    },
                ]
            }
        ]
    }
}

const blog = {
    label: 'Events',
    title: 'Cleope Events',
    description: `Cleope Events are HOT`
    // Create new blog posts by adding a new .mdx file to app/blog/posts
    // All posts will be listed on the /blog route
}

const work = {
    label: 'Events',
    title: 'Cleope Events',
    description: `Cleope Events`
    // Create new project pages by adding a new .mdx file to app/blog/posts
    // All projects will be listed on the /home and /work routes
}

const gallery = {
    label: 'Gallery',
    title: 'Cleope Gallery',
    description: `Cleope Photos`,
    // Images from https://pexels.com
    images: [
        { 
            src: '/images/gallery/img-01.jpg', 
            alt: 'image',
            orientation: 'vertical'
        },
        { 
            src: '/images/gallery/img-02.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-03.jpg', 
            alt: 'image',
            orientation: 'vertical'
        },
        { 
            src: '/images/gallery/img-04.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-05.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-06.jpg', 
            alt: 'image',
            orientation: 'vertical'
        },
        { 
            src: '/images/gallery/img-07.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-08.jpg', 
            alt: 'image',
            orientation: 'vertical'
        },
        { 
            src: '/images/gallery/img-09.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-10.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-11.jpg', 
            alt: 'image',
            orientation: 'vertical'
        },
        { 
            src: '/images/gallery/img-12.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-13.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
        { 
            src: '/images/gallery/img-14.jpg', 
            alt: 'image',
            orientation: 'horizontal'
        },
    ]
}

export { person, social, newsletter, home, about, blog, work, gallery };
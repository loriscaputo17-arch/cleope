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
    headline: <>Next Fashion Party ??</>,
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
                    <>Un aperitivo esclusivo con DJ set, sfilata in pista da ballo e aree espositive dedicate ai brand. I modelli creano uno show dinamico tra musica e moda. Un’occasione per scoprire nuovi brand, fare conoscenze e vivere moda e musica da vicino.</>,
                ],
                achievements2: [
                    <>An exclusive aperitif with DJ set, dance floor fashion show and exhibition areas dedicated to brands. The models create a dynamic show between music and fashion. An opportunity to discover new brands, meet new people and experience fashion and music up close.</>,                    ],
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
                company: 'Night Party – Music, Style & Atmosphere',
                timeframe: '2022 - Present',
                role: 'Night Time',
                achievements: [
                    <>Eventi esclusivi in location ricercate, accessibili tramite selezione all’ingresso o su invito. Collaboriamo con DJ di livello per una selezione musicale d’eccellenza e di tendenza. 
Al centro della scena: lo stile dei partecipanti, shooting live con modelli, brand e ospiti, per un’esperienza unica tra nightlife e fashion.</>,  
                    ],
                achievements2: [
                    <>Exclusive events in sought-after locations, accessible through selection at the door or by invitation. We collaborate with high-level DJs for an excellent and trendy musical selection.
At the center of the scene: the style of the participants, live shooting with models, brands and guests, for a unique experience between nightlife and fashion.</>,  
                    ],
                images: [ // optional: leave the array empty if you don't want to display images
                    {
                        src: '/images/projects/project-01/img-10.jpg',
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
                description: <>Collaborare con Cleope significa entrare in contatto diretto con il pubblico in eventi esclusivi. Offriamo spazi espositivi personalizzabili, location selezionate, atmosfera curata, supporti per l’allestimento e visibilità social post-evento. I brand possono promuovere, raccontare e vendere i propri prodotti in modo autentico e coinvolgente.</>,
                description2: <>Collaborating with Cleope means coming into direct contact with the public in exclusive events. We offer customizable exhibition spaces, selected locations, a curated atmosphere, set-up supports and post-event social visibility. Brands can promote, tell and sell their products in an authentic and engaging way.</>,
                image: [
                    
                ]
            },
            {
                name: 'Runway Show',
                description: <>Organizziamo sfilate dinamiche durante i nostri eventi, con DJ set e un pubblico selezionato. I brand possono sfilare con le nostre modelle o le proprie. È uno show d’impatto, perfetto per creare contenuti social forti e aumentare la visibilità del brand.</>,
                description2: <>We organize dynamic fashion shows during our events, with DJ sets and a select audience. Brands can show with our models or their own. It is an impactful show, perfect for creating strong social content and increasing brand visibility.</>,
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
                description2: <>Our events are exclusive, designed for a select audience in extraordinary locations. Attendance is reserved for those who meet our criteria, with online guest lists opening for each event, ensuring a unique and curated experience. Every date brings together a mix of exceptional guests, creating an unparalleled atmosphere.</>,
                // optional: leave the array empty if you don't want to display images
                images: [
                    {
                        src: '/images/projects/project-01/cover-05.jpg',
                        alt: 'Project image',
                        width: 16,
                        height: 16
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
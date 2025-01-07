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
                company: 'Brand Exhibition + Runway Show',
                timeframe: '2022 - Present',
                role: 'Aperitif Time',
                achievements: [
                    <>An aperitif evening with a DJ set, featuring a fashion brand exhibition in dedicated display areas, a cocktail bar, a runway show with models and collaborating brands, followed by an extended DJ set.</>,
                    <>An aperitif evening with a DJ set, featuring a fashion brand exhibition in dedicated display areas, a cocktail bar, a runway show with models and collaborating brands, followed by an extended DJ set. The focus is on the runway show in collaboration with models and brands, as well as the brand exhibitions during the evening, where they also have the opportunity to sell their products.  </>
                ],
                images: [ // optional: leave the array empty if you don't want to display images
                    {
                        src: '/images/projects/project-01/cover-01.jpg',
                        alt: 'Fashion Show',
                        width: 40,
                        height: 20
                    },
                    {
                        src: '/images/projects/project-01/cover-04.jpg',
                        alt: 'Shooting',
                        width: 40,
                        height: 20
                    },
                ]
            },
            {
                company: 'Night Party',
                timeframe: '2022 - Present',
                role: 'Night Time',
                achievements: [
                    <>An aperitif evening with a DJ set, featuring a fashion brand exhibition in dedicated display areas, a cocktail bar, a runway show with models and collaborating brands, followed by an extended DJ set.</>,
                    <>An aperitif evening with a DJ set, featuring a fashion brand exhibition in dedicated display areas, a cocktail bar, a runway show with models and collaborating brands, followed by an extended DJ set. The focus is on the runway show in collaboration with models and brands, as well as the brand exhibitions during the evening, where they also have the opportunity to sell their products.  </>
                ],
                images: [ // optional: leave the array empty if you don't want to display images
                    {
                        src: '/images/projects/project-01/img-07.jpg',
                        alt: 'Fashion Show',
                        width: 40,
                        height: 20
                    },
                    {
                        src: '/images/projects/project-01/img-08.jpg',
                        alt: 'Shooting',
                        width: 40,
                        height: 20
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
                description: <>We collaborate with brands to provide unique, tailored exhibition spaces with the opportunity to sell products on-site. We offer clothing racks, tables, and customizable areas to suit your needs, while hangers are the responsibility of the brand. Our services include photography, videography, and partnerships with models to enhance every brand's presence. Additionally, we ensure visibility and promotion through dedicated post-event content shared across our social media channels. Contact us at cleope.events@gmail.com to reserve your spot for the next event.</>,
                image: [
                    {
                        src: '/images/projects/project-01/img-05.jpg',
                        alt: 'Fashion Show',
                        width: 40,
                        height: 20
                    },
                ]
            },
            {
                name: 'Runway Show',
                description: <>For the runway show, we collaborate with brands looking to organize a catwalk on our event stage. They can choose to work with our models (minimum of 6 models required) or bring their own, focusing the showcase entirely on their clothing and designs. Brands must coordinate with our team if they wish to request external models. To participate in the runway show, the exhibition, or both, we offer tailored packages that include a variety of services we provide. Contact us at cleope.events@gmail.com to learn more and reserve your spot for the next event.</>,
                image: [
                    {
                        src: '/images/gallery/img-02.jpg',
                        alt: 'Fashion Show',
                        width: 40,
                        height: 20
                    },
                ]
            }
        ]
    },
    technical: {
        display: true, // set to false to hide this section
        title: 'Values',
        skills: [
            {
                title: 'Exclusivity',
                description: <>Our events are exclusive, designed for a select audience in extraordinary locations. Attendance is limited to those who meet our criteria, with online guest lists that open for each event, ensuring a unique and curated experience. Every date brings together a mix of remarkable guests, creating an unparalleled atmosphere. </>,
                // optional: leave the array empty if you don't want to display images
                images: [
                    {
                        src: '/images/projects/project-01/img-04.jpg',
                        alt: 'Project image',
                        width: 40,
                        height: 20
                    },
                ]
            },
            {
                title: 'Unique',
                description: <>What makes our events truly unique is our collaboration with standout brands that excel in their field. These brands bring a distinct flair and innovation, making every event not just a gathering but a celebration of creativity, style, and individuality.</>,
                // optional: leave the array empty if you don't want to display images
                images: [
                    {
                        src: '/images/projects/project-01/image-02.jpg',
                        alt: 'Project image',
                        width: 40,
                        height: 20
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
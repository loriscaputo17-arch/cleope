import { Flex, Heading, Text, SmartImage } from '@/once-ui/components';

export default function CleopeEventPage() {
  return (
    <Flex direction="column" fillWidth maxWidth="m" paddingY="xl" gap="40">

        <div className="flex justify-center mb-24">
            <img src="/logo.svg" alt="Logo" className="h-24 w-auto" width={"90px"} height={"90px"} style={{ margin: "auto" }} />
        </div>
        <Heading variant="display-strong-xl">CLEOPE Fashion Party</Heading>
        <h2>30 Maggio, Roma</h2>

        <Text variant="body-default-l" onBackground="neutral-weak">
            CLEOPE è molto più di un evento: è un’esperienza sensoriale dove moda, arte e musica si fondono in un rituale creativo unico.  
            Il 30 maggio, nella suggestiva cornice open-air di <strong>60 Foro Italico (Magnolia Roma) </strong>, andrà in scena la nuova edizione del CLEOPE Fashion Party:  
            una notte pensata per i brand più visionari, per stilisti emergenti, designer audaci e menti libere della scena fashion contemporanea.
        </Text>

        <Heading variant="display-strong-s">🕘 Orari</Heading>
        <Text variant="body-default-l">
            <strong>22:30 – 03:30</strong> · Fashion Party & Night Show  
            <br />
            Una serata lunga, intensa, viva — tra esposizioni, sfilate, performance e DJ set sotto le stelle.
        </Text>

        <Heading variant="display-strong-s">🎵 Musica</Heading>
        <Text variant="body-default-l">
            Un sound raffinato e sensuale accompagnerà la notte con un DJ set Afrohouse e contaminazioni elettroniche, per creare l’atmosfera perfetta tra passerella e dancefloor.
        </Text>

        <Heading variant="display-strong-s">🛍️ Esposizione Brand</Heading>
        <Text variant="body-default-l">
            I brand selezionati avranno uno spazio dedicato per presentare le proprie collezioni in una delle <strong>12 aree espositive curate</strong>, tra tavoli, relle, pannelli e installazioni visive.
            Ogni brand potrà personalizzare il proprio set, valorizzando estetica e storytelling in modo autentico e originale.
        </Text>

        <img
            src={'/images/esposizioni.jpeg'}
            alt="Esempio di allestimento esposizione CLEOPE"
            style={{width:"100%", height: "auto"}}
        />

        <Heading variant="display-strong-s">👠 Sfilata</Heading>
        <Text variant="body-default-l">
            Ogni brand avrà l’opportunità di portare in passerella <strong>2-3 look</strong> con <strong>fino a 4 modelli</strong> (questi valori possono variare se concordati con il brand).  
            È possibile scegliere tra modelli professionisti del team CLEOPE o utilizzare il proprio cast.  
            La sfilata si svolgerà su una passerella dinamica, tra luci e musica, trasformando il pubblico in parte attiva dello show.
        </Text>

        <Heading variant="display-strong-s">📸 Shooting & Video</Heading>
        <Text variant="body-default-l">
            Il nostro team media documenterà ogni momento: esposizioni, dettagli, backstage e passerella.  
            Ogni brand riceverà <strong>contenuti professionali foto/video</strong> utilizzabili per promozione, portfolio e social.  
            Il materiale sarà consegnato entro pochi giorni dall’evento.
        </Text>

        <Heading variant="display-strong-s">📲 Promozione</Heading>
        <Text variant="body-default-l">
            CLEOPE non è solo live: è visibilità.  
            Promuoviamo l’evento prima, durante e dopo attraverso i canali social di <strong>@cleopeofficial</strong> con contenuti.  
            I brand partecipanti saranno taggati e valorizzati in tutta la comunicazione.
        </Text>

        <Heading variant="display-strong-s">📍 Location: Magnolia – Roma</Heading>
        <Text variant="body-default-l">
            Indirizzo: Viale delle Olimpiadi, 00135 Roma RM</Text>
        <Text variant="body-default-l">
            Un giardino urbano nascosto tra gli alberi di Roma. <strong> Magnolia</strong> è uno spazio all’aperto suggestivo, pensato per eventi immersivi.  
            Perfetto per vivere una notte estiva tra installazioni, moda e musica sotto le stelle.
        </Text>
        <img
            src={'/images/magnolia.webp'}
            alt="Location"
            style={{width:"100%", height: "auto"}}
        />
        

    </Flex>
  );
}
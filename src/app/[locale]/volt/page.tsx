"use client"

import { Avatar, Button, Flex, Heading, Icon, IconButton, SmartImage, Tag, Text } from '@/once-ui/components';
import { baseURL, renderContent } from '@/app/resources';
import TableOfContents from '@/components/about/TableOfContents';
import styles from '@/components/about/about.module.scss'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from "react";
import Popup from "@/components/volt/Popup";
import PopupInfoTables from "@/components/voltInfo/Popup";
import Popup2 from "@/components/volt2/Popup";
import { collection, addDoc, doc, getDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function About(){
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [activePopup2, setActivePopup2] = useState<string | null>(null);
  const [activePopup3, setActivePopup3] = useState<string | null>(null);
  const [alertPopup, setAlertPopup] = useState<string | null>(null);
  const router = useRouter();

    const sendEmail = async (emailData) => {
        try {
          const response = await fetch('/api/sendEmail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
          });
    
          const data = await response.json();
          if (response.ok) {
            console.log('Email inviata:', data);
          } else {
            console.error('Errore nell\'invio dell\'email:', data);
          }
        } catch (error) {
          console.error('Errore nella richiesta:', error);
        }
      };
    
      const handleSaveCode = async (email:any, instagram:any, type:any) => {
        try {
          if (type === "session") {
    
            const userCodeQuery = query(
              collection(db, "users"),
              where("userCode", "==", email)
            );
            const userCodeSnapshot = await getDocs(userCodeQuery);
    
            if (!userCodeSnapshot.empty) {
              let user=userCodeSnapshot.docs[0].data()
              //alert("Login eseguito con successo!");
              setActivePopup(null);
              router.push(`/home?userCode=${user.userCode}`);
            } else {
              alert("Code not found.");
            }
          } else if (type === "request") {
            const emailQuery = query(
              collection(db, "users"),
              where("email", "==", email)
            );
            const emailSnapshot = await getDocs(emailQuery);
          
            const instagramQuery = query(
              collection(db, "users"),
              where("instagram", "==", instagram)
            );
            const instagramSnapshot = await getDocs(instagramQuery);
          
            if (!emailSnapshot.empty || !instagramSnapshot.empty) {
              let existingUser;
              
              // Recupera i dati dell'utente che corrispondono
              if (!emailSnapshot.empty) {
                existingUser = emailSnapshot.docs[0].data();
              } else if (!instagramSnapshot.empty) {
                existingUser = instagramSnapshot.docs[0].data();
              }
          
              const existingCode = existingUser.userCode; // Recupera il codice esistente
          
              // Invia email con il codice già presente
              sendEmail({
                to: existingUser.email,
                subject: "Benvenuto in CLEOPE: Il tuo codice di accesso esclusivo",
                text: `Ecco il tuo codice: ${existingCode}`,
                html: `<h1>Benvenuto in CLEOPE!</h1>
                  <p><strong>Il tuo codice è:</strong> <span style="font-size: 24px; color: #0049ff;">${existingCode}</span></p>
                  <p>Clicca sul link qui sotto per utilizzare il tuo codice e accedere ai nostri eventi sulla piattaforma:</p>
                  <a href="https://cleope-sigma.vercel.app/?code=${existingCode}" style="color: #007bff;">https://cleope-sigma.vercel.app/?code=${existingCode}</a>
                  <p>Grazie per esserti unito a CLEOPE!</p>
                  <p><em>Team CLEOPE</em></p>
                  <a href="https://www.instagram.com/cleopeofficial/" style="color: #007bff;">
              Seguici su Instagram
            </a>
            <a href="https://www.tiktok.com/@cleopeofficial?_t=ZN-8ry8NBWWrKA&_r=1" style="color: #007bff;">
              Seguici su TikTok
            </a>
                  `,
              });
          
              alert("This email or Instagram is already in use! We have resent the code to your email.");
              return;
            }
          
            // Genera un nuovo codice se email e Instagram non sono già presenti
            const uniqueCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            await addDoc(collection(db, "users"), {
              ...instagram,
              email,
              userCode: uniqueCode,
              createdAt: serverTimestamp(),
            });
          
            // Invia l'email con il nuovo codice
            sendEmail({
              to: email,
              subject: "Benvenuto in CLEOPE: Il tuo codice di accesso esclusivo",
              text: `Ecco il tuo codice: ${uniqueCode}`,
              html: `<h1>Benvenuto in CLEOPE!</h1>
                <p><strong>Il tuo codice è:</strong> <span style="font-size: 24px; color: #0049ff;">${uniqueCode}</span></p>
                <p>Clicca sul link qui sotto per utilizzare il tuo codice e accedere ai nostri eventi sulla piattaforma:</p>
                <a href="https://cleope-sigma.vercel.app/?code=${uniqueCode}" style="color: #007bff;">https://cleope-sigma.vercel.app/?code=${uniqueCode}</a>
                <p>Grazie per esserti unito a CLEOPE!</p>
                <p><em>Team CLEOPE</em></p>
                <a href="https://www.instagram.com/cleopeofficial/" style="color: #007bff;">
              Seguici su Instagram
            </a>
            <a href="https://www.tiktok.com/@cleopeofficial?_t=ZN-8ry8NBWWrKA&_r=1" style="color: #007bff;">
              Seguici su TikTok
            </a>
            `,
            });
          
            alert(`Your code is ${uniqueCode}. We just sent you an email.`);
            setActivePopup(null);
          } else {
              // Caso per "lists"
            
              const listQuery = query(
                collection(db, "VOLTaccessList"),
                where("email", "==", email),
                where("event", "==", "22 Feb 2025"),
                where("type", "==", type)
              );
              const listSnapshot = await getDocs(listQuery);
            
              if (!listSnapshot.empty) {
                alert(`Utente giá presente.`);
                return;
              }
            
              await addDoc(collection(db, "VOLTaccessList"), {
                email: email,
                instagram: instagram,
                type: type,
                datetime: serverTimestamp(),
                event: "22 Feb 2025",
              });

              alert(`Grazie!`);
              setActivePopup(null); 
              setAlertPopup("Grazie!")
            }
        } catch (error) {
          console.error("Errore:", error);
          alert("Error during the operation.");
        }
      };

      const handleSaveCode2 = async (email:any, instagram:any, type:any) => {
        try {
          if (type === "session") {
    
            const userCodeQuery = query(
              collection(db, "users"),
              where("userCode", "==", email)
            );
            const userCodeSnapshot = await getDocs(userCodeQuery);
    
            if (!userCodeSnapshot.empty) {
              let user=userCodeSnapshot.docs[0].data()
              //alert("Login eseguito con successo!");
              setActivePopup(null);
              router.push(`/home?userCode=${user.userCode}`);
            } else {
              alert("Code not found.");
            }
          } else if (type === "request") {
            const emailQuery = query(
              collection(db, "users"),
              where("email", "==", email)
            );
            const emailSnapshot = await getDocs(emailQuery);
          
            const instagramQuery = query(
              collection(db, "users"),
              where("instagram", "==", instagram)
            );
            const instagramSnapshot = await getDocs(instagramQuery);
          
            if (!emailSnapshot.empty || !instagramSnapshot.empty) {
              let existingUser;
              
              // Recupera i dati dell'utente che corrispondono
              if (!emailSnapshot.empty) {
                existingUser = emailSnapshot.docs[0].data();
              } else if (!instagramSnapshot.empty) {
                existingUser = instagramSnapshot.docs[0].data();
              }
          
              const existingCode = existingUser.userCode; // Recupera il codice esistente
          
              // Invia email con il codice già presente
              sendEmail({
                to: existingUser.email,
                subject: "Benvenuto in CLEOPE: Il tuo codice di accesso esclusivo",
                text: `Ecco il tuo codice: ${existingCode}`,
                html: `<h1>Benvenuto in CLEOPE!</h1>
                  <p><strong>Il tuo codice è:</strong> <span style="font-size: 24px; color: #0049ff;">${existingCode}</span></p>
                  <p>Clicca sul link qui sotto per utilizzare il tuo codice e accedere ai nostri eventi sulla piattaforma:</p>
                  <a href="https://cleope-sigma.vercel.app/?code=${existingCode}" style="color: #007bff;">https://cleope-sigma.vercel.app/?code=${existingCode}</a>
                  <p>Grazie per esserti unito a CLEOPE!</p>
                  <p><em>Team CLEOPE</em></p>
                  <a href="https://www.instagram.com/cleopeofficial/" style="color: #007bff;">
              Seguici su Instagram
            </a>
            <a href="https://www.tiktok.com/@cleopeofficial?_t=ZN-8ry8NBWWrKA&_r=1" style="color: #007bff;">
              Seguici su TikTok
            </a>
                  `,
              });
          
              alert("This email or Instagram is already in use! We have resent the code to your email.");
              return;
            }
          
            // Genera un nuovo codice se email e Instagram non sono già presenti
            const uniqueCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            await addDoc(collection(db, "users"), {
              ...instagram,
              email,
              userCode: uniqueCode,
              createdAt: serverTimestamp(),
            });
          
            // Invia l'email con il nuovo codice
            sendEmail({
              to: email,
              subject: "Benvenuto in CLEOPE: Il tuo codice di accesso esclusivo",
              text: `Ecco il tuo codice: ${uniqueCode}`,
              html: `<h1>Benvenuto in CLEOPE!</h1>
                <p><strong>Il tuo codice è:</strong> <span style="font-size: 24px; color: #0049ff;">${uniqueCode}</span></p>
                <p>Clicca sul link qui sotto per utilizzare il tuo codice e accedere ai nostri eventi sulla piattaforma:</p>
                <a href="https://cleope-sigma.vercel.app/?code=${uniqueCode}" style="color: #007bff;">https://cleope-sigma.vercel.app/?code=${uniqueCode}</a>
                <p>Grazie per esserti unito a CLEOPE!</p>
                <p><em>Team CLEOPE</em></p>
                <a href="https://www.instagram.com/cleopeofficial/" style="color: #007bff;">
              Seguici su Instagram
            </a>
            <a href="https://www.tiktok.com/@cleopeofficial?_t=ZN-8ry8NBWWrKA&_r=1" style="color: #007bff;">
              Seguici su TikTok
            </a>
            `,
            });
          
            alert(`Your code is ${uniqueCode}. We just sent you an email.`);
            setActivePopup(null);
          } else {
              // Caso per "lists"
            
              const listQuery = query(
                collection(db, "VOLTaccessList"),
                where("email", "==", email),
                where("event", "==", "27 Feb 2025"),
                where("type", "==", type)
              );
              const listSnapshot = await getDocs(listQuery);
            
              if (!listSnapshot.empty) {
                alert(`Utente giá presente.`);
                return;
              }
            
              await addDoc(collection(db, "VOLTaccessList"), {
                email: email,
                instagram: instagram,
                type: type,
                datetime: serverTimestamp(),
                event: "27 Feb 2025",
              });
            
              alert(`Grazie! Hai appena fatto richiesta di iscrizione alla lista Cleope all'evento VOLT del 27 Febbraio 2025.`);
              setActivePopup(null); 
              setAlertPopup("Grazie! Hai appena fatto richiesta di iscrizione alla lista Cleope all'evento VOLT del 27 Febbraio 2025.")
            }
        } catch (error) {
          console.error("Errore:", error);
          alert("Error during the operation.");
        }
      };

      const handleSaveCode3 = async (email:any, instagram:any, type:any) => {
        try {
          if (type === "session") {
    
            const userCodeQuery = query(
              collection(db, "users"),
              where("userCode", "==", email)
            );
            const userCodeSnapshot = await getDocs(userCodeQuery);
    
            if (!userCodeSnapshot.empty) {
              let user=userCodeSnapshot.docs[0].data()
              //alert("Login eseguito con successo!");
              setActivePopup(null);
              router.push(`/home?userCode=${user.userCode}`);
            } else {
              alert("Code not found.");
            }
          } else if (type === "request") {
            const emailQuery = query(
              collection(db, "users"),
              where("email", "==", email)
            );
            const emailSnapshot = await getDocs(emailQuery);
          
            const instagramQuery = query(
              collection(db, "users"),
              where("instagram", "==", instagram)
            );
            const instagramSnapshot = await getDocs(instagramQuery);
          
            if (!emailSnapshot.empty || !instagramSnapshot.empty) {
              let existingUser;
              
              // Recupera i dati dell'utente che corrispondono
              if (!emailSnapshot.empty) {
                existingUser = emailSnapshot.docs[0].data();
              } else if (!instagramSnapshot.empty) {
                existingUser = instagramSnapshot.docs[0].data();
              }
          
              const existingCode = existingUser.userCode; // Recupera il codice esistente
          
              // Invia email con il codice già presente
              sendEmail({
                to: existingUser.email,
                subject: "Benvenuto in CLEOPE: Il tuo codice di accesso esclusivo",
                text: `Ecco il tuo codice: ${existingCode}`,
                html: `<h1>Benvenuto in CLEOPE!</h1>
                  <p><strong>Il tuo codice è:</strong> <span style="font-size: 24px; color: #0049ff;">${existingCode}</span></p>
                  <p>Clicca sul link qui sotto per utilizzare il tuo codice e accedere ai nostri eventi sulla piattaforma:</p>
                  <a href="https://cleope-sigma.vercel.app/?code=${existingCode}" style="color: #007bff;">https://cleope-sigma.vercel.app/?code=${existingCode}</a>
                  <p>Grazie per esserti unito a CLEOPE!</p>
                  <p><em>Team CLEOPE</em></p>
                  <a href="https://www.instagram.com/cleopeofficial/" style="color: #007bff;">
              Seguici su Instagram
            </a>
            <a href="https://www.tiktok.com/@cleopeofficial?_t=ZN-8ry8NBWWrKA&_r=1" style="color: #007bff;">
              Seguici su TikTok
            </a>
                  `,
              });
          
              alert("This email or Instagram is already in use! We have resent the code to your email.");
              return;
            }
          
            // Genera un nuovo codice se email e Instagram non sono già presenti
            const uniqueCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            await addDoc(collection(db, "users"), {
              ...instagram,
              email,
              userCode: uniqueCode,
              createdAt: serverTimestamp(),
            });
          
            // Invia l'email con il nuovo codice
            sendEmail({
              to: email,
              subject: "Benvenuto in CLEOPE: Il tuo codice di accesso esclusivo",
              text: `Ecco il tuo codice: ${uniqueCode}`,
              html: `<h1>Benvenuto in CLEOPE!</h1>
                <p><strong>Il tuo codice è:</strong> <span style="font-size: 24px; color: #0049ff;">${uniqueCode}</span></p>
                <p>Clicca sul link qui sotto per utilizzare il tuo codice e accedere ai nostri eventi sulla piattaforma:</p>
                <a href="https://cleope-sigma.vercel.app/?code=${uniqueCode}" style="color: #007bff;">https://cleope-sigma.vercel.app/?code=${uniqueCode}</a>
                <p>Grazie per esserti unito a CLEOPE!</p>
                <p><em>Team CLEOPE</em></p>
                <a href="https://www.instagram.com/cleopeofficial/" style="color: #007bff;">
              Seguici su Instagram
            </a>
            <a href="https://www.tiktok.com/@cleopeofficial?_t=ZN-8ry8NBWWrKA&_r=1" style="color: #007bff;">
              Seguici su TikTok
            </a>
            `,
            });
          
            alert(`Your code is ${uniqueCode}. We just sent you an email.`);
            setActivePopup(null);
          } else {
              // Caso per "lists"
            
              const listQuery = query(
                collection(db, "VOLTaccessList"),
                where("email", "==", email),
                where("event", "==", "06 Feb 2025"),
                where("type", "==", type)
              );
              const listSnapshot = await getDocs(listQuery);
            
              if (!listSnapshot.empty) {
                alert(`Utente giá presente.`);
                return;
              }
            
              await addDoc(collection(db, "VOLTaccessList"), {
                email: email,
                instagram: instagram,
                type: type,
                datetime: serverTimestamp(),
                event: "06 Feb 2025",
              });
            
              alert(`Grazie! Hai appena fatto richiesta di iscrizione alla lista Cleope all'evento VOLT del 6 Febbraio 2025.`);
              setActivePopup(null); 
              setAlertPopup("Grazie! Hai appena fatto richiesta di iscrizione alla lista Cleope all'evento VOLT del 6 Febbraio 2025.")
            }
        } catch (error) {
          console.error("Errore:", error);
          alert("Error during the operation.");
        }
      };
    
    return (
        <div>
            <div className="text-white min-h-screen items-center justify-center px-4" style={{ zIndex: 2 }}>
            {/* Logo */}
            <header style={{marginBottom: '3rem', marginTop: '3rem'}}>
              <div className="flex items-center justify-center" style={{width: 'fit-content', alignItems: 'center',marginLeft: 'auto',marginRight: 'auto'}}>
              <img src="/logo.svg" alt="Logo" className="h-24 w-auto" width={'90px'} height={'90px'} style={{margin: 'auto'}} />
              <p style={{fontWeight: '200', marginRight: '1rem'}}>X</p>
              <img src="https://static1.squarespace.com/static/ta/58909d6e1e5b6ccc19c26826/166/assets/volt-bianco.svg" alt="Logo" className="h-24 w-auto" width={'115px'} height={'115px'} style={{margin: 'auto'}} />
              </div>
            </header>


            {alertPopup && (
              <div style={{marginBottom: '2rem'}}>
                <p style={{textAlign: 'center'}}>Grazie!</p>
              </div>
            )}

            <main className="w-full max-w-sm">

                      {/*<Button
                                value="Subscribe"
                                onClick={() => setActivePopup("volt")}
                                size="m"
                                style={{width:'fit-content', margin:'auto', marginBottom: '1rem'}}>
											VOLT Milan Access 13 Feb 2025
                      </Button>*/}

                      <Button
                                value="Subscribe"
                                onClick={() => setActivePopup2("volt")}
                                size="m"
                                style={{width:'fit-content', margin:'auto', marginBottom: '1rem'}}>
											VOLT Milan Access 27 Feb 2025
                      </Button>

                      <a href="https://www.eventbrite.it/e/biglietti-insomnia-x-cleope-the-flat-by-macan-mfw-1251579220139?aff=Cleope">
                        <Button
                                  value="Subscribe"
                                  size="m"
                                  style={{width:'fit-content', margin:'auto', marginBottom: '1rem'}}>
                        Insomnia x CLEOPE The Flat by Macan MFW
                        </Button>
                      </a>


            </main>
            <div className={styles.imageContainer}>
              
              <img alt={'Volt Cover'} src={'/images/venuevolt.jpeg'} className={styles.voltCover}
                  style={{border: '1px solid var(--neutral-alpha-weak)',marginTop: '3rem', marginBottom: '3rem'}}/>
              </div>

              <Flex
                                className={styles.blockAlign}
                                style={{
                                    backdropFilter: 'blur(var(--static-space-1))',
                                    border: '1px solid var(--brand-alpha-medium)',
                                    width: 'fit-content',
                                    margin:'auto'
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
                                    Collaborazione Brand al VOLT
                                </Flex>
                                <IconButton
                                    href={'https://cal.com/cleope-events'}
                                    data-border="rounded"
                                    variant="tertiary"
                                    icon="chevronRight"/>
                            </Flex>

            {/* Popup */}
            {activePopup && (
              <PopupInfoTables
                type={activePopup}
                onClose={() => setActivePopup(null)}
                onSaveCode={handleSaveCode}
                onSwitchPopUp={() => setActivePopup("request")}
              />
            )}

            {activePopup2 && (
              <Popup
              type={activePopup2}
              onClose={() => setActivePopup2(null)}
              onSaveCode={handleSaveCode2}
              onSwitchPopUp={() => setActivePopup("request")}
            />
            )}

            {activePopup3 && (
              <Popup2
              type={activePopup3}
              onClose={() => setActivePopup3(null)}
              onSaveCode={handleSaveCode3}
              onSwitchPopUp={() => setActivePopup("request")}
            />
            )}

          </div>
        </div>
    );
}

import { useState, useEffect } from "react";
import { Avatar, Button,Input,  Flex, Heading, Icon, IconButton, SmartImage, Tag, Text } from '@/once-ui/components';
import styles from './Popup.module.scss'

export default function Popup({ type, onClose, onSaveCode, onSwitchPopUp }) {
  const [userCode, setUserCode] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userInstagram, setUserInstagram] = useState("");
  const [userCodeTable, setUserCodeTable] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");

  const renderContent = () => {
    if (type === "volt") {
      return (
        <div>
        <header className="mb-0">
          <div className="w-20 h-20 bg-transparent rounded-full flex items-center justify-center m-auto">
            <img src="https://static1.squarespace.com/static/ta/58909d6e1e5b6ccc19c26826/166/assets/volt-bianco.svg" alt="Logo" className="h-20" style={{margin: 'auto'}} width={'70px'} height={'70px'} />
          </div>
        </header>
         <div style={{
          gridTemplateColumns: 'repeat(1, 1fr)', // grid-cols-1
          gap: '1rem'
        }}>
          {/* Lista */}
          <div className="p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Info & Tavoli</h3>
            <h3 className="font-semibold mb-2" style={{fontSize: '14px', marginTop: '1rem'}}>Liste chiuse.</h3>

            <div className="mb-2">
              <p style={{marginTop: '1rem', marginBottom: '1rem', fontSize: '14px'}}>
              Inserisci la tua email e il tuo Instagram per avere informazioni riguardo l'evento al VOLT del 16 gennaio 2025. 
              </p>
            </div>

                        <div style={{marginBottom: '1rem'}}>
                        <Input
                          formNoValidate
                          labelAsPlaceholder
                          id="mce-EMAIL"
                          name="EMAIL"
                          type="email"
                          label="Email"
                          required
                          onChange={(e) => setUserEmail(e.target.value)}
                          />
                        </div>
                        <Input
                        formNoValidate
                        labelAsPlaceholder
                        id="mce-INSTAGRAM"
                        name="INTASGRAM"
                        type="text"
                        label="Instagram"
                        required
                        onChange={(e) => setUserInstagram(e.target.value)}
                        />

                      <div style={{display: 'flex'}}>
                        <a href="mailto:cleope.events@gmail.com" style={{
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          marginTop: '2rem',
                        }}>CLicca qui per prenotare un tavolo al Volt</a>
                      </div>


                      <div style={{display: 'flex', gap: '2rem', marginTop: '2rem'}}>
                              <Button
                                value="Close"
                                onClick={() => onSaveCode(userEmail, userInstagram, "lista")}
                                size="m"
                                style={{marginLeft: 'auto'}}
                                >
                                Richiedi Info
                              </Button>

                            <Button
                                value="Close"
                                onClick={onClose}
                                size="m"          
                                style={{marginRight: 'auto'}}             
                                data-border="rounded"
									              variant="tertiary"         
                                
                                >
                                Chiudi
                            </Button>
                </div>
            
          </div>
        </div>
        </div>
        
      );
    }

    return null;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div
        className={styles.popup}
      >
        {renderContent()}

      </div>
    </div>
  );
}

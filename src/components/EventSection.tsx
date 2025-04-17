'use client';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, setDoc, doc, getDoc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Flex, Button, Heading, Text } from '@/once-ui/components';
import styles from '@/app/[locale]/dashboard/dashboard.module.scss';

type Row = {
    id: string;
    name: string;
    surname: string;
    phone: string;
    email: string;
    eventType: string;
    createdAt: string;
};

type AttendanceStatus = {
    entered: boolean;
    bounced: boolean;
    interesting: boolean;
};

export default function EventSection({ event }: { event: string }) {
    const [data, setData] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({});
    const [newUser, setNewUser] = useState({ name: '', surname: '', phone: '' });

    const fetchData = async () => {
        try {
            const collectionRef = collection(db, 'eventRegistrations');
            const q = query(collectionRef, where('eventType', '==', event));
            const snapshot = await getDocs(q);

            const rows: Row[] = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name || '',
                    surname: data.surname || '',
                    phone: data.phone || '',
                    email: data.email || '',
                    eventType: data.eventType || '',
                    createdAt: data.createdAt?.toDate().toISOString() || '',
                };
            });

            setData(rows);

            const statusSnapshots = await Promise.all(
                rows.map(row => getDoc(doc(db, 'eventAttendance', row.id)))
            );

            const loadedStatuses: Record<string, AttendanceStatus> = {};
            statusSnapshots.forEach((docSnap, i) => {
                loadedStatuses[rows[i].id] = docSnap.exists()
                    ? docSnap.data() as AttendanceStatus
                    : { entered: false, bounced: false, interesting: false };
            });

            setStatuses(loadedStatuses);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [event]);

    const handleCheckboxChange = async (rowId: string, field: keyof AttendanceStatus) => {
        const updated = {
            ...statuses[rowId],
            [field]: !statuses[rowId][field],
        };

        setStatuses(prev => ({ ...prev, [rowId]: updated }));

        try {
            await setDoc(doc(db, 'eventAttendance', rowId), updated, { merge: true });
        } catch (err) {
            console.error(err);
        }
    };

    const addNewUser = async () => {
        try {
            const newUserData = { ...newUser, eventType: event, createdAt: new Date() };
            await addDoc(collection(db, 'eventRegistrations'), newUserData);
            fetchData();
            setNewUser({ name: '', surname: '', phone: '' });
        } catch (err) {
            console.error(err);
        }
    };

    const generateCSV = () => {
        const csvRows = [
            ['Name', 'Surname', 'Phone', 'Email', 'Event Type', 'Created At'],
            ...data.map(row => [
                row.name, row.surname, row.phone, row.email, row.eventType, row.createdAt,
            ])
        ];
        const csvContent = csvRows.map(e => e.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${event.replace(/\s+/g, '_')}_data.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredData = data.filter(row =>
        `${row.name} ${row.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const countStatus = () => {
        let entered = 0, bounced = 0;
        filteredData.forEach(row => {
            const status = statuses[row.id];
            if (status?.entered) entered++;
            if (status?.bounced) bounced++;
        });
        return { entered, bounced };
    };

    const { entered, bounced } = countStatus();

    return (
        <div>
            <Heading variant="heading-strong-m">
                Event: {event} ({filteredData.length} iscritti — ✅ {entered} entrati, ❌ {bounced} rimbalzati)
            </Heading>

            <div style={{ marginTop: '1rem' }}>
                <Heading variant="heading-strong-s" marginBottom="s">Aggiungi Nuovo Utente</Heading>
                <input placeholder="Nome" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} 
                
                style={{
                    marginBottom: '2rem',
                    width: '300px',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    fontSize: '1rem',
                    backgroundColor: '#fff',
                    color: '#333',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'%23666\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1rem',
                }}
                />
                <input placeholder="Cognome" value={newUser.surname} onChange={(e) => setNewUser({ ...newUser, surname: e.target.value })}
                
                style={{
                    marginBottom: '2rem',
                    width: '300px',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    fontSize: '1rem',
                    backgroundColor: '#fff',
                    color: '#333',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'%23666\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1rem',
                }}
                />
                <input placeholder="Telefono" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} 
                
                style={{
                    marginBottom: '2rem',
                    width: '300px',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    fontSize: '1rem',
                    backgroundColor: '#fff',
                    color: '#333',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'%23666\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1rem',
                }}/>

                <Button onClick={addNewUser} label="Aggiungi Utente" size="m" style={{marginBottom: '2rem'}} />
            </div>


            <input placeholder="Cerca per nome o cognome..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{
                    marginBottom: '2rem',
                    width: '300px',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    fontSize: '1rem',
                    backgroundColor: '#fff',
                    color: '#333',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'%23666\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1rem',
                    marginRight: '1rem',
                }} />
            <Button onClick={generateCSV} label="Download CSV" size="m" style={{marginBottom: '1rem'}}/>


            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Cognome</th>
                            <th>Cell</th>
                            <th>Entrato</th>
                            <th>Rimbalzato</th>
                            <th>Interessante</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(row => (
                            <tr key={row.id}>
                                <td>
                                    <div> <button
                    onClick={() => navigator.clipboard.writeText(`${row.name} ${row.surname}`)}
                    style={{
                        marginRight: '0.5rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '6px',
                        border: '1px solid #ccc',
                        backgroundColor: '#f5f5f5',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                    }}
                    title="Copia nome e cognome"
                >
                    📋
                </button>

                                    {row.name}</div>
                                </td>
                                <td>{row.surname}</td>
                                <td>{row.phone}</td>
                                <td>
                                    <div onClick={() => handleCheckboxChange(row.id, 'entered')}>
                                       Entrato &nbsp;{statuses[row.id]?.entered ? '✔️' : '❌'}
                                    </div>
                                </td>
                                <td>
                                    <div onClick={() => handleCheckboxChange(row.id, 'bounced')}>
                                        Rimbalzato &nbsp;{statuses[row.id]?.bounced ? '✔️' : '❌'}
                                    </div>
                                </td>
                                <td>
                                    <div onClick={() => handleCheckboxChange(row.id, 'interesting')}>
                                        Cool &nbsp;{statuses[row.id]?.interesting ? '✔️' : '❌'}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

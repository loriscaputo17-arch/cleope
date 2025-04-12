"use client";
import { useEffect, useState } from 'react';
import { Flex, Button, Heading, Text } from '@/once-ui/components';
import { db } from "@/lib/firebase";
import {
    collection,
    query,
    where,
    getDocs,
    setDoc,
    doc,
    getDoc,
    addDoc,
} from 'firebase/firestore';
import styles from './dashboard.module.scss';

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

export default function Dashboard() {
    const [data, setData] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({});
    const [newUser, setNewUser] = useState({ name: '', surname: '', phone: '' });

    const events = ['Downtown April 12th'];

    const fetchData = async () => {
        try {
            const collectionRef = collection(db, 'eventRegistrations');
            const queries = events.map(event =>
                query(collectionRef, where('eventType', '==', event))
            );

            const snapshotPromises = queries.map(q => getDocs(q));
            const snapshots = await Promise.all(snapshotPromises);

            const rows: Row[] = snapshots.flatMap(snapshot =>
                snapshot.docs.map(doc => {
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
                })
            );

            setData(rows);

            const statusSnapshots = await Promise.all(
                rows.map(row => getDoc(doc(db, 'eventAttendance', row.id)))
            );

            const loadedStatuses: Record<string, AttendanceStatus> = {};
            statusSnapshots.forEach((docSnap, i) => {
                if (docSnap.exists()) {
                    loadedStatuses[rows[i].id] = docSnap.data() as AttendanceStatus;
                } else {
                    loadedStatuses[rows[i].id] = {
                        entered: false,
                        bounced: false,
                        interesting: false,
                    };
                }
            });

            setStatuses(loadedStatuses);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = async (rowId: string, field: keyof AttendanceStatus) => {
        const currentStatus = statuses[rowId] || {
            entered: false,
            bounced: false,
            interesting: false,
        };

        const updatedStatus = {
            ...currentStatus,
            [field]: !currentStatus[field],
        };

        setStatuses(prev => ({
            ...prev,
            [rowId]: updatedStatus,
        }));

        try {
            await setDoc(doc(db, 'eventAttendance', rowId), updatedStatus, { merge: true });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const generateCSV = () => {
        const csvRows = [
            ['Name', 'Surname', 'Phone', 'Email', 'Event Type', 'Created At'],
            ...data.map(row => [
                row.name,
                row.surname,
                row.phone,
                row.email,
                row.eventType,
                row.createdAt,
            ]),
        ];

        const csvContent = csvRows.map(e => e.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'event_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const addNewUser = async () => {
        try {
            const newUserData = { ...newUser, eventType: events[0], createdAt: new Date() };

            await addDoc(collection(db, 'eventRegistrations'), newUserData);
            fetchData();
            setNewUser({ name: '', surname: '', phone: '' });
        } catch (error) {
            console.error("Error adding user: ", error);
        }
    };

    const countStatus = (rows: Row[]) => {
        let entered = 0;
        let bounced = 0;

        rows.forEach(row => {
            const status = statuses[row.id];
            if (status?.entered) entered++;
            if (status?.bounced) bounced++;
        });

        return { entered, bounced };
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = data
        .filter(row =>
            `${row.name} ${row.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const fullNameA = `${a.name} ${a.surname}`.toLowerCase();
            const fullNameB = `${b.name} ${b.surname}`.toLowerCase();
            return fullNameA.localeCompare(fullNameB);
        });

    return (
        <Flex className={styles.dashboard} direction="column" padding="l">
            <Heading variant="display-strong-l" marginBottom="l">Event Dashboard</Heading>

            {/* Modulo per aggiungere un nuovo utente */}
            <div style={{ marginTop: '1rem' }}>
                <Heading variant="heading-strong-s" marginBottom="m">Aggiungi Nuovo Utente</Heading>
                <input
                    placeholder="Nome"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    style={{ marginBottom: '0.5rem', padding: '0.5rem' }}
                />
                <input
                    placeholder="Cognome"
                    value={newUser.surname}
                    onChange={(e) => setNewUser({ ...newUser, surname: e.target.value })}
                    style={{ marginBottom: '0.5rem', padding: '0.5rem' }}
                />
                <input
                    placeholder="Telefono (opzionale)"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    style={{ marginBottom: '1rem', padding: '0.5rem' }}
                />
                <Button onClick={addNewUser} label="Aggiungi Utente" size="m" style={{ marginBottom: '3rem' }} />
            </div>

            <div>
                <input
                    placeholder="Cerca per nome o cognome..."
                    value={searchTerm}
                    style={{ padding: '0.5rem', width: '80vw' }}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <Button style={{ marginTop: '1rem', marginBottom: '1rem' }} onClick={generateCSV} label="Download CSV" size="m" />
            </div>

            {loading ? (
                <Text>Loading...</Text>
            ) : (
                events.map(event => {
                    const eventData = filteredData.filter(row => row.eventType === event);
                    const { entered, bounced } = countStatus(eventData);

                    return (
                        <Flex key={event} direction="column" marginBottom="xl">
                            <Heading variant="heading-strong-m" marginBottom="m" style={{marginBottom: "2rem", marginTop: "1rem"}}>
                                Event: {event} ({eventData.length} iscritti — ✅ {entered} entrati, ❌ {bounced} rimbalzati)
                            </Heading>
                            <div className={styles.tableWrapper}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Surname</th>
                                            <th>Entrato</th>
                                            <th>Rimbalzato</th>
                                            <th>Interessante</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {eventData.map(row => {
                                            const status = statuses[row.id] || {
                                                entered: false,
                                                bounced: false,
                                                interesting: false,
                                            };

                                            return (
                                                <tr key={row.id}>
                                                    <td>{row.name}</td>
                                                    <td>{row.surname}</td>
                                                    <td>
                                                        <div
                                                            className={`${styles.checkbox} ${status.entered ? styles.checked : ''}`}
                                                            onClick={() => handleCheckboxChange(row.id, 'entered')}
                                                        >
                                                            {status.entered ? '✔️' : '❌'} Entrato
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div
                                                            className={`${styles.checkbox} ${status.bounced ? styles.checked : ''}`}
                                                            onClick={() => handleCheckboxChange(row.id, 'bounced')}
                                                        >
                                                            {status.bounced ? '✔️' : '❌'} No
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div
                                                            className={`${styles.checkbox} ${status.interesting ? styles.checked : ''}`}
                                                            onClick={() => handleCheckboxChange(row.id, 'interesting')}
                                                        >
                                                            {status.interesting ? '✔️' : '❌'} Cool
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Flex>
                    );
                })
            )}
        </Flex>
    );
}

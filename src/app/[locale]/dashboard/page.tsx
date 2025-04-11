"use client";
import { useEffect, useState } from 'react';
import { Flex, Button, Heading, Text, Tag } from '@/once-ui/components';
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from 'firebase/firestore';
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

export default function Dashboard() {
    const [data, setData] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);

    const events = ['Downtown April 12th']; // <-- Puoi aggiungere altri nomi di eventi qui

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
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
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

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Flex className={styles.dashboard} direction="column" padding="l">
            <Heading variant="display-strong-l" marginBottom="l">Event Dashboard</Heading>
            <Button onClick={generateCSV} label="Download CSV" size="m" />

            {loading ? (
                <Text>Loading...</Text>
            ) : (
                events.map(event => {
                    const filteredData = data.filter(row => row.eventType === event);
                    return (
                        <Flex key={event} direction="column" marginBottom="xl">
                            <Heading variant="heading-strong-m" marginBottom="m">
                                Event: {event} ({filteredData.length} iscritti)
                            </Heading>
                            <div className={styles.tableWrapper}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Surname</th>
                                            <th>Phone</th>
                                            <th>Email</th>
                                            <th>Event Type</th>
                                            <th>Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map(row => (
                                            <tr key={row.id}>
                                                <td>{row.name}</td>
                                                <td>{row.surname}</td>
                                                <td>{row.phone}</td>
                                                <td>
                                                    <a
                                                        href={`mailto:${row.email}`}
                                                        className={styles.link}
                                                    >
                                                        {row.email}
                                                    </a>
                                                </td>
                                                <td>
                                                    <Tag>{row.eventType}</Tag>
                                                </td>
                                                <td>{new Date(row.createdAt).toLocaleString()}</td>
                                            </tr>
                                        ))}
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


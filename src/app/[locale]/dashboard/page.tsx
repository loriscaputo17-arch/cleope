"use client";
import { useEffect, useState } from 'react';
import { Flex, Button, Heading, Text, Tag } from '@/once-ui/components';
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from 'firebase/firestore';
import styles from './dashboard.module.scss';

// Define the type for rows in the data array
type Row = {
    id: string;
    email: string;
    instagram: string;
    type: string;
    datetime: string;
    event: string;
};

export default function Dashboard() {
    const [data, setData] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);

    const events = ['06 Feb 2025', '13 Feb 2025', '20 Feb 2025'];

    // Function to fetch data from Firebase
    const fetchData = async () => {
        try {
            const collectionRef = collection(db, 'VOLTaccessList');
            const queries = events.map(event => query(collectionRef, where('event', '==', event)));
            const snapshotPromises = queries.map(q => getDocs(q));
            const snapshots = await Promise.all(snapshotPromises);

            const rows: Row[] = snapshots.flatMap(snapshot =>
                snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Row))
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
            ['Email', 'Instagram', 'Event'], // Header row
            ...data.map(row => [row.email, row.instagram, row.event]), // Data rows
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
            <Button onClick={generateCSV} label="Download CSV" size="m"  />
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                events.map(event => {
                    const filteredData = data.filter(row => row.event === event); // Filter rows for this event
                    return (
                        <Flex key={event} direction="column" marginBottom="xl">
                            <Heading variant="heading-strong-m" marginBottom="m">
                                Event: {event} ({filteredData.length} iscritti)
                            </Heading>
                            <div className={styles.tableWrapper}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Email</th>
                                            <th>Instagram</th>
                                            <th>Type</th>
                                            <th>Date & Time</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map(row => (
                                            <tr key={row.id}>
                                                <td data-label="Email">
                                                    <a href={`mailto:${row.email}`} className={styles.link}>{row.email}</a>
                                                </td>
                                                <td data-label="Instagram">
                                                    <a
                                                        href={`https://instagram.com/${row.instagram}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={styles.link}>
                                                        @{row.instagram}
                                                    </a>
                                                </td>
                                                <td data-label="Type">
                                                    <Tag>{row.type}</Tag>
                                                </td>
                                                <td data-label="Date & Time">{new Date(row.datetime).toLocaleString()}</td>
                                                <td data-label="Actions">
                                                    <Button
                                                        onClick={() => console.log(`Sending email to ${row.email}`)}
                                                        label="Send Email"
                                                        size="s"
                                                    />
                                                </td>
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

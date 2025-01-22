"use client";
import { useEffect, useState } from 'react';
import { Flex, Button, Heading, Text } from '@/once-ui/components';
import { db } from "@/lib/firebase";
import { collection, getDocs } from 'firebase/firestore';
import styles from './dashboard.module.scss';

// Define the type for rows in the data arrays
type User = {
    id: string;
    email: string;
    instagram: string;
};

type UserCard = {
    id: string;
    cardNumber: string;
    userCode: string;
};

export default function Dashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [userCards, setUserCards] = useState<UserCard[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingUserCards, setLoadingUserCards] = useState(true);

    // Function to fetch users data
    const fetchUsers = async () => {
        try {
            const collectionRef = collection(db, 'users');
            const snapshot = await getDocs(collectionRef);
            const rows: User[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
            setUsers(rows);
        } catch (error) {
            console.error('Error fetching users data:', error);
        } finally {
            setLoadingUsers(false);
        }
    };

    // Function to fetch user cards data
    const fetchUserCards = async () => {
        try {
            const collectionRef = collection(db, 'users_cards2');
            const snapshot = await getDocs(collectionRef);
            const rows: UserCard[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserCard));
            setUserCards(rows);
        } catch (error) {
            console.error('Error fetching user cards data:', error);
        } finally {
            setLoadingUserCards(false);
        }
    };

    // Function to generate CSV for users
    const generateUsersCSV = () => {
        const csvRows = [
            ['Email', 'Instagram'], // Header row
            ...users.map(user => [user.email, user.instagram]),
        ];

        const csvContent = csvRows.map(e => e.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'users.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Function to generate CSV for user cards
    const generateUserCardsCSV = () => {
        const csvRows = [
            ['Email'], // Header row
            ...userCards.map(card => [card.userCode]),
        ];

        const csvContent = csvRows.map(e => e.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'user_cards.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        fetchUsers();
        fetchUserCards();
    }, []);

    return (
        <Flex className={styles.dashboard} direction="column" padding="l">
            <Heading variant="display-strong-l" marginBottom="l">Users and User Cards Dashboard</Heading>

            <Heading variant="heading-strong-m" marginBottom="m">Users Table {users.length}</Heading>
            <Button onClick={generateUsersCSV} label="Download Users CSV" size="m" />
            {loadingUsers ? (
                <Text>Loading users...</Text>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Instagram</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.email}</td>
                                <td>{user.instagram}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <Heading variant="heading-strong-m" marginTop="xl" marginBottom="m">User Cards Table {userCards.length}</Heading>
            <Button onClick={generateUserCardsCSV} label="Download User Cards CSV" size="m" />
            {loadingUserCards ? (
                <Text>Loading user cards...</Text>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Card Number</th>
                            <th>User ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userCards.map(card => (
                            <tr key={card.id}>
                                <td>{card.cardNumber}</td>
                                <td>{card.userCode}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Flex>
    );
}

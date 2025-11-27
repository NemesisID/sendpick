import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    // Initial mock data
    const initialUser = {
        fullName: 'Gultom',
        username: 'admin@patralogistik.com',
        phone: '081234567890',
        role: 'Admin',
        branch: 'PT Global Pilar Media',
        photo: 'https://ui-avatars.com/api/?name=Gultom&background=6366f1&color=fff',
    };

    // Try to load from localStorage to persist across reloads
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('sendpick_user');
        return savedUser ? JSON.parse(savedUser) : initialUser;
    });

    // Update localStorage whenever user changes
    useEffect(() => {
        localStorage.setItem('sendpick_user', JSON.stringify(user));
    }, [user]);

    const updateUser = (newData) => {
        setUser((prev) => ({
            ...prev,
            ...newData,
        }));
    };

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

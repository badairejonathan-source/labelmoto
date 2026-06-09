'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/app/header';

export default function HeroSearch() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        if (searchTerm.trim() !== '') {
            router.push(`/map?search=${encodeURIComponent(searchTerm)}`);
        } else {
            router.push('/map');
        }
    };

    return (
        <Header
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onSearch={handleSearch}
            placeholderText="Recherche par ville, marque ou nom de pro..."
        />
    );
}

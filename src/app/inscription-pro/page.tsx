'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/client';
import Image from 'next/image';

export default function InscriptionPro() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace('/pro/register');
    } else {
      router.replace('/login?callbackUrl=/pro/register');
    }
  }, [user, loading, router]);

  return (
    <div style={{minHeight:'100vh',background:'#F4F1ED',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif'}}>
      <img src="/images/logo-moto.webp" alt="Label Moto" style={{height:'60px',marginBottom:'24px'}} />
      <div style={{width:'40px',height:'40px',border:'3px solid #E87722',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
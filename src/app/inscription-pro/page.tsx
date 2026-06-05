import { redirect } from 'next/navigation';

export default function InscriptionPro() {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Créez votre fiche pro — Label Moto</title>
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{margin:0,fontFamily:'Barlow,sans-serif',background:'#F4F1ED',color:'#1C1A18',minHeight:'100vh'}}>
        <div style={{maxWidth:'560px',margin:'0 auto',padding:'0 24px'}}>
          <div style={{paddingTop:'28px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <img src="/images/logo-moto.webp" alt="Label Moto" style={{height:'56px',width:'auto'}} />
            <span style={{fontFamily:'Barlow Condensed,sans-serif',fontSize:'11px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'#E87722',border:'1px solid rgba(232,119,34,0.4)',padding:'4px 10px',borderRadius:'20px',background:'rgba(232,119,34,0.06)'}}>Annuaire national</span>
          </div>
          <div style={{padding:'52px 0 36px'}}>
            <div style={{fontFamily:'Barlow Condensed,sans-serif',fontSize:'12px',fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',color:'#E87722',marginBottom:'16px'}}>Professionnels moto</div>
            <h1 style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:900,fontSize:'clamp(48px,12vw,72px)',lineHeight:0.95,textTransform:'uppercase',color:'#1a1a1a',marginBottom:'24px'}}>
              Votre fiche<br/>
              <span style={{color:'#E87722'}}>pro</span>
              <span style={{display:'block',color:'#7A7268',fontSize:'clamp(32px,8vw,48px)'}}>en 3 minutes.</span>
            </h1>
            <p style={{fontSize:'16px',lineHeight:1.7,color:'#7A7268',maxWidth:'420px',marginBottom:'36px'}}>
              Rejoignez <strong style={{color:'#1C1A18'}}>l&apos;annuaire national des professionnels moto</strong>. Concession, atelier, garage, association, transporteur — soyez visible par toute la communauté moto française.
            </p>
          </div>
          <div style={{display:'flex',flexDirection:'column',marginBottom:'40px',background:'#fff',borderRadius:'14px',border:'0.5px solid rgba(0,0,0,0.08)',overflow:'hidden'}}>
            {[['01','Créez votre compte gratuit','30 secondes, juste un e-mail et un mot de passe. C\'est gratuit.'],['02','Remplissez votre fiche','Nom, adresse, spécialités, horaires, photos — tout en un seul endroit.'],['03','Publiez et soyez trouvé','Votre fiche est vérifiée sous 48h puis visible sur la carte nationale.']].map(([num,title,desc],i,arr)=>(
              <div key={num} style={{display:'flex',gap:'16px',alignItems:'flex-start',padding:'18px 20px',borderBottom:i<arr.length-1?'0.5px solid rgba(0,0,0,0.06)':'none'}}>
                <div style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:900,fontSize:'32px',color:'#E87722',lineHeight:1,minWidth:'36px'}}>{num}</div>
                <div>
                  <div style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:'18px',textTransform:'uppercase',color:'#1a1a1a',marginBottom:'4px'}}>{title}</div>
                  <div style={{fontSize:'14px',color:'#7A7268',lineHeight:1.5}}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{marginBottom:'40px'}}>
            <a href="https://labelmoto.fr/pro/register?utm_source=instagram&utm_medium=dm&utm_campaign=fiche_pro" style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%',background:'#E87722',color:'#fff',fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:'20px',textTransform:'uppercase',letterSpacing:'1.5px',textDecoration:'none',padding:'20px 32px',borderRadius:'8px',boxSizing:'border-box'}}>
              Créer ma fiche professionnelle
            </a>
            <div style={{textAlign:'center',fontSize:'13px',color:'#7A7268',marginTop:'12px'}}>Gratuit · Sans engagement · 3 minutes</div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',marginBottom:'48px'}}>
            {[['5 000+','Pros référencés'],['96','Départements couverts'],['48h','Validation fiche']].map(([num,label])=>(
              <div key={label} style={{background:'#fff',border:'0.5px solid rgba(0,0,0,0.08)',borderRadius:'10px',padding:'16px 14px',textAlign:'center'}}>
                <div style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:900,fontSize:'24px',color:'#E87722',lineHeight:1,marginBottom:'4px'}}>{num}</div>
                <div style={{fontSize:'11px',color:'#7A7268',textTransform:'uppercase',letterSpacing:'0.5px',fontWeight:500}}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{borderTop:'0.5px solid rgba(0,0,0,0.08)',padding:'24px 0 32px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:700,fontSize:'14px',textTransform:'uppercase',color:'#7A7268'}}>Label <span style={{color:'#E87722'}}>Moto</span> — L&apos;annuaire des pros</div>
            <a href="https://labelmoto.fr" style={{fontSize:'13px',color:'#7A7268',textDecoration:'none'}}>labelmoto.fr →</a>
          </div>
        </div>
      </body>
    </html>
  );
}
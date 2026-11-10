import { Link, useRouter, type ErrorComponentProps } from '@tanstack/react-router';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function PortalAccessError({error,reset}:ErrorComponentProps){
 const router=useRouter();
 return <main className="portal-theme flex min-h-screen items-center justify-center bg-background p-6 text-foreground"><div className="max-w-md text-center"><ShieldCheck className="mx-auto mb-5 h-10 w-10 text-primary"/><h1 className="text-2xl font-bold">Espace protégé</h1><p role="alert" className="my-5 text-sm text-muted-foreground">{error.message.includes('Accès non autorisé')?'Votre compte ne peut pas accéder à ce portail.':'Votre espace n’a pas pu être chargé.'}</p><div className="flex flex-wrap justify-center gap-3"><Button asChild><Link to="/portal">Ouvrir mon espace</Link></Button><Button variant="outline" onClick={()=>{reset();void router.invalidate();}}>Réessayer</Button><Button asChild variant="ghost"><Link to="/">Site FORMA</Link></Button></div></div></main>;
}
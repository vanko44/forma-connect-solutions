import { createFileRoute, redirect } from '@tanstack/react-router';
import { portalHead } from '@/lib/portal/model';
export const Route=createFileRoute('/auth')({head:()=>portalHead('Connexion sécurisée'),beforeLoad:()=>{throw redirect({to:'/connexion-client'});}});

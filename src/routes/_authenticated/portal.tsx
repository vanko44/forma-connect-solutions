import { createFileRoute, redirect } from '@tanstack/react-router';
import { getPortal } from '@/lib/portal/portal.functions';
import { destination, portalHead } from '@/lib/portal/model';
export const Route=createFileRoute('/_authenticated/portal')({head:()=>portalHead('Votre espace privé'),loader:async()=>{const d=await getPortal({data:{}});const env=destination(d.admin,d.roles);if(env==='admin')throw redirect({to:'/admin/dashboard'});if(env==='staff')throw redirect({to:'/staff/dashboard'});if(env==='provider')throw redirect({to:'/provider/dashboard'});throw redirect({to:'/client/dashboard'});},errorComponent:()=> <p className="p-8">Votre espace est momentanément indisponible. Rechargez la page.</p>,notFoundComponent:()=> <p>Espace introuvable.</p>});

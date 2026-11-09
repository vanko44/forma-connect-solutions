import { createFileRoute } from '@tanstack/react-router';
import { PortalDashboard, portalQuery } from '@/components/portal/portal-dashboard';
import { portalHead } from '@/lib/portal/model';
export const Route=createFileRoute('/_authenticated/client/dashboard')({
 head:()=>portalHead('Portail Client'),
 loader:({context})=>context.queryClient.ensureQueryData(portalQuery),
 errorComponent:()=> <div role="alert" className="p-8">Cet espace n’a pas pu être chargé. Rechargez la page pour réessayer.</div>,
 notFoundComponent:()=> <div>Dossier introuvable.</div>,
 component:()=> <PortalDashboard environment="client"/>,
});

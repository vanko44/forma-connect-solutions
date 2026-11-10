import { createFileRoute } from '@tanstack/react-router';
import { PortalDashboard, portalQuery } from '@/components/portal/portal-dashboard';
import { portalHead } from '@/lib/portal/model';
import { PortalAccessError } from '@/components/portal/portal-access-error';
export const Route=createFileRoute('/_authenticated/client/dashboard')({
 head:()=>portalHead('Portail Client'),
 loader:({context})=>context.queryClient.ensureQueryData(portalQuery('client')),
 errorComponent:PortalAccessError,
 notFoundComponent:()=> <div>Dossier introuvable.</div>,
 component:()=> <PortalDashboard environment="client"/>,
});

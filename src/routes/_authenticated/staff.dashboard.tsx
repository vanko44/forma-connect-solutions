import { createFileRoute } from '@tanstack/react-router';
import { PortalDashboard, portalQuery } from '@/components/portal/portal-dashboard';
import { PortalAccessError } from '@/components/portal/portal-access-error';
import { portalHead } from '@/lib/portal/model';
export const Route=createFileRoute('/_authenticated/staff/dashboard')({
 head:()=>portalHead('Espace collaborateurs'),
 loader:({context})=>context.queryClient.ensureQueryData(portalQuery('staff')),
 errorComponent:PortalAccessError,
 component:()=> <PortalDashboard environment="staff"/>,
});
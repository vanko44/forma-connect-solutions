import { z } from 'zod';
import type { Tables } from '@/integrations/supabase/types';
export type PortalRecord = Tables<'portal_records'>;
export type PortalProfile = Tables<'profiles'>;
export type Environment = 'client' | 'provider' | 'admin';
export const kinds = ['contract','service','mission','report','complaint','invoice','payment','notification'] as const;
export const labels: Record<string,string> = {contract:'Contrats',service:'Prestations',mission:'Missions',report:'Rapports',complaint:'Réclamations',invoice:'Factures',payment:'Règlements',notification:'Notifications'};
export const statuses: Record<string,string[]> = {contract:['brouillon','actif','terminé','résilié'],service:['planifiée','en cours','terminée'],mission:['brouillon','attribuée','acceptée','refusée','en cours','en attente de validation','terminée'],report:['soumis','en attente','validé','rejeté'],complaint:['nouvelle','en cours de traitement','en attente','clôturée'],invoice:['brouillon','émise','annulée'],payment:['en attente','validé','rejeté'],notification:['nouvelle','lue']};
export const recordSchema = z.object({id:z.string().uuid().optional(),kind:z.enum(kinds),title:z.string().trim().min(2).max(200),status:z.string(),owner_id:z.string().uuid().nullable(),provider_id:z.string().uuid().nullable(),parent_id:z.string().uuid().nullable(),start_date:z.string().nullable(),end_date:z.string().nullable(),due_date:z.string().nullable(),amount:z.number().nonnegative(),attributes:z.record(z.string(),z.string()).default({})}).superRefine((r,c)=>{if(!statuses[r.kind]?.includes(r.status)) c.addIssue({code:'custom',message:'Statut invalide'}); if(r.start_date&&r.end_date&&r.end_date<r.start_date)c.addIssue({code:'custom',message:'Dates incohérentes'});});
export function destination(admin:boolean, roles:string[]):Environment {return admin||roles.some(r=>['operations','finance','customer'].includes(r))?'admin':roles.includes('provider')?'provider':'client';}
export function canAccessSection(admin:boolean, roles:string[], section:string):boolean {
 if(admin)return true;
 if(['dashboard','profile','notification'].includes(section))return true;
 if(roles.includes('operations')&&['service','mission','report'].includes(section))return true;
 if(roles.includes('finance')&&['invoice','payment'].includes(section))return true;
 if(roles.includes('customer')&&['contract','complaint'].includes(section))return true;
 return false;
}
export function settlement(record:Pick<PortalRecord,'id'|'amount'>,payments:Pick<PortalRecord,'parent_id'|'kind'|'status'|'amount'>[]) {const paid=payments.filter(p=>p.kind==='payment'&&p.status==='validé'&&p.parent_id===record.id).reduce((s,p)=>s+Number(p.amount),0);return {paid,balance:Math.max(0,Number(record.amount)-paid)};}
export function missionActions(status:string) {return status==='attribuée'?['accept','refuse']:status==='acceptée'?['start']:status==='en cours'?['finish']:[];}
export const money=(n:number)=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'USD'}).format(n);
export const date=(v:string|null)=>v?new Date(v).toLocaleDateString('fr-CD'):'—';
export function attributes(r:PortalRecord):Record<string,string>{const a=r.attributes;if(!a||typeof a!=='object'||Array.isArray(a))return {};return Object.fromEntries(Object.entries(a).filter(([,v])=>typeof v==='string')) as Record<string,string>;}
export const portalHead=(title:string)=>({meta:[{title:`${title} — FORMA`},{name:'description',content:`${title}, espace de gestion sécurisé FORMA Event & Security.`},{property:'og:title',content:`${title} — FORMA`},{property:'og:description',content:'Portail professionnel sécurisé FORMA.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'},{name:'robots',content:'noindex, nofollow'}]});

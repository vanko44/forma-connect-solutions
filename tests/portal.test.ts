import { describe, it, expect } from 'vitest';
import { settlement,destination,missionActions,recordSchema } from '../src/lib/portal/model';
describe('portals',()=>{
 it('ignores unvalidated payments',()=>{expect(settlement({id:'i',amount:100},[{parent_id:'i',kind:'payment',status:'en attente',amount:100}])).toEqual({paid:0,balance:100});});
 it('deducts only validated payments for this invoice',()=>{expect(settlement({id:'i',amount:100},[{parent_id:'i',kind:'payment',status:'validé',amount:30},{parent_id:'other',kind:'payment',status:'validé',amount:40}])).toEqual({paid:30,balance:70});});
 it('routes client, provider and direction to distinct environments',()=>{expect(destination(false,['client'])).toBe('client');expect(destination(false,['provider'])).toBe('provider');expect(destination(true,['client'])).toBe('admin');});
 it('allows acceptance or refusal only for assigned missions',()=>{expect(missionActions('attribuée')).toEqual(['accept','refuse']);expect(missionActions('terminée')).toEqual([]);});
 it('uses the four requested complaint statuses',()=>{const r={kind:'complaint',title:'Incident',owner_id:null,provider_id:null,parent_id:null,start_date:null,end_date:null,due_date:null,amount:0};for(const status of ['nouvelle','en cours de traitement','en attente','clôturée'])expect(recordSchema.safeParse({...r,status}).success).toBe(true);expect(recordSchema.safeParse({...r,status:'payée'}).success).toBe(false);});
});

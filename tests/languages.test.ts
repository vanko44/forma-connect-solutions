import {it,expect} from 'vitest';
import {languages,defaultLanguage,validLanguage,translate} from '../src/lib/languages';
it('defaults to French and supports four languages',()=>{expect(defaultLanguage).toBe('fr');expect(Object.keys(languages)).toEqual(['fr','en','pt','sw']);});
it('rejects unsupported saved language values',()=>{expect(validLanguage('en')).toBe(true);expect(validLanguage('invalid')).toBe(false);});
it('preserves unrecognised user content',()=>{expect(translate('Client document 482','en')).toBe('Client document 482');});
it('keeps French sentences unchanged by default',()=>{expect(translate('Structurez votre besoin en quelques étapes.','fr')).toBe('Structurez votre besoin en quelques étapes.');});
it('preserves the number of records when translating a counter',()=>{expect(translate('Devis (27)','en')).toContain('(27)');expect(translate('Devis (27)','pt')).toContain('(27)');expect(translate('Devis (27)','sw')).toContain('(27)');});
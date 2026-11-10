import {it,expect} from 'vitest';
import {languages,defaultLanguage,validLanguage,translate} from '../src/lib/languages';
it('defaults to French and supports four languages',()=>{expect(defaultLanguage).toBe('fr');expect(Object.keys(languages)).toEqual(['fr','en','pt','sw']);});
it('rejects unsupported saved language values',()=>{expect(validLanguage('en')).toBe(true);expect(validLanguage('invalid')).toBe(false);});
it('preserves unrecognised user content',()=>{expect(translate('Client document 482','en')).toBe('Client document 482');});
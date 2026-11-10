import { createContext,useContext,useEffect,useState,type ReactNode } from 'react';
import { defaultLanguage,languages,translate,validLanguage,type Language } from '@/lib/languages';
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from '@/components/ui/select';
const LanguageContext=createContext({language:defaultLanguage,setLanguage:(_language:Language)=>{},t:(text:string)=>text});
export function LanguageProvider({children}:{children:ReactNode}){
 const [language,setLanguage]=useState<Language>(defaultLanguage);
 useEffect(()=>{const saved=localStorage.getItem('forma-language');if(validLanguage(saved))setLanguage(saved);},[]);
 useEffect(()=>{document.documentElement.lang=language;},[language]);
 const change=(next:Language)=>{setLanguage(next);localStorage.setItem('forma-language',next);};
 return <LanguageContext.Provider value={{language,setLanguage:change,t:text=>translate(text,language)}}>{children}</LanguageContext.Provider>;
}
export const useLanguage=()=>useContext(LanguageContext);
export function LanguageSelect(){const {language,setLanguage}=useLanguage();return <Select value={language} onValueChange={value=>{if(validLanguage(value))setLanguage(value);}}><SelectTrigger aria-label="Langue / Language" className="h-9 w-20 shrink-0 border-current/20 bg-transparent text-current"><SelectValue>{language.toUpperCase()}</SelectValue></SelectTrigger><SelectContent>{Object.entries(languages).map(([code,name])=><SelectItem key={code} value={code}>{name}</SelectItem>)}</SelectContent></Select>;}
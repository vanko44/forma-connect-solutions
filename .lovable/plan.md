# Main courante et suivi terrain

## Résultat attendu

- Replacer l’icône WhatsApp près du bas de l’écran, sans masquer la navigation ou les actions mobiles.
- Ajouter dans `/admin` un onglet « Main courante » réservé à la direction.
- Permettre d’enregistrer les prises de poste jour/nuit, les consignes propres à chaque site, les rondes et les incidents.
- Présenter un historique chronologique filtrable par site et par type, adapté au mobile.

## Mise en œuvre

- Créer des données terrain protégées par les mêmes droits administrateur que le reste de FORMA Admin.
- Relier chaque entrée à un site de sécurité existant et conserver date, heure, agent/superviseur, type, niveau, résumé et observations.
- Ajouter un formulaire de consignes par site, un formulaire rapide de prise de poste et un formulaire de rapport ronde/incident.
- Ajouter les états vides, validations, messages d’erreur et rafraîchissement des données.
- Ajouter des tests ciblés sur les catégories et règles de validation, puis vérifier le parcours connecté sur ordinateur et mobile.

## Détails techniques

- Migration additive avec droits explicites, sécurité par ligne et politique `has_role(..., 'admin')`.
- Nouveau composant dédié afin de ne pas alourdir davantage le tableau principal.
- Les animations et interactions resteront légères et respecteront les styles existants.
# Portails privés FORMA

## Analyse et modifications nécessaires
Le site public est déjà opérationnel et reste inchangé. L’espace client actuel affiche essentiellement les devis ; l’administration dispose des offres, ordres de mission et opérations de sécurité. Le recrutement partenaire ne constitue pas encore un portail connecté.

## Réalisation
- Séparer les présentations Client, Prestataire et Direction du menu public, avec barre latérale, profil, notifications et navigation mobile.
- Ajouter les profils complets, les contrats, prestations, factures, paiements validés, réclamations et rapports avec stockage réel.
- Donner aux prestataires des missions attribuées, acceptation/refus, début/fin, rapports et suivi financier.
- Permettre à la direction de gérer les dossiers, affectations, réponses, validations, comptes et permissions ; préserver les modules existants.
- Orienter la connexion selon les droits, conserver les anciennes adresses comme points d’entrée et protéger les fichiers.

## Détails techniques
- Fonctions authentifiées, permissions par domaine, RLS propriétaire/affectation, stockage privé et journal d’audit.
- Les trois comptes de direction confirmés restent les seuls titulaires du rôle administrateur existant. Les responsabilités opérations, finance et clientèle sont déléguées sans accorder ce rôle.
- Les factures sont soldées uniquement par la somme des règlements validés ; les informations terrain sensibles restent dans les modules direction existants.
- Vérifier les parcours connectés, l’isolation des dossiers, les paiements et l’affichage mobile.
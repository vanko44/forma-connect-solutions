# Roadmap

- [ ] Clarify direction/client/provider separation, reject incorrect portal access before loading data, and separate delegated staff from Direction.
- [ ] Add relevant reference features: shared document views, execution progress and invoice aging using persisted records only.
- [ ] Add French-default language selection with English, Portuguese and Swahili; verify translated surfaces and document preservation.
- [ ] Verify authorization rules, public/private loading and mobile layout after changes.

- [x] Create independent client, provider and staff dashboards without changing public design.
- [x] Persist profiles, contracts, services, complaints, invoices, payments, assignments and reports with tenant RLS, private documents and audit logs.
- [x] Connect role-based login, staff account management, provider actions and validated financial workflows.
- [x] Protect unpublished offer content at database level and correct provider report insertion authorization.
- [x] Verify authenticated direction contract creation, pending/validated payment balances, real PDF download and mobile layout; 8 portal rules and 20 existing business tests pass. Temporary financial records removed.
- [x] Connect public platform access buttons to the live private portals and replace future-platform metadata.
- [ ] Complete client/provider end-to-end isolation and protected attachment checks: requires identified non-direction client and provider accounts; no provider account exists.
- [ ] Complete separately delegated super-administrator versus direction roles: authority distribution not yet defined; existing direction allowlist preserved.

- [x] Renforcer la présentation institutionnelle, les six pôles et les engagements qualité sur l’accueil, À propos et Solutions, sans modification des espaces privés et formulaires.
- [x] Vérifier les pages modifiées en 390, 768 et 1280 px, en clair/sombre ; six liens de services parcourus, diagnostic rempli et transmission préformatée vérifiée, mouvement réduit et 3 tests validés.

- [x] Ajouter et vérifier les animations sobres au défilement, les interactions de formulaires et le respect du mouvement réduit : 15 pages, devis sans envoi, sélecteur partenaire, mots de passe, clair/sombre et mobile ; 9 tests réussis.

- [x] Remplacer la description du premier écran d’accueil.
- [x] Rendre le bouton WhatsApp flottant compact et discret.
- [x] Ajouter la connexion et la création gratuite de compte client.
- [x] Ajouter le tableau de bord client.
- [x] Séparer clairement les accès Client et Prestataire dans le site.
- [x] Vérifier les parcours sur ordinateur et mobile.
- [x] Repositionner l’espace prestataire en réseau de partenaires professionnels.
- [x] Protéger les activités stratégiques FORMA et exclure sécurité/gardiennage du formulaire.
- [x] Déployer le formulaire complet de qualification partenaire.
- [x] Présenter le processus, les statuts, les avantages, les exigences et le portail privé.
- [x] Vérifier le nouveau parcours partenaire sur ordinateur et mobile.
- [x] Reformuler positivement la séparation entre activités directes et expertises partenaires.
- [x] Créer le tableau de pilotage FORMA Admin avec indicateurs, filtres et actions.
- [x] Vérifier l’interface FORMA Admin sur ordinateur et mobile.- [x] Images en fichiers statiques /images (compatibles Vercel).
- [x] FORMA Admin déplacé sur /admin, protégé, données réelles.
- [x] Afficher le véhicule de patrouille versionné sur l’accueil et la page Sécurité.
- [x] Autoriser les comptes de direction confirmés sur FORMA Admin et afficher un accueil dédié.
- [ ] Passe de design premium (en attente).
- [x] Ajouter la Section 04, son édition manuelle et vérifier sa restitution dans l’offre client et le PDF.
- [x] Intégrer les photos de surveillance et de l’équipe cynophile sur l’accueil et Sécurité.
- [x] Remplacer le bouton PDF par des téléchargements PDF et PowerPoint fondés sur le document original et vérifier l’impression.
- [x] Remplacer l’icône de contact flottante par le logo WhatsApp fourni.
- [ ] Fiabiliser l’enregistrement des devis avant ouverture email ou WhatsApp : correction appliquée, confirmation d’un nouvel envoi à vérifier.
- [ ] Notifications automatiques email et WhatsApp : domaine d’envoi et compte WhatsApp Business à configurer.
- [x] Ordres de mission partenaires : gestion privée, règlements, PDF, impression et transmission préformatée ; création et solde vérifiés connecté, PDF relu, ordre test supprimé.
- [x] Repositionner l’icône WhatsApp plus bas sans chevaucher la navigation mobile.
- [x] Ajouter la main courante sécurité dans FORMA Admin : prises de poste jour/nuit, consignes par site, incidents et rondes.
- [x] Remplacer la photo du caméraman sur l’accueil par la nouvelle photo fournie.


---

## 1. Navigation et accès
- Accès via un serveur web intégré.
- Page d’accueil par base de données généalogique.
- Barre de navigation commune avec :
  - Recherche rapide.
  - Accès aux arbres (ascendance, descendance, cousins).
  - Index alphabétiques.
  - Pages des lieux.
  - Anniversaires.
  - Statistiques.
  - Notes et médias.
  - Section administration (selon rôle).
- Sélecteur de langue intégré.

---

## 2. Recherche et index
- Recherche simple par prénom, nom, alias ou numéro SOSA.
- Recherche avancée avec critères multiples (dates, lieux, événements, notes).
- Auto-complétion et recherche tolérante aux variations orthographiques.
- Index alphabétiques de noms et prénoms.
- Résultats présentés sous forme de tableaux triables et filtrables.

---

## 3. Fiches Personne et Famille
### Personne
- Informations d’identité (noms, prénoms, alias, sexe).
- Événements personnels (naissance, baptême, décès, inhumation…).
- Notes et sources associées.
- Médias liés (images, documents).
- Liens de navigation vers parents, conjoints, enfants et fratrie.

### Famille
- Informations sur le couple ou l’union.
- Liste des enfants avec liens vers leurs fiches.
- Événements familiaux (mariage, divorce, contrat…).
- Notes et sources au niveau du foyer.

---

## 4. Arbres et représentations graphiques
- **Ascendance** : arbre généalogique des ancêtres.
- **Descendance** : arbre des descendants.
- **Cousins** : représentation des cousins communs.
- **DAG** (Directed Acyclic Graph) : graphe relationnel cliquable.
- **Fan chart** : arbre circulaire en éventail.
- Contrôles : profondeur de générations, inversion père/mère, options d’affichage, zoom, export HTML/SVG.

---

## 5. Lieux et sources
- Pages hiérarchiques pour les lieux (pays, régions, villes).
- Filtres pour retrouver les personnes ou événements liés à un lieu.
- Gestion et affichage des sources et fichiers rattachés.

---

## 6. Notes et contenu éditorial
- Notes globales et notes liées aux individus ou familles.
- Syntaxe de type wikitext avec liens internes.
- Possibilité d’ajouter des images ou du contenu enrichi.
- Notes organisées en pages auxiliaires indexées.

---

## 7. Statistiques et anniversaires
- Listes des anniversaires du jour ou à venir (naissances, mariages, décès).
- Statistiques générales :
  - Répartition hommes/femmes.
  - Personnes les plus âgées.
  - Événements récents.
  - Indicateurs de taille de base et d’évolution.

---

## 8. Historique, différences et vérifications
- Historique des modifications.
- Comparaison entre deux versions (diff).
- Vérifications de cohérence (dates impossibles, doublons, incohérences).
- Outils de réparation ou correction automatique.

---

## 9. Fusion et gestion des doublons
- Interfaces de fusion pour les individus et les familles.
- Présentation des données en colonnes comparatives.
- Sélection champ par champ via boutons radio.
- Boutons de validation, d’annulation et de prévisualisation.

---

## 10. Import, export et sauvegarde
- Import de fichiers GEDCOM vers une base interne.
- Export d’une base vers GEDCOM (standard 5.5.1).
- Export d’une base au format texte `.gw`.
- Outils de sauvegarde et de restauration des données.

---

## 11. Gestion des rôles et sécurité
- Rôle **visiteur** : accès de base en lecture.
- Rôle **friend** : accès étendu à certaines données.
- Rôle **wizard** : accès complet, édition des données et gestion.
- Authentification par fichier d’utilisateurs et mots de passe.
- Filtrage des balises HTML autorisées dans les notes.
- Gestion des autorisations HTTP.

---

## 12. Administration et configuration
- Portail d’installation et de configuration (setup).
- Gestion des bases disponibles, création, suppression.
- Configuration du serveur (port, adresses, chemins).
- Activation et gestion des plugins.
- Exécution possible en mode CGI ou service Windows.
- Multiplateforme (Unix/Linux, Windows, macOS).

---

## 13. Utilitaires et outils en ligne de commande
- **gwd** : serveur web.
- **gwsetup** : interface de configuration.
- **gwc** : création de base depuis un export.
- **ged2gwb** : import GEDCOM.
- **gwb2ged** : export GEDCOM.
- **gwu** : export au format `.gw`.
- **gwdiff** : comparaison de bases.
- **fixbase** : vérification et correction de cohérences.
- **update_nldb** : mise à jour de l’index des notes.
- **consang** / **connex** : calculs de consanguinité et connexité.

---
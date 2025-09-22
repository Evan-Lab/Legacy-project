# AWKWARD LEGACY - Unit Test Plan

## 1. Wiki Module (wiki_test.ml)

**Type:** Unit Test
**Objective:** Vérifier le parsing des liens wiki et la conversion de la syntaxe gras/italique.

| Test Function          | Input Example                          | Expected Output                                      | Description                          |
|------------------------|----------------------------------------|------------------------------------------------------|--------------------------------------|
| misc-notes-link        | "[[ccc/ddd]]" ou "[[ccc/ddd/Texte]]"   | Liste de tokens (WLperson, WLpage, WLwizard, WLnone) | Parser les chaînes wiki en structures de tokens |
| bold_italic_syntax     | "abc ''def'' ghi" ou "abc '''def''' ghi" | "abc <i>def</i> ghi", "abc <b>def</b> ghi"          | Convertir la syntaxe wiki en HTML   |

---

## 2. Util Module (util_test.ml)

### a) String Utilities (Mutil)

| Test Function               | Input                          | Expected Output | Description                          |
|-----------------------------|--------------------------------|-----------------|--------------------------------------|
| contains                    | "foo bar", "foo"               | true            | Vérifier la présence d'une sous-chaîne |
| start_with                  | "foo", index=0, "foo"          | true            | Vérifier si la chaîne commence par un préfixe |
| compare_after_particle      | "de la fontaine", "de musset"  | -1              | Comparer des chaînes en ignorant les particules |

| Test Function               | Input       | Expected Output | Description                          |
|-----------------------------|-------------|-----------------|--------------------------------------|
| arabian_of_roman / roman_of_arabian | "XXXIX", 39 | 39 / "XXXIX"    | Conversion entre chiffres romains et arabes |
| string_of_int_sep           | 1000, sep="," | "1,000"         | Formater un entier avec des séparateurs |

### b) UTF-8 Utilities

| Test Function               | Input         | Expected Output | Description                          |
|-----------------------------|---------------|-----------------|--------------------------------------|
| Utf8.sub                    | "日本語", i=0, j=1 | "日"            | Extraire une sous-chaîne UTF-8       |
| Utf8.capitalize_fst         | "abcdef"      | "Abcdef"        | Mettre en majuscule le premier caractère UTF-8 |

### c) HTML / Translation Utilities

| Test Function               | Input                          | Expected Output                                      | Description                          |
|-----------------------------|--------------------------------|------------------------------------------------------|--------------------------------------|
| safe_html                   | `<a href="localhost:2318/foo">foo</a>` | `<a href="localhost:2318/foo_w?...">foo</a>` | Échapper le HTML pour un rendu sécurisé |
| transl_a_of_b               | "naissance", "Jean"            | "naissance de <b>Jean</b>"                          | Traduire une chaîne avec des macros |
| start_with_vowel            | "abc"                          | true                                                | Détecter si une chaîne commence par une voyelle |

---

## 3. Place Module (place_test.ml)

**Type:** Unit Test
**Objective:** Gérer et comparer les noms de lieux formatés.

| Test Function               | Input                          | Expected Output                     | Description                          |
|-----------------------------|--------------------------------|-------------------------------------|--------------------------------------|
| normalize                    | "[foo-bar] - boobar (baz)"     | "foo-bar, boobar (baz)"             | Normaliser le format des noms de lieux |
| split_suburb                 | "[foo-bar] - boobar (baz)"     | ("foo-bar", "boobar (baz)")         | Séparer la banlieue du lieu principal |
| only_suburb                  | "[foo-bar] - boobar (baz)"     | "foo-bar"                           | Extraire uniquement la banlieue      |
| without_suburb               | "[foo-bar] - boobar (baz)"     | "boobar (baz)"                      | Extraire le lieu sans la banlieue     |
| compare_places               | "baz (boobar)", "[foo-bar] - baz (boobar)" | -1 | Comparer deux noms de lieux |

---

## 4. Calendar Module (calendar_test.ml)

**Type:** Unit Test
**Objective:** Vérifier les conversions de calendrier et la gestion des dates incomplètes.

| Test Name                    | Input                          | Expected Output                     | Description                          |
|------------------------------|--------------------------------|-------------------------------------|--------------------------------------|
| calendar-sdn                 | dates avec day=0 ou month=0    | Fail                                | Vérifier que la bibliothèque échoue sur les dates incomplètes |
| calendar-greg                | dates complètes & OrYear       | Conversion correcte entre calendriers | Valider les conversions grégorien, julien, français, hébreu |

---

## 5. SOSA Module (sosa_test.ml)

**Type:** Unit Test
**Objective:** Tester la numérotation généalogique Sosa.

| Test Function               | Input                          | Expected Output                     | Description                          |
|-----------------------------|--------------------------------|-------------------------------------|--------------------------------------|
| sosa_eq                     | Sosa.zero, Sosa.one            | true / false                        | Vérifier l'égalité et l'inégalité   |
| sosa_int                     | 0,1                            | Sosa.zero, Sosa.one                 | Conversion entre entier et Sosa     |
| sosa_string                  | "0", "1"                       | Sosa.zero, Sosa.one                 | Conversion entre chaîne et Sosa     |
| sosa_pp                      | 1000                           | "1,000"                             | Affichage formaté de Sosa            |
| sosa_gen                     | Sosa 1..15                     | Numéros de génération               | Valider le calcul de génération     |
| sosa_branches                | Sosa.of_int 38                 | [0; 0; 1; 1; 0]                     | Vérifier les branches d'ancêtres     |

---

## 6. Merge Module (merge_test.ml)

**Type:** Unit Test
**Objective:** Vérifier les relations ancêtre-descendant.

| Test Function               | Input                          | Expected Output                     | Description                          |
|-----------------------------|--------------------------------|-------------------------------------|--------------------------------------|
| is_ancestor                 | Famille avec enfant, père, mère | true / false                        | Vérifier si une personne est un ancêtre d'une autre |

# 🚀 Guide de Déploiement - Backend Legacy Project

Ce guide explique comment lancer, tester et déployer le backend Python FastAPI du projet Legacy.

---

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Installation locale](#installation-locale)
3. [Lancer l'application](#lancer-lapplication)
4. [Tests](#tests)
5. [Créer une release GitHub](#créer-une-release-github)
6. [Déploiement en production](#déploiement-en-production)
7. [Variables d'environnement](#variables-denvironnement)

---

## 🔧 Prérequis

- **Python 3.12+** installé
- **Poetry** (gestionnaire de dépendances Python)
- **Git** configuré

### Installer Poetry

```bash
# Sur Linux/macOS/WSL
curl -sSL https://install.python-poetry.org | python3 -

# Ou avec pip
pip install poetry
```

---

## 💻 Installation locale

### 1. Cloner le repository

```bash
git clone <votre-repo-url>
cd legacy-mirror
```

### 2. Installer les dépendances

```bash
# Installer toutes les dépendances (production + dev)
poetry install

# Ou seulement les dépendances de production
poetry install --without dev
```

### 3. Configurer les variables d'environnement (optionnel)

```bash
# Copier le template
cp .env.example .env

# Éditer le fichier .env avec vos valeurs
nano .env
```

---

## 🚀 Lancer l'application

### Méthode 1 : Via Poetry (recommandé)

```bash
# Lancer le serveur FastAPI
poetry run python main.py
```

### Méthode 2 : Via Uvicorn directement

```bash
# Activer l'environnement virtuel Poetry
poetry shell

# Lancer avec Uvicorn
uvicorn src.app:app --host 0.0.0.0 --port 8000 --reload
```

### Méthode 3 : En mode développement avec rechargement automatique

```bash
poetry run uvicorn src.app:app --reload
```

L'application sera accessible sur : **http://localhost:8000**

### Documentation API automatique

- **Swagger UI** : http://localhost:8000/docs
- **ReDoc** : http://localhost:8000/redoc

---

## 🧪 Tests

### Lancer tous les tests

```bash
poetry run pytest
```

### Lancer les tests avec coverage

```bash
poetry run pytest --cov=src --cov-report=term-missing
```

### Lancer le linter

```bash
poetry run ruff check src/
```

### Corriger automatiquement les erreurs de linting

```bash
poetry run ruff check src/ --fix
```

---

## 📦 Créer une release GitHub

Le projet utilise GitHub Actions pour automatiser les releases. Voici comment créer une nouvelle version :

### 1. S'assurer que tous les changements sont committés sur `main`

```bash
# Vérifier le statut
git status

# Committer les changements restants
git add .
git commit -m "feat: prépare la version 1.0.0"
git push origin main
```

### 2. Créer un tag avec versioning sémantique

```bash
# Format : vMAJOR.MINOR.PATCH
# Exemple : v1.0.0, v1.2.3, v2.0.0

# Créer le tag localement
git tag v1.0.0

# Ou créer un tag avec un message
git tag -a v1.0.0 -m "Release version 1.0.0 - Première version stable"

# Pousser le tag vers GitHub
git push origin v1.0.0
```

### 3. GitHub Actions va automatiquement :

✅ Installer les dépendances
✅ Exécuter tous les tests
✅ Builder le package Python (`.whl` et `.tar.gz`)
✅ Générer un changelog automatique
✅ Créer une GitHub Release
✅ Uploader les artifacts

### 4. Vérifier la release

Rendez-vous sur : `https://github.com/<votre-org>/<votre-repo>/releases`

Vous devriez voir votre nouvelle release avec :
- Le numéro de version
- Le changelog automatique
- Les fichiers distribués (.whl et .tar.gz)

### Versioning sémantique

Suivez ces conventions :

- **MAJOR** (`v2.0.0`) : Changements incompatibles avec l'API
- **MINOR** (`v1.1.0`) : Nouvelles fonctionnalités rétrocompatibles
- **PATCH** (`v1.0.1`) : Corrections de bugs rétrocompatibles

Exemples :
```bash
# Première release
git tag v1.0.0

# Nouvelle fonctionnalité
git tag v1.1.0

# Correction de bug
git tag v1.0.1

# Changement majeur (breaking change)
git tag v2.0.0
```

---

## 🌐 Déploiement en production

### Option 1 : VPS avec systemd (Ubuntu/Debian)

#### 1. Installer les prérequis sur le serveur

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Python 3.12
sudo apt install python3.12 python3.12-venv -y

# Installer Poetry
curl -sSL https://install.python-poetry.org | python3 -
```

#### 2. Cloner le projet

```bash
cd /opt
sudo git clone <votre-repo-url> legacy-mirror
cd legacy-mirror
sudo chown -R $USER:$USER /opt/legacy-mirror
```

#### 3. Installer les dépendances

```bash
poetry install --without dev
```

#### 4. Configurer les variables d'environnement

```bash
# Créer le fichier .env
nano .env
```

Exemple de configuration production :
```env
app_name=LegacyProject
debug=false
database__url=postgresql://user:password@localhost:5432/legacy_db
imports__tmp_dir=/var/tmp/legacy
```

#### 5. Créer un service systemd

```bash
sudo nano /etc/systemd/system/legacy-backend.service
```

Contenu du fichier :
```ini
[Unit]
Description=Legacy Backend FastAPI
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/opt/legacy-mirror
Environment="PATH=/opt/legacy-mirror/.venv/bin"
ExecStart=/opt/legacy-mirror/.venv/bin/python main.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

#### 6. Démarrer le service

```bash
# Recharger systemd
sudo systemctl daemon-reload

# Démarrer le service
sudo systemctl start legacy-backend

# Activer le démarrage automatique
sudo systemctl enable legacy-backend

# Vérifier le statut
sudo systemctl status legacy-backend
```

#### 7. Configurer Nginx comme reverse proxy (optionnel)

```bash
sudo nano /etc/nginx/sites-available/legacy-backend
```

Contenu :
```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/legacy-backend /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

### Option 2 : Services cloud (Render, Railway, etc.)

#### Render.com

1. Créer un nouveau "Web Service"
2. Connecter votre repository GitHub
3. Configurer :
   - **Build Command** : `pip install poetry && poetry install --without dev`
   - **Start Command** : `poetry run python main.py`
   - **Environment** : Ajouter vos variables d'environnement

#### Railway.app

1. Créer un nouveau projet depuis GitHub
2. Railway détecte automatiquement Python
3. Ajouter les variables d'environnement dans Settings
4. Déployer automatiquement à chaque push

---

## 🔐 Variables d'environnement

Voici toutes les variables configurables dans le fichier `.env` :

| Variable | Description | Exemple | Requis |
|----------|-------------|---------|--------|
| `app_name` | Nom de l'application | `LegacyProject` | Non |
| `debug` | Mode debug (true/false) | `false` | Non |
| `database__url` | URL de connexion à la BDD | `sqlite:///database.db` | Oui |
| `imports__tmp_dir` | Répertoire temporaire pour imports | `/tmp` | Non |

### Exemples de configuration

#### Développement (SQLite)
```env
app_name=LegacyProject
debug=true
database__url=sqlite:///database.db
imports__tmp_dir=/tmp
```

#### Production (PostgreSQL)
```env
app_name=LegacyProject
debug=false
database__url=postgresql://user:password@db.example.com:5432/legacy_prod
imports__tmp_dir=/var/tmp/legacy
```

---

## 📊 CI/CD avec GitHub Actions

Le projet utilise deux workflows GitHub Actions :

### 1. Tests automatiques (`.github/workflows/tests.yml`)

**Déclenchement** :
- Sur chaque `push` vers `main`, `develop`, ou branches `tests/**`
- Sur chaque `pull request` vers `main` ou `develop`

**Actions** :
- Installation de Python 3.12 et Poetry
- Installation des dépendances
- Linting avec Ruff
- Exécution des tests avec coverage
- Upload du rapport de coverage

### 2. Releases automatiques (`.github/workflows/release.yml`)

**Déclenchement** :
- Sur création de tags `v*.*.*` (ex: `v1.0.0`)

**Actions** :
- Exécution des tests
- Build du package Python
- Génération du changelog automatique
- Création de la GitHub Release
- Upload des artifacts (.whl, .tar.gz)

---

## 🛠️ Commandes utiles

```bash
# Lancer l'application
poetry run python main.py

# Lancer les tests
poetry run pytest

# Lancer les tests avec coverage
poetry run pytest --cov=src

# Linter le code
poetry run ruff check src/

# Formatter le code
poetry run ruff format src/

# Mettre à jour les dépendances
poetry update

# Ajouter une nouvelle dépendance
poetry add <package-name>

# Ajouter une dépendance de dev
poetry add --group dev <package-name>

# Générer un requirements.txt (si besoin)
poetry export -f requirements.txt --output requirements.txt --without-hashes
```

---

## 🐛 Debugging

### Problème : L'application ne démarre pas

```bash
# Vérifier que Poetry est bien installé
poetry --version

# Réinstaller les dépendances
poetry install --no-cache

# Vérifier les logs
poetry run python main.py
```

### Problème : Tests échouent

```bash
# Installer les dépendances de dev
poetry install --with dev

# Vérifier la version de Python
python --version  # Doit être >= 3.12

# Lancer les tests en mode verbose
poetry run pytest -v
```

### Problème : La release GitHub échoue

1. Vérifier que le tag respecte le format `v*.*.*`
2. S'assurer que les tests passent localement
3. Vérifier les permissions GitHub Actions dans Settings > Actions > General
4. Consulter les logs dans l'onglet "Actions" de GitHub

---

## 📚 Ressources

- [Documentation FastAPI](https://fastapi.tiangolo.com/)
- [Documentation Poetry](https://python-poetry.org/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)

---

## 💡 Support

Pour toute question ou problème :

1. Consulter les issues GitHub existantes
2. Créer une nouvelle issue avec les détails
3. Contacter l'équipe de développement

---

**Date de dernière mise à jour** : 2025-01-XX
**Version du guide** : 1.0.0

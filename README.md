Application de Gestion des SAé (Full-Stack)

Bienvenue sur le dépôt de mon application de gestion de SAé (Situations d'Apprentissage et d'Évaluation). 
Ce projet est une application mobile "Full-Stack" permettant de répertorier, filtrer et gérer des projets universitaires avec une interface moderne et fluide.

Fonctionnalités Principales
* Interface Premium (Style iOS)** : Barre de navigation flottante, animations en cascade, cartes avec ombres portées.
* Filtrage Avancé** : Moteur de recherche multicritères cumulatifs (par Promotion, Semestre et Domaine).
* Gestion Complète (CRUD)** : Ajout de nouvelles SAé avec gestion des dates, illustrations, descriptions longues et notes.
* Synchronisation en Temps Réel** : Communication fluide entre l'application React Native et l'API Spring Boot.

Stack Technique
* Frontend** : React Native, Expo, TypeScript
* Backend** : Java, Spring Boot, Spring Data JPA
* Base de données** : MySQL / PostgreSQL / H2 *( Remplace par celle que tu utilises)*

---

Prérequis d'installation

Pour pouvoir évaluer et faire tourner ce projet sur votre machine, vous devez avoir installé :
1. Java JDK** (version 17 ou supérieure recommandée).
2. Node.js** et **npm** (pour faire tourner le frontend).
3. L'application "Expo Go"** sur votre smartphone (iOS ou Android), ou un émulateur correctement configuré sur votre ordinateur.
4. (Optionnel si base locale)* Votre serveur de base de données allumé (WAMP, MAMP, Docker...).

---

Comment lancer le projet (Instructions)

Le projet est divisé en deux parties distinctes : le Backend (`sae-backend`) et le Frontend (`sae-mobile`). **Il est impératif de lancer le Backend en premier.**

### Étape 1 : Récupérer le projet
Clonez ce dépôt sur votre machine locale :

git clone [https://github.com/VOTRE_PSEUDO/VOTRE_DEPOT.git](https://github.com/VOTRE_PSEUDO/VOTRE_DEPOT.git)
cd NOM_DU_DOSSIER

Étape 2 : Lancer le Serveur Backend (Spring Boot)
Ouvrez le dossier sae-backend dans votre IDE préféré (IntelliJ IDEA, Eclipse, VS Code).

Vérifiez la configuration de la base de données dans le fichier src/main/resources/application.properties.

Laissez Maven télécharger les dépendances.

Lancez l'application via la classe principale ou exécutez la commande suivante dans le terminal (à la racine de sae-backend) :

Bash
./mvnw spring-boot:run
Le serveur devrait démarrer et écouter sur le port 8080.

Étape 3 : Configuration du Réseau ( Étape Cruciale)
Pour que l'application mobile puisse communiquer avec l'API Spring Boot en réseau local, vous devez lui indiquer votre adresse IP :

Trouvez l'adresse IP locale de votre ordinateur (ex: 192.168.1.X).

Ouvrez les fichiers suivants situés dans sae-mobile/app/(tabs)/ :

index.tsx

explore.tsx

gallery.tsx

Remplacez l'adresse IP de la constante API_URL par la vôtre :

JavaScript
const API_URL = 'http://VOTRE_ADRESSE_IP_LOCALE:8080/api/saes';
Étape 4 : Lancer l'Application Mobile (Expo)
Ouvrez un nouveau terminal et naviguez dans le dossier du frontend :

Bash
cd sae-mobile
Installez les dépendances du projet :

Bash
npm install
Lancez le serveur de développement Expo :

Bash
npx expo start
Un QR Code va s'afficher dans votre terminal. Scannez-le avec l'application Expo Go sur votre smartphone (ou appuyez sur a dans le terminal pour lancer sur un émulateur Android, ou i pour iOS).

### ⚠️ Dépendances spécifiques (Si erreur au lancement)
Normalement, la commande `npm install` suffit. Cependant, si Expo signale des modules manquants liés à nos composants natifs (Calendrier et Caméra), exécutez cette commande dans le dossier `sae-mobile` :

```bash
npx expo install expo-image-picker @react-native-community/datetimepicker

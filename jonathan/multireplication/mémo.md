# multiréplication

## 1.1 définition
- **failover** : processus automatique ou manuel de basculement d'un système défaillant vers un autre système de secours pour garantir la disponibilité continue des services ou des données.
Le Failover est une opération de sauvegarde dans laquelle les fonctions d'un système (processeur, serveur, réseau ou base de données, par exemple) sont assurées par les composants d'un système secondaire, lorsque le premier devient indisponible, soit à la suite d'une panne, soit en raison d'une interruption planifiée. Dans le contexte des bases de données, cela signifie que si le primary tombe en panne, un replica est promu au rôle de primary pour continuer à gérer les opérations de la base de données.
    - avantages :
        - haute disponibilité : Le principal avantage est de minimiser les interruptions de service en cas de panne, ce qui est crucial pour les systèmes critiques.
        - tolérance aux pannes : Le failover assure que le système peut continuer à fonctionner même en cas de panne d'un composant majeur.
        - reduction du temps d'interruption : Un failover rapide peut réduire considérablement le temps d'interruption du service, améliorant ainsi l'expérience utilisateur et la fiabilité du système.
    - inconvénients :
        - consistance des données : Garantir que les données sur la réplique sont à jour et cohérentes au moment du failover est un défi, surtout si la réplication est asynchrone.
        - split-brain : Dans certaines configurations, il y a un risque que deux nœuds se considèrent comme les principaux en même temps (un phénomène appelé "split-brain"), ce qui peut entraîner des conflits de données.
        - complexité de la configuration : Mettre en place un système de failover robuste peut être complexe et nécessite une bonne planification, ainsi que des tests réguliers pour garantir qu'il fonctionne comme prévu.

    L’opération de retour vers le système de départ après sa restauration s’appelle le Failback.
- **primary/replica** : modèle de replication de bases de données où un serveur principal (primary) est responsable de toutes les écritures, tandis que les replicas reçoivent une copie en lecture seule des données du serveur principal. Les modifications effectuées sur le primary sont répliquées sur les replicas via des mechanismes qui peuvent être synchrones, semi-synchrones ou asynchrones.
    - avantages :
        - scalabilité en lecture : Les répliques peuvent être utilisées pour répartir la charge des requêtes de lecture, ce qui permet de réduire la charge sur le serveur principal et d'améliorer les performances globales du système.
        - tolérance aux pannes : Si le serveur principal échoue, une réplique peut être promue en tant que nouveau serveur principal, assurant ainsi une continuité du service (ce processus est souvent appelé failover).
        - séparation des charges : La séparation des charges d'écriture et de lecture améliore la performance et permet de mieux utiliser les ressources du serveur principal.
    - inconvénients :
        - consistance des données : En mode de réplication asynchrone, il peut y avoir un délai (latence de réplication) avant que les données soient disponibles sur les répliques. Cela peut poser problème si les données doivent être immédiatement cohérentes sur toutes les répliques.
        - complexité de la promotion des replicas : En cas de panne du serveur principal, la promotion d'un replica en tant que nouveau primary peut être complexe, surtout dans un environnement où plusieurs replicas sont en place.
        - maintenance : La configuration et la gestion des replicas nécessitent une attention particulière, notamment pour s'assurer qu'elles sont à jour et en bon état de fonctionnement.
- **primary/primary** : modèle de réplication où deux ou plusieurs serveurs de bases de données fonctionnent en tant que nœuds primaires. Dans ce modèle, chaque nœud peut à la fois lire et écrire des données. Les modifications effectuées sur un nœud sont répliquées automatiquement aux autres nœuds en temps quasi-réel.
Tous les nœuds impliqués peuvent traiter des transactions de lecture et d'écriture simultanément. Par exemple, dans un système avec deux serveurs, si une transaction est effectuée sur le serveur A, celle-ci est répliquée et appliquée au serveur B. Chaque nœud maintient une copie complète des données, et des mécanismes de synchronisation sont utilisés pour garantir que toutes les copies restent cohérentes.
    - avantages :
        - haute disponibilté : Si un serveur tombe en panne, les autres peuvent continuer à fonctionner normalement, ce qui améliore la tolérance aux pannes.
        - équilibrage de la charge : Les charges de travail peuvent être réparties entre les différents nœuds, réduisant ainsi la charge sur un seul serveur.
        - redondance : Les données sont disponibles sur plusieurs serveurs, ce qui offre une redondance en cas de défaillance matérielle ou logicielle.
    - inconvénients :
        - conflits de données : Si deux nœuds modifient la même donnée simultanément, des conflits peuvent survenir. Des stratégies comme le verrouillage optimiste, les horodatages, ou des algorithmes spécifiques (comme celui de Lamport) sont souvent utilisés pour résoudre ces conflits.
        - latence et consistance : La réplication synchrone peut introduire de la latence, surtout dans un environnement géographiquement distribué. Dans certains cas, la consistance immédiate des données peut ne pas être garantie, ce qui peut être problématique pour certaines applications.
        - complexité de gestion : Ce type de réplication nécessite une configuration et une gestion plus complexes par rapport à une réplication master/slave (primary/secondary). La surveillance, la détection des conflits, et la maintenance peuvent être plus difficiles.
- **synchrone/asynchrone** :
    - replication synchrone : chaque transaction ou modification de données effectuée sur le primary doit être confirmée comme ayant été répliquée sur tous les replicas avant d'être validée (committed). Cela signifie que le primary attend que les replicas accusent réception de la transaction avant de procéder.
        - avantages :
            - consistance des données : La réplication synchrone garantit que toutes les replicas sont parfaitement synchronisés avec le primary. Cela signifie qu'à tout moment, toutes les replicas ont exactement les mêmes données.
            - tolérance aux pannes : En cas de panne du primary, un replica peut immédiatement prendre le relais sans risque de divergence des données, car elle dispose déjà des dernières transactions validées.
        - inconvénients :
            - latence : Le principal inconvénient de la réplication synchrone est qu'elle introduit de la latence. Le primary doit attendre que chaque replica confirme la réception de la transaction avant de continuer, ce qui peut ralentir le système, en particulier si les replicas sont géographiquement dispersés.
            - performance : En raison de cette latence, la performance globale du système peut être impactée, surtout dans des environnements à forte charge.
    - replication asynchrone : Le primary n'attend pas que les replicas accusent réception de la transaction avant de valider celle-ci. La transaction est validée immédiatement sur le primary, et la réplication des données vers les replicas se fait ensuite de manière différée.
        - avantages :
            - performance et latence : La réplication asynchrone est plus rapide que la réplication synchrone car le primary n'a pas besoin d'attendre que les replicas confirment la réception de chaque transaction. Cela réduit la latence et améliore la performance du système, en particulier dans les environnements à forte charge ou lorsque les replicas sont éloignées.
            - sclabilité : Il est plus facile de mettre en œuvre une réplication asynchrone dans des environnements à grande échelle, notamment lorsque les replicas sont situées dans différentes régions géographiques.
        - inconvénients :
            - risque de perte de données : En cas de panne du primary avant que les données ne soient complètement répliquées, les replicas peuvent ne pas avoir les dernières transactions, ce qui peut entraîner une divergence des données ou une perte partielle.
            - consistance éventuelle : Les répliques peuvent ne pas être à jour avec les dernières modifications effectuées sur le serveur principal, ce qui signifie qu'il y a un décalage temporel entre l'état des données sur le principal et les répliques.
- **journaux/système de fichier** :
    - replication par journaux (log-based replication) : utilise le journal des transactions (transaction log) de la base de données. chaque fois qu'une transaction est exécuté sur le primary, elle est enregistrée dans le journal (log), qui est ensuite répliquésur les replicas. Celles-ci appliquent les changements enregistrés pour maintenir leur copie de la base de données à jour.
        - avantages :
            - consistance fine : Comme la réplication se fait au niveau des transactions, cette méthode permet de répliquer les données de manière très précise et granulaire, assurant que toutes les transactions sont prises en compte dans l'ordre où elles ont été effectuées.
            - faible impact sur la performance : Le journal des transactions est une partie native du fonctionnement des bases de données, donc la réplication par journaux peut être très efficace avec un impact minimal sur les performances de la base de données.
            - prise en charge des transactions complexes : Cette méthode est idéale pour les bases de données transactionnelles, car elle assure que les transactions complexes sont répliquées de manière cohérente.
        - inconvénients :
            - configuration complexe : La mise en place et la gestion de la réplication par journaux peuvent être complexes, en particulier dans des environnements où les transactions doivent être répliquées de manière synchrone.
            - risque de perte de données en mode assynchrone : Si la réplication est asynchrone, il peut y avoir un léger décalage entre le moment où une transaction est enregistrée sur le serveur principal et le moment où elle est répliquée sur les répliques, ce qui peut entraîner une perte de données en cas de panne.
    - replication par système de fichiers (file-based replication) : La réplication par système de fichiers consiste à copier directement les fichiers de données ou les fichiers journaux (comme les fichiers de logs binaires) d'un primary vers un ou plusieurs replicas. Elle peut fonctionner en continu ou par synchronisation périodique, selon le besoin.
        - avantages :
            - simplicité de la mise en place : La réplication par système de fichiers peut être plus simple à configurer, car elle repose sur des outils de copie de fichiers standard. Cela peut être particulièrement utile dans des environnements où une réplication simple et rapide est nécessaire.
            - performance : Cette méthode peut offrir de bonnes performances dans les situations où la réplication de blocs entiers de fichiers est plus efficace que la réplication transactionnelle.
            - tolérance aux pannes : En copiant les fichiers de données entiers, cette méthode peut offrir une bonne tolérance aux pannes, en particulier si elle est utilisée pour des sauvegardes à chaud ou des replicas de secours.
        - inconvénients :
            - consistance des données : Il peut être difficile de garantir que les répliques sont parfaitement synchronisées avec le serveur principal, en particulier si les copies de fichiers sont effectuées périodiquement plutôt que continuellement.
            - granularité : Contrairement à la réplication par journaux, cette méthode ne réplique pas les transactions individuelles. Elle fonctionne au niveau des fichiers, ce qui peut entraîner des problèmes de cohérence s'il y a des changements en cours pendant la copie des fichiers.
            - impact sur les performances : La copie de gros fichiers de données peut entraîner une surcharge importante sur les systèmes de fichiers et les ressources réseau, en particulier pour les bases de données de grande taille.
- **sql/nosql** :
    - sql (structured query language) : langage de requête utilisé pour interagir avec des bases de données relationnelles. Ces bases de données stockent les données sous forme de tables avec des colonnes et des lignes, et les relations entre ces tables sont définies par des clés primaires et étrangères. Les bases de données SQL sont basées sur le modèle relationnel et utilisent des schémas prédéfinis qui dictent la structure des données.
        - avantages :
            - consistance des données : Grâce aux transactions ACID, les bases de données SQL garantissent que les données sont toujours dans un état cohérent.
            - support pour les relations complexes : Les bases de données relationnelles sont excellentes pour modéliser des relations complexes entre les données, ce qui les rend adaptées pour les applications où ces relations sont essentielles.
            - standardisation et maturité : SQL est un standard bien établi avec une longue histoire, ce qui signifie qu'il existe de nombreuses ressources, outils et une grande expertise disponible.
        - inconvénients :
            - rigidité du schéma : Le schéma rigide des bases de données SQL peut limiter la flexibilité lorsque les exigences de données changent ou évoluent rapidement.
            - scalabilité limitée : Bien que les bases de données SQL puissent être mises à l'échelle verticalement (en augmentant la puissance du serveur), elles sont souvent moins adaptées à une mise à l'échelle horizontale (distribution sur plusieurs serveurs) que les bases de données NoSQL.
    - nosql (not only sql) : fait référence à une catégorie de bases de données qui ne suivent pas le modèle relationnel traditionnel. Ces bases de données sont conçues pour être plus flexibles et évolutives, et elles ne nécessitent pas de schéma fixe. Elles sont souvent classées en plusieurs types selon la manière dont elles stockent les données : les bases de données orientées documents, les bases de données en colonnes, les bases de données clé-valeur, et les bases de données en graphe.
        - avantages :
            - flexibilité : Les bases de données NoSQL permettent d'ajuster facilement la structure des données sans avoir besoin de redéfinir un schéma complexe, ce qui est idéal pour les applications avec des exigences de données en évolution.
            - performance et scalabilité : Conçues pour des performances élevées, les bases de données NoSQL peuvent traiter de grandes quantités de données et gérer des charges de travail massives en répartissant les données sur plusieurs serveurs.
            - adapté aux données non structurées : Idéal pour les applications qui traitent des types de données variés et non structurés comme les documents JSON, les graphes, etc.
        - inconvénients :
            - consistance éventuelle : Contrairement aux bases de données SQL, les bases de données NoSQL n'offrent souvent que des garanties de consistance éventuelle (eventual consistency) au lieu de consistance immédiate, ce qui peut poser des problèmes dans certains scénarios transactionnels.
            - manque de normalisation : La dénormalisation, bien qu'elle améliore les performances, peut entraîner de la redondance et rendre la gestion des données plus complexe.
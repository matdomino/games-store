use("games-store-db");

db.createCollection('users');
db.createCollection('games');
db.createCollection('pending-support');
db.createCollection('closed-support');
db.createCollection('pending-returns');
db.createCollection('closed-returns');
db.createCollection('transactions-history');

db.users.insertOne({
  email: "admin@wp.pl",
  username: "admin",
  password: "$2b$10$yKRECITBmeIlEApIOIWmkumJ6xMEng9r8fIAAzPIjSo/hV/CgEXmq",
  role: 'employee',
  walletBalance: 500,
  address: {
    city: "Gdańsk",
    street: "Grunwaldzka",
    home: "20B",
    flat: 5,
    postCode: "80-000"
  },
  games: [],
  favouriteGames: [],
  transactions: [],
  support: [],
  notifications: [],
  shoppingCart: []
});

db.games.insertMany([
  {
    name: "Baldurs Gate 3",
    price: 249.00,
    publisher: "Larian Studios",
    mainPhoto: "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg?t=1705604554",
    photos: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/ss_c73bc54415178c07fef85f54ee26621728c77504.1920x1080.jpg?t=1705604554",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/ss_73d93bea842b93914d966622104dcb8c0f42972b.1920x1080.jpg?t=1705604554",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/ss_cf936d31061b58e98e0c646aee00e6030c410cda.1920x1080.jpg?t=1705604554"
    ],
    genres: [
      "RPG",
      "Przygodowe"
    ],
    description: "Zbierz swoją drużynę i wyrusz ponownie do Zapomnianych Krain w opowieści o przyjaźni i zdradzie, poświęceniu i przetrwaniu oraz pokusie władzy absolutnej.",
    releaseYear: 2023,
    location: "/sciezkadopliku/",
    reviews: []
  },
  {
    name: "Cyberpunk 2077",
    price: 199.00,
    publisher: "CD PROJEKT RED",
    mainPhoto: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg?t=1702306332",
    photos: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_7924f64b6e5d586a80418c9896a1c92881a7905b.1920x1080.jpg?t=1702306332",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_e5a94665dbfa5a30931cff2f45cdc0ebea9fcebb.1920x1080.jpg?t=1706698946",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_429db1d013a0366417d650d84f1eff02d1a18c2d.1920x1080.jpg?t=1706698946"
    ],
    genres: [
      "RPG",
      "Przygodowe",
      "FPS"
    ],
    description: "Cyberpunk 2077 to pełna akcji gra role-playing, której akcja toczy się w Night City, megalopolis rządzonym przez obsesyjną pogoń za władzą, sławą i przerabianiem własnego ciała.",
    releaseYear: 2020,
    location: "/sciezkadopliku/",
    reviews: []
  },
  {
    name: "Diablo IV",
    price: 349.00,
    publisher: "Blizzard Entertainment, Inc.",
    mainPhoto: "https://cdn.cloudflare.steamstatic.com/steam/apps/2344520/header.jpg?t=1706032937",
    photos: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/2344520/ss_9bac7a8ba62aaa3274990935b1e371422c8e898d.1920x1080.jpg?t=1706032937",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/2344520/ss_4491d98b0fb1e7a2d9f1ba8febfd49061a5a8dd1.1920x1080.jpg?t=1706032937",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/2344520/ss_5263c8c21602c0e1393b3a28eb23c09fa0b80951.1920x1080.jpg?t=1706032937"
    ],
    genres: [
      "RPG"
    ],
    description: "Dołącz do walki o Sanktuarium w Diablo IV, wyjątkowej grze przygodowej RPG. Przejdź docenioną przez krytyków kampanię i nową zawartość sezonową.",
    releaseYear: 2023,
    location: "/sciezkadopliku/",
    reviews: []
  },
  {
    name: "EA SPORTS FC 24",
    price: 319.90,
    publisher: "Electronic Arts",
    mainPhoto: "https://cdn.cloudflare.steamstatic.com/steam/apps/2195250/header.jpg?t=1705958877",
    photos: [
        "https://cdn.cloudflare.steamstatic.com/steam/apps/2195250/ss_f3d31c7cffc2a6ab42fb76aaac2bc9d5258bc142.1920x1080.jpg?t=1705958877",
        "https://cdn.cloudflare.steamstatic.com/steam/apps/2195250/ss_eb8f5def662f28726c875e641cd5faff75e6b16d.1920x1080.jpg?t=1705958877",
        "https://cdn.cloudflare.steamstatic.com/steam/apps/2195250/ss_96496b17bd35a97ceb926231e963762d3b86c3c8.1920x1080.jpg?t=1705958877"
    ],
    genres: [
        "Drużynowe"
    ],
    description: "EA SPORTS FC 24 to twoje zaproszenie do The World’s Game: najbardziej realistycznego piłkarskiego doświadczenia w historii dzięki HyperMotionV, stylom gry zoptymalizowanym przez dane firmy Opta i zrewolucjonizowanemu silnikowi Frostbite.",
    releaseYear: 2023,
    location: "/sciezkadopliku/",
    reviews: []
  },
  {
    name: "Grand Theft Auto V",
    price: 129.59,
    publisher: "Rockstar Games",
    mainPhoto: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg?t=1706131787",
    photos: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/ss_90f67258a3d991fe1b72030e56035ede688a82d7.1920x1080.jpg?t=1706131787",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/ss_ea78dfa1d7d81c3781287cab165f64ca70f1f2ea.1920x1080.jpg?t=1706131787",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/ss_be2b9e45c671f95b8bc9fde58dbbd1154b0b633a.1920x1080.jpg?t=1706131787"
    ],
    genres: [
      "Przygodowe",
      "RPG"
    ],
    description: "Grand Theft Auto V na PC pozwala graczom zobaczyć ogromny świat Los Santos i hrabstwa Blaine w rozdzielczości sięgającej 4K i lepszej oraz w 60 klatkach na sekundę.",
    releaseYear: 2015,
    location: "/sciezkadopliku/",
    reviews: []
  },
  {
    name: "Half-Life: Alyx",
    price: 274.99,
    publisher: "Valve",
    mainPhoto: "https://cdn.cloudflare.steamstatic.com/steam/apps/546560/header.jpg?t=1673391297",
    photos: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/546560/ss_d61365e93f20ceb5a94a1e5b2811cf504cbfa303.1920x1080.jpg?t=1673391297",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/546560/ss_6868ae1644628f857e7df4b72a00fdf506f79c7f.1920x1080.jpg?t=1673391297",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/546560/ss_5d228b092e93ff148e6a998c33e751fb968cc956.1920x1080.jpg?t=1673391297"
    ],
    genres: [
      "Przygodowe",
      "FPS"
    ],
    description: "Half-Life: Alyx to powrót Valve do serii Half-Life dzięki technologii VR. To historia umiejscowiona między wydarzeniami z Half-Life a Half-Life 2 i opowiada ona o niemożliwej walce z okrutną rasą obcych znaną jako Kombinat. Grając jako Alyx Vance, jesteś jedyną szansą ludzkości na przetrwanie.",
    releaseYear: 2020,
    location: "/sciezkadopliku/",
    reviews: []
  },
  {
    name: "Metro Exodus",
    price: 127.00,
    publisher: "4A Games",
    mainPhoto: "https://cdn.cloudflare.steamstatic.com/steam/apps/412020/header.jpg?t=1704725230",
    photos: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/412020/ss_7ef17676a804b0d646c38583ba0f68f33b3f3d9e.1920x1080.jpg?t=1704725230",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/412020/ss_4613c0b4d861ac5dbbac9a1e06a8abecfa3b34d5.1920x1080.jpg?t=1704725230",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/412020/ss_76733d65d429aed586ef02772297efbf8bf45a22.1920x1080.jpg?t=1704725230"
    ],
    genres: [
      "FPS",
      "Przygodowe",
      "Sandbox"
    ],
    description: "Czas umknąć z ruin moskiewskiego metra i udać się w wielką podróż przez kontynent i postapokaliptyczne dzikie ostępy na terenie Rosji. Odkrywaj rozległe nieliniowe poziomy, zanurz się we wciągającej rozgrywce typu sandbox, w której stawką jest przeżycie.",
    releaseYear: 2019,
    location: "/sciezkadopliku/",
    reviews: []
  },
  {
    name: "Red Dead Redemption 2",
    price: 249.90,
    publisher: "Rockstar Games",
    mainPhoto: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg?t=1695140956",
    photos: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/ss_bac60bacbf5da8945103648c08d27d5e202444ca.1920x1080.jpg?t=1695140956",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/ss_4ce07ae360b166f0f650e9a895a3b4b7bf15e34f.1920x1080.jpg?t=1695140956",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/ss_d1a8f5a69155c3186c65d1da90491fcfd43663d9.1920x1080.jpg?t=1695140956"
    ],
    genres: [
      "RPG",
      "Przygodowe"
    ],
    description: "RDR2, które zdobyło ponad 250 doskonałych ocen i 175 nagród dla gry roku, to spektakularna opowieść o Arthurze Morganie i niesławnym gangu van der Lindego w czasach u zarania współczesności. Zawiera teżakże dostęp do współdzielonego przez graczy i tętniącego życiem świata Red Dead Online.",
    releaseYear: 2019,
    location: "/sciezkadopliku/",
    reviews: []
  }
]);
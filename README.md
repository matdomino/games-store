# Games Store web aplication
## Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Endpoints Description](#endpoints-description)
4. [Author](#author)

## Introduction
A web application of a digital games store.

![Main page](https://i.imgur.com/ESQwS5A.png)

### Used technology:
- Next.js, React,
- Node.js, express,
- Jsonwebtoken,
- MognoDB,


## Installation
Run using Docker with commands below `(run commands in /games-store/ directory)`:

### Step 0 (optional)
Uncomment this line in `docker-compose.yml` if you want to access database outside Docker.
```
ports:
  - "27017:27017"
```

### Step 1
Set up containers with db, back-end, front-end:
```
docker-compose up -d
```

### Step 2
Set up database collections and example employee user:
```
docker exec -it games-store-db mongosh games-store-db ./setup/dbInit.mongodb.js
```

### Step 3
Access the app at link below:
#### [http://localhost:8080/](http://localhost:8080/)

## Endpoints description
### Database queries examples in Postman:
`/backend-express/GamesStore.postman_collection.json`

### Pages

`/addbalance` - Add balance to wallet.

`/adminpanel` - Panel for employee users to add games to database.

`/game/[gameId]` - Selected game details.

`/history` - User's transaction history.

`/library` - Library with games owned by user.

`/login` - Login/register page.

`/notifications` - User's notifications list.

`/profile` - Panel to change username, password, email, billingInfo.

`/returngame/[gameId]` - Form to return selected game.

`/sendsupportmsg` - Form to send support messages.

`/shoppingcart` - Page with current user's shopping cart.

`/store` - Main store page to browse games. 

`/support` - Page with pending/closed support messages

`/wallet` - Wallet info and options.

## Author
* ### Mateusz Domino: [LinkedIn](https://www.linkedin.com/in/mateusz-domino-214927270/)
* ### Email: [matdomino@outlook.com](mailto:matdomino@outlook.com)
# Sleepwalkers sivut

Sivut käyttävät nuxt content modulia, joka mahdollistaa sivujen sisällön kirjoittamisen markdownilla. Sivut ovat staattisia ja ne hostataan cloudflare pages:issa. Muutokset julkaistaan automaattisesti jokaisen main branchiin tulleen commitin jälkeen.

[Content documentation](https://content.nuxt.com/) ohjeet content moduliin.

## Sivujen muokkaaminen

muokkaa `content` kansiosta löytyviä markdown tiedostoja. Sivut päivittyvät automaattisesti kun muutokset on tehty ja pushattu githubiin.

Jos epäselvää, kysy Jukalta apua.

## Muokkas selaimessa

- Tee github tunnus
- Tee uusi pull request stackblitzin kautta: [new pull request](https://pr.new/xvaara/sleepwalkers)
- Kirjaudu stackblitzin github tunnuksilla
- Muokkaa sivuja ja tallenna muutokset
- Commit omaan forkkiin
- Tee pull request

Video-ohjeet: [https://youtu.be/h2wS0B1sv5I](https://youtu.be/h2wS0B1sv5I)

## Lokaali muokkaaminen

- Tee github tunnus
- Asenna git
- Asenna node.js
- github:issa forkkaa tämä repository
- Kloonaa oma fork lokaalisti
- Luo uusi branch omassa forkissa
- Asenna riippuvuudet
- Käynnistä kehitysserveri
- Tee muutoksia
- commit
- Puske muutokset omaan forkkiin
- Tee pull request alkuperäiseen repositoryyn

## Kloonaa tämä repository

```bash
git clone git@github.com:xvaara/sleepwalkers.git
```

Asenna riippuvuudet:

```bash
# asenna pnpm
npm install -g pnpm

# pnpm
pnpm install
```

## Kehitys Server

Käynnistä kehityspalvelin osoitteessa http://localhost:3000

```bash
pnpm dev
```

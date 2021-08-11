# Pawgram

_A social media platform for your pets._

## Introduction

For my final project at the Concordia Bootcamp, my goal was to create a full-stack web application using **React**, **Node.js**, **MongoDB**, and **Express**. I also used **Figma** to design my application beforehand.

## Concept

With rising fame of social media platforms, I decided to take inspiration of Instagram and create an app for pet pictures and name it **Pawgram**.

## APIs

The APIs that I used are used to get general information about the Dog or Cat's breed, and random facts about them.

- [Random Dog Fact](https://github.com/DukeNgn/Dog-facts-API)
- [Dog Breed Info](https://thedogapi.com/)
- [Random Cat Fact](https://catfact.ninja/)
- [Cat Breed Info](https://thecatapi.com/)

## Run-through

All illustrations are from the amazing artist [Mariana Gonzalez Vega](https://blush.design/collections/40G09koP55fYh86yZDnX/stuck-at-home).

For both the `client` and the `server` folders do a `yarn install` and a `yarn start`

### 1. Homepage

![Homepage](client/public/assets/homepage.png)

### 2. Sign Up, Sign In

I used JWT for authentication. Using local storage, I store the token once logging into a profile, and remove it once logged out.

### 3. Profile/Pets Page

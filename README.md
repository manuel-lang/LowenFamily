# LowenLove

This application is a web application that was developed during [Hackdays Rhein-Neckar 2019](https://hack-days.de/rhein-neckar/home) as submission for the [Rhein-Neckar Löwen](https://www.rhein-neckar-loewen.de) challenge. We were happy to be selected as the winner of the challenge and also awarded for the best pitch over more than 250 participant.

## What does it do?

LowenFamily is a web application that aims to engage fans of the team before, during and after the games. By chosing a gamification approach, we encourage people to be active and share content in order to gain points and potentially win special prizes such as limited edition merchandise or other unique rewards. In its current state, the app contains a first challenge to share images that we display in the live feet on the index page in addition to public instagram posts using the hashtag #1team1ziel.

## How does it work?

The frontend uses HTML and JavaScript to display the live feed, the current challenges, a ranking where users can see their points and a (limited) online shop. The data is fed to the application with a node.js backend. For demo purposes, we deployed the app on Heroku and provide the content on our website [lowenfamily.de](https://www.lowenfamily.de). 

## How to run it locally?

- Clone this repository.
- Make sure [node.js](http://nodejs.org) is installed.
- Navigate to the repository and install the dependencies with `npm install`.
- Start the application with `npm start` and access the application on [localhost:5000](http://localhost:5000).

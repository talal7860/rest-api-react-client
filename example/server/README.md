# Example Node Server for github token exchange

## Getting Started

### Running locally

To start the server locally run the following commands.
```shell
$ docker-compose build
$ docker-compose run --rm server yarn install
$ docker-compose up
```
Sever will be running at http://localhost:3001.

### Deploying to heroku

```shell
HEROKU_APP=heroku-app-name yarn deploy
```

No environment variables are required to run this app, heroku and docker-compose sets them automatically.

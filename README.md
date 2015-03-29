# uaweb7
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/malizhev/uaweb7?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Gitter Calculator for UA WebChallenge 2015.

## What is this?

This is the Gitter Calculator application made special for UA WebChallenge VII.
When launched subscribes to all messages in the room.
Whether there is a message in format `calc [some-expression]` it will automatically respond with the result of expression.

## How does it work?

It's built on top of [node-gitter](https://github.com/gitterHQ/node-gitter) and [mathjs](https://github.com/josdejong/mathjs).
So that support of mathematical expressions is quite good and limited only by current mathjs version :)

To test its behavior you need to run the script and send the message into the room which it's subscribed to, e.g.:
```
calc 81/9
```
Then it'll respond:
```
81/9 = 9
```
That's it!

## How to run?

First you need to install all of project's dependencies. Then run it as follows:
```
node gitter-calc username/roomname
```
If there is no room specified the script will rollback to the default one. 

To run tests execute the following command:

```
npm test
```

## How to configure?

All app's defaults are stored in `config.json` file.

You can change default room, Gitter API token and replies of the bot

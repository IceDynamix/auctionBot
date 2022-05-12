# auctionBot

## setup

- to be hosted yourself
- have node and node package manager of your choice installed
- install dependencies with `npm i`
- add `.env` file, refer to `.env.example` for what keys to fill
- add `players.tsv`, refer to `players.tsv.example` for what columns to use
  - badge names are ; separated, badge ranks are comma separated
- start the bot with `npm run start`

## how to operate

- first use `/allbalance` to set an initial balance for every bidder
- then run `/newsale` to start a sale for a random person
- bidders use `/bid <amount>` to bid on a user

## command permission suggestions

edit command permissions by going to server settings > integrations >
[bot name] > (scroll up) command permissions

following commands are recommended to be put under admin permissions

- allbalance
- allteams
- echo
- newsale
- ping
- resetbalance
- setbalance

following commands are recommended to be put under bidder permissions

- balance
- bid
- team

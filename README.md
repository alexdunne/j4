# j4

## Development

This project users `vagrant` and `ansible` to provision a `hubot` environment.

To get started run `vagrant up`. After a few minutes you should have a provisoned VM.

Run `vagrant ssh` to ssh into the VM. Once connected run `cd /vagrant` to navigate to the code.

You will need to run `source .env` to populate the environment variables prior to starting the bot.

To start J4 run `bin/hubot -a slack`. This will download any dependencies and start the bot.

### Google Calendar setup

To get Google calendar setup you can follow this guide here https://developers.google.com/calendar/quickstart/nodejs.

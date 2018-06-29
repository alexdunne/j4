# j4

## Development

This project users `vagrant` and `ansible` to provision a `hubot` environment.

To get started run `vagrant up`. After a few minutes you should have a provisoned VM.

Run `vagrant ssh` to ssh into the VM. Once connected run `cd /vagrant` to navigate to the code.

You will need to run `source .env` to populate the environment variables prior to starting the bot.

To start J4 run `bin/hubot -a slack`. This will download any dependencies and start the bot.

### Google Calendar setup

- Setup a service account for the j4 project https://console.developers.google.com/apis/credentials

- Download the provided `json` config and rename it to `j4-bot.json`

- Move the file into the root of the project

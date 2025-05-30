# BlackBoardAnnounncmentsBot

this is a simple project i made to give alternative solution for the BlackBoard Announncments problem.

## requirments
- build a scalable server that can used to handle many platforms (tele, whatsapp)
- make architcure that satisfy seperation of consern(each service seperated and do one thing only)
- apply software enginnering best practices

## features (utill now)
- Ai chat bot # you can set the bot with costume persona to act as personal assisstant
- Automated check for New Announcments on the black board then send it via telegram bot # (IU website)
- auto check every day at 12 am and 12 pm for new announcments (you can stop the schdule from the tele bot)

### clients:
- Gemini Client
- telegram bot

## services:

1. scraping service
   - scrap the blackboard Anouncments
2. AiInegraion service
   - extract capthca code from image
   - SmartReply
   - Chat bot with costume persona

#pm2
```
pm2 start app.js --name telebots
```

## enviroment variables needed

```
USER_ACADMIC_NUMBER_IU = "45XXXXXX"
USER_PASSWORD_IU = "XXXXXXX"
API_KEY_GEMINI = "XXXXXXXXXXXXXXXXXX"
TELEGRAM_BOT_TOKEN = "XXXXXXXXXXXXXXXXXXXXXXXX"
TELEGRAM_BOT_NAME = "@XXXXX"
MAIN_CHAT_ID = XXXXXXXX # your chat id with the bot

```

note: you can find your chat id with the bot via:

## Install Required Chromium Dependencies
```
sudo apt update && sudo apt install -y \
  libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 libasound2 \
  libatk1.0-0 libatk-bridge2.0-0 libcups2 libdbus-1-3 libxss1 \
  libnss3 libxext6 libxfixes3 libglib2.0-0 libxrender1 \
  libfontconfig1 libgtk-3-0 ca-certificates fonts-liberation xdg-utils

```

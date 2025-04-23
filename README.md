
# BotsServerManager
in this project i tried to make well Strcured Bots Manager

## requirments
- build a scalable server that can used to handle many bots (tele, whatsapp)
- may i need to design an api for this service ?
- make architcure that satisfy seperation of consern(each service seperated and do one thing only)
- apply software enginnering best practices

## features (utill now)
- Ai chat bot   # you can set the bot with costume persona to act as personal assisstant
- Automated check for New Anouncments on the black board then send it via telegram bot # (IU website)

### clients:
- Gemini Client
- telegram bot
- whatsapp client

## models:
Anouncments

## services:
1. scraping service
    - scrap the blackboard Anouncments
2. AiInegraion service
    - extract capthca code from image
    - SmartReply
    - Chat bot with costume persona


### architcure
i used simple MVC architcure to build this project
```
project/
    - src/
        - controller/
            - SmartMessageController.js
            - ScrapAnoucmentsController.js
        - models/
            - Anouncments.js    # store the scraped anouncments
        - views/
            - Anouncments.js
        - services/
            - IUScraping
                - AnouncmentsScraping.js
            - AiService
                - SmartAiReply.js
                - ImageProccess.js
        - 
    - screenshots/
        - CapchaCodeImageIuWebsite.png
    - database  # i should remove this after create a real db
        - Anouncments.js
```


## Project Title:
LangoBango

## Team Members:
Alex Cavanagh
Derek Etherton

## Application Description
LangoBango is a web-based voice recognition application that 
provides speech driven, language related challenges. Users will
be shown a series of phrases and asked to pronounce them verbally.
A score will be tallied as to how many words the speech recognizer
is able to match with the given phrase, and display a final score
at the end once all phrases have been completed.

LangoBango aims to be a more fun and whimsical way to train speech in different languages.

## Key Features (Beta)
1. Display a series of english phrases to the user (pulled from a db)
2. Recognise user speech via API and display back as text
3. Calculate user score for each phrase, and aggregate for a final score

## Additional Features (Final)
1. Improved UI, aiming for a responsive design
2. User sign-in system that keeps track of user progress
3. Support for common phrases in multiple languages
4. Gameification aspects with meaningful difficulty scaling

## Technology
* HTML
* CSS
* nodejs
* Ajax
* Express
* Google Speech Recognition API
* Bootstrap
* neDB? (Should we just be using a SQL db?)

## Challenges
* Learning and implementing the speech recognition API
* Learning and implementing the Bootstrap framework with responsiveness in mind
* Implementing a meaningful progression system, which is tied to individual user accounts

# Slime Volleyball: With Friends

Go old skool with Pathetic White Slime or play online with a friend.

[![Play Online](https://raw.githubusercontent.com/iamjohnmills/slimevolleyball/master/screenshot.png)](https://slimevolleyballwithfriends.herokuapp.com/)

## Features
Enter a room name to host a game, then have a friend enter the room name to start the match. You can also chat.

## About
This is my contribution to the Slime Volleyball community. I wasted many hours of my life playing the original, and thought I'd waste some more making this.

I set out to create a version of Slime Volleyball in native javascript that was as close the original as possible, and ended up making something pretty close to that with a couple new features.

I used object oriented principles to abstract and refactor everything from my starting point and inspiration: Jonathan Marler's version of Slime Volleyball. I integrated the online version using Node, Express and Socket.io. Currently hosted on Heroku using Continuous Integration with Github.

## More
I abstracted a SlimeAI class to make it easier to integrate new opponent boss fights. I hope to integrate the rest of the gang over time, and create new ones like the Big Blue boss and psycho slime.

The speed of online play is currently a little janky and could probably be optimized. I have no idea what happens if the server gets overloaded with users

## Credit
http://oneslime.net

https://github.com/marler8997

#### Slime Volleyball

Go old-skool with Pathetic White Slime or play online with a friend.

[![Play Online](https://raw.githubusercontent.com/iamjohnmills/slimevolleyball/master/screenshot.gif)](https://slimevolleyballwithfriends.herokuapp.com/)

##### About
I set out to create a version of Slime Volleyball in native javascript that was as close the original as possible, and ended up making something pretty close to that with a couple new features.

I created a variety of themes, custom ai dunk moves, added the wave visualization, some cool music, and implemented a special 'Slime Dunk' move you can activate by pressing down.

I integrated the online version using Node, Express and Socket.io.

##### More
I abstracted a SlimeAI class to make it easier to integrate new opponent boss fights. I hope to integrate the rest of the gang over time, and create new ones like the Big Blue boss and psycho slime.

##### Online
Enter a room name to host a game, then have a friend enter the room name to start the match. You can also chat.

Note: Online play is somewhat janky. The ball physics have a hard time keeping up with the speed from the socket implementation. As an attempt to smooth it out, the ball will be smooth whenever its on the active players side.

##### Credit
http://oneslime.net

https://github.com/marler8997

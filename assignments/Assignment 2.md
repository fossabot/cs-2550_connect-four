# Assignment 2

### Remarks

1. Rather than generating CSS class attributes to make a pattern, I created a
method that can be used to restore the game state. This method sets
`data-player` on the table cells, which are then styled by CSS. For now, I just
pass a default game state, but later on I could get this from local storage.

### Repository

My assignment is being served on GitHub pages:
[ryanp-me/cs-2550/connect-four/dist](http://ryanp-me.github.io/cs-2550/connect-four/dist/).  
The repository for my code is also on GitHub:
[ryanp-me/cs-2550/connect-four/app](https://github.com/ryanp-me/cs-2550/tree/master/connect-four/app).

### Grading Criteria

Points | Requirement                                     | Notes
-------|-------------------------------------------------|-------
30     | Grid generation using nested loops              | [Yes](https://github.com/ryanp-me/cs-2550/blob/master/connect-four/app/game.js#L22-L45)
20     | Grid generation encapsulated (with size params) | [Yes](https://github.com/ryanp-me/cs-2550/blob/master/connect-four/app/game.js#L22-L45)
20     | Uses `getElementById` and `createElement`           | Yes ([`getElementById`](https://github.com/ryanp-me/cs-2550/blob/master/connect-four/app/game.js#L172) and [`createElement`](https://github.com/ryanp-me/cs-2550/blob/master/connect-four/app/game.js#L22-L45))
30     | Generates CSS class attributes                  | Kinda.. (I set [`data-player`](https://github.com/ryanp-me/cs-2550/blob/master/connect-four/app/game.js#L56-L63) rather than a class)

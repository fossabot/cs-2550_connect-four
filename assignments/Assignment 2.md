# Assignment 2

### Remarks

1. Rather than generating CSS class attributes to make a pattern, I created a
method that can be used to restore the game state. This method sets
`data-player` on the table cells, which are then styled by CSS. For now, I just
pass a default game state, but later on I could get this from local storage.

### Repository

My assignment is being served on GitHub pages: [ryanp-me/cs-2550][1].  
The repository for my code is also on GitHub: [ryanp-me/cs-2550][2].

[1]: http://ryanp-me.github.io/cs-2550/ "GitHub Pages"
[2]: https://github.com/ryanp-me/cs-2550/tree/master/connect-four/app "GitHub Repository"

### Grading Criteria

Points | Requirement                                     | Notes
-------|-------------------------------------------------|-------
30     | Grid generation using nested loops              | [Yes][1]
20     | Grid generation encapsulated (with size params) | [Yes][2]
20     | Uses `getElementById` and `createElement`       | Yes ([`getElementById`][3] and [`createElement`][4])
30     | Generates CSS class attributes                  | Kinda.. (I set [`data-player`][5] rather than a class)

[3]: https://github.com/ryanp-me/cs-2550/blob/f0c73b4dd700f24d61351120d63ef6052d4870e9/connect-four/app/game.js#L22-L45 "grid generation nested loop"
[4]: https://github.com/ryanp-me/cs-2550/blob/f0c73b4dd700f24d61351120d63ef6052d4870e9/connect-four/app/game.js#L22-L45 "grid generation encapsulation"
[5]: https://github.com/ryanp-me/cs-2550/blob/f0c73b4dd700f24d61351120d63ef6052d4870e9/connect-four/app/game.js#L172  "getElementById"
[6]: https://github.com/ryanp-me/cs-2550/blob/f0c73b4dd700f24d61351120d63ef6052d4870e9/connect-four/app/game.js#L22-L45 "createElement"
[7]: https://github.com/ryanp-me/cs-2550/blob/f0c73b4dd700f24d61351120d63ef6052d4870e9/connect-four/app/game.js#L56-L63 "CSS data attributes"

# Exercise 10: Add whimsy

The Cookie Clicker game features a lot of animations, representing the cookies being earned, including cursors that rotate around the cookie, and raining background cookies:

![Animated cookie](./__lecture/assets/anim.gif)

There are a number of cool directions you can take this! Some ideas:

- Add falling cookies in the background by creating divs and using `transform: translate` to move them across the screen. For performance reasons, you should cap this to 10-20 at once. Some of the tricks from nyan-cat might come in handy!
- Add cursors rotating around the cookie. You can use `transform: rotate`, though you'll need to offset the cursors so that they aren't spinning in the center of the cookie!
- Anything else you think would be fun!

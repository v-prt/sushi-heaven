# Exercise 3: Passive Cookie Generation

We need to add a hook to update our `numCookies` once every second.

Unfortunately, using `setInterval` with hooks is somewhat complicated. To solve for this complexity, a `useInterval` hook is provided in `src/hooks/use-interval.hook`. Import it, and add the following code:

```js
useInterval(() => {
  const numOfGeneratedCookies = calculateCookiesPerTick(purchasedItems);

  // Add this number of cookies to the total
}, 1000);
```

> _NOTE:_ `useInterval` is a **custom hook**, and a particularly tricky / hard-to-understand one. The good news is that you can pretty much treat it as `window.setInterval`. Just be aware that you need to follow the Rules of Hooks (can't be used conditionally, must be inside a function component, etc).

You'll need to write the `calculateCookiesPerTick` function yourself. This will require some data munging, since you need to iterate through each type of item, and figure out the total value of the items you have. For example, if you have 3 cursors and 1 farm, your total cookies per tick is 83 (1 × 3 + 80 × 1).

Once this is working, you should see the `numCookies` being shown auto-incrementing, once you purchase an item.

Also, we want to show that "cookies-per-second" within the `<Indicator>` component, below the total number of cookies.

> NOTE: Because we're rendering it in the code, you might think that you want to store `cookiesPerSecond` in state. This is a bad practice, though, because this is _derived data_. The # of cookies/second can be calculated from the `purchasedItems` bit of state. If we had a `cookiesPerSecond` state hook, we would need to make sure that they were always kept in sync, and bugs could creep in if we change one state hook but not the other.

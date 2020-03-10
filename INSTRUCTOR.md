For the most part, this workshop relies on pretty typical React Hooks stuff. This does brush against 1 very complicated thing though: the fact that `setInterval` doesn't play nice with React's scheduling model.

The workshop mentions that `useInterval` is surprisingly tricky. IF any students are curious, you can share the following with them. But also, this is a very advanced topic and it's 100% OK to not understand this for now.

Dan Abramov wrote a brilliant blog post about this: https://overreacted.io/making-setinterval-declarative-with-react-hooks/

The final stretch goal asks students to identify the problem with this code:

```js
React.useEffect(() => {
  const handleUpdate = () => {
    const numOfGeneratedCookies = calculateCookiesPerTick(purchasedItems);

    setNumCookies(numCookies + numOfGeneratedCookies);
  };

  const intervalId = window.setInterval(handleUpdate, 1000);

  return () => {
    window.clearInterval(intervalId);
  };
}, []);
```

This code uses the empty dependency array to specify that it should only run on mount. This causes a problem, since `numCookies` will point to a stale reference.

This is pretty hard to wrap your mind around, but think of it this way: the function you pass to `useEffect` only runs after the very first render. This means that `numCookies` is a reference to the initial `numCookies` value, and the same is true for `purchasedItems`.

State in React is immutable; when you call `setPurchasedItems`, it produces a brand new `purchasedItems` object. This means that the `setInterval` loop is just going to keep running while pointing to the initial state, and it's never going to know when the user buys new items or generates new cookies!

### Semi-fix

There is a half-fix, which is simply to update the dependency array to include the two pieces of state:

```diff
React.useEffect(() => {
  const handleUpdate = () => {
    const numOfGeneratedCookies = calculateCookiesPerTick(purchasedItems);

    setNumCookies(numCookies + numOfGeneratedCookies);
  };

  const intervalId = window.setInterval(handleUpdate, 1000);

  return () => {
    window.clearInterval(intervalId);
  };
-}, []);
+}, [numCookies, purchasedItems]);
```

If students figure this out, they should be commended - this stuff is hard, and this fix shows a solid level of understanding when it comes to `useEffect` and its dependencies. Unfortunately, though, this fix is imcomplete, because of how `setInterval` works.

In this model, _whenever_ either piece of state changes, the interval is canceled and a new one is started.

The loop runs every second. Let's say that the user clicks on the cookie 900ms after the last loop. They're immediately awarded 1 cookie, but the loop resets.

In fact, if the user clicks more than once per second, they'll never benefit from the auto-generated cookies! Because every time they click, they reset the interval that grants them the cookies from cursors, grandmas, and farms.

### Proper fix

The proper fix is complicated AF, and it relies on refs, something we've only briefly touched on. For particularly advanced students, we can take this time to explain them in more detail.

A ref is a box for mutable values that is remembered across renders. So if you have this code:

```js
const SomeComponent = () => {
  const val = React.useRef(5);

  val++;

  console.log(val.current);

  return null;
};
```

Every time it renders, it increases the value of `val` by 1. So on the first render, it would log 6. Second render logs 7.

Critically, this is different from React state in that it is mutable. This means that the reference is preserved. `val` always points to an object, `{ current: number }`, and that object is not immutable. You can keep referencing it across renders.

The trick, then, is to store a reference _to our updater function_.

```js
// This ref is our mutable box
const updateRef = React.useRef();

// On every render, set it to this function (with fresh access to the state)
updateRef.current = () => {
  const numOfGeneratedCookies = calculateCookiesPerSecond(purchasedItems);

  console.log(numCookies, purchasedItems);

  setNumCookies(numCookies + numOfGeneratedCookies);
};

// `updateRef.current` will always point to the function we just defined,
// so we can trust that every time it's called, it can still successfully
// access the
React.useEffect(() => {
  const tick = () => updateRef.current();

  const intervalId = window.setInterval(tick, 1000);

  return () => {
    window.clearInterval(intervalId);
  };
}, []);
```

This is very complicated, but we'll be covering some of this in the "Thinking in React" lecture. So if the student still doesn't understand, ask them to wait until after that lecture to see if things click.

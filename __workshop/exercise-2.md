# Exercise 2: Adding State

At the top of our `Game` component, we have two static pieces of data:

```js
// TODO: Replace this with React state!
const numCookies = 100;
const purchasedItems = {
  cursor: 0,
  grandma: 0,
  farm: 0,
};
```

We want this data to be _dynamic_, so we'll need to use React state via a `useState` hook.

First, let's do `numCookies`. Here's what we want:

- `numCookies` should come from a state hook
- Clicking the cookie `<Button>` should increment it by 1
- That value should be shown in the UI (at the top, inside `<Indicator>`)

Implementing this is left as an exercise. If you're feeling lost, check out previous workshop for a refresher on how `useState` works!

Next, `purchasedItems`. This will also need to use a state hook.

That `handleClick` method we added for `Item` needs to do a few things:

- Check if the user can afford the item being clicked. If not, throw a `window.alert` and return early.
- Otherwise, deduct the appropriate number of cookies from `numCookies`, and add the item count to `purchasedItems`.

In other words, here's the transformation that should happen:

```diff
// Let's say this is our initial state:
numCookies = 100;
purchasedItems = {
  cursor: 0,
  grandma: 0,
  farm: 0,
};

The `cursor` item costs 10 cookies:
  { id: 'cursor', name: 'Cursor', cost: 10, value: 1 },

If we buy a `cursor`, we should end up with this new state:

- numCookies = 100;
+ numCookies = 90;
purchasedItems = {
-  cursor: 0,
+  cursor: 1,
  grandma: 0,
  farm: 0,
};

You can see that 1 cursor has been added to `purchasedItems`,
and 10 cookies have been deducted from `numCookies`
```

_HINT:_ You'll need to have 2 separate state hooks. One for `numCookies` and one for `purchasedItems`. This means that when you buy an item, you'll need to call 2 separate setter functions.

_HINT:_ When using an object as the state, you'll need to be careful not to overwrite other state values. For example, don't do this:

```js
setPurchasedItems({ cursor: 1 });
```

If you do this, you'll accidentally delete the `grandma` and `farm` items! Instead, you can use the "spread" operator:

```js
const o = { apple: 10, banana: 2 }

const updatedO = {
  ...o,
  banana: 4,
}

console.log(updatedO); -> { apple: 10, banana: 4 }
```

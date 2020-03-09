# Workshop: Cookie Clicker

This workshop challenges you to build an **idle game**.

An idle game is a game that involves very little active gameplay, and mostly a lot of waiting around for resources to grow. The most famous example of an idle game is [cookie clicker](https://orteil.dashnet.org/cookieclicker/), so we'll create a simple clone of that game.

The game features a cookie that can be clicked; every click yields 1 cookie. You can use cookies to buy resources that purchase cookies automatically for you.

Here's a finished working demo:

![working demo](./__lecture/assets/clicker.gif)

## Exercise 1: Finishing the UI

First, let's take a look at the structure. We'll find React Router in our `App` component.

There are two routes, our root `/` that renders `Home`, and `/game` which renders `Game`. We won't need to touch `Home`, so let's focus on `Game`.

Our `Game` file has an array of items:

```js
const items = [
  { id: 'cursor', name: 'Cursor', cost: 10, value: 1 },
  { id: 'grandma', name: 'Grandma', cost: 100, value: 10 },
  { id: 'farm', name: 'Farm', cost: 1000, value: 80 },
];
```

`cost` is how many cookies the items cost. `value` is how many cookies the item generates per second.

You can see that we aren't using this data anywhere yet, and we have a TODO in our component:

```js
<ItemArea>
  <SectionTitle>Items:</SectionTitle>
  {/* TODO: Add <Item> instances here, 1 for each item type. */}
</ItemArea>
```

Create a new `<Item>` component in a new file, `Item.js`. Start by entering fake data and getting the styling right. Then, substitute those values for props (such as `cost` and `value`).

In our `Game` component, map over the `items` array, and create 1 `<Item>` component for each item, passing in the right props.

There are two speciap props we need: `numOwned` and `handleClick`.

`numOwned` will tell the component how many of this item are currently owned, and will be displayed as a big number on the right side. For now, you can use the `purchasedItems` object in the Game component; we'll replace this with React state shortly.

For `handleClick`, we want to pass a function. For now it can just log to the console; we need to add state for this to work.

## Exercise 2: Adding state

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
- That value should be shown in the UI (inside `<Indicator>`)

Implementing this is left as an exercise (if you're feeling lost, check out previous workshops for a refresher on how `useState` works!).

Next, `purchasedItems`. This will also need to use a state hook.

That `handleClick` method we added for `Item` needs to do a few things:

- Check if the user can afford the item being clicked. If not, throw a `window.alert` and return early.
- Otherwise, deduct the appropriate number of cookies from `numCookies`, and add the item count to `purchasedItems`.

In other words, here's the transformation that should happen:

```
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

numCookies = 90;
purchasedItems = {
  cursor: 1,
  grandma: 0,
  farm: 0,
};

You can see that 1 cursor has been added to `purchasedItems`,
and 10 cookies have been deducted from `numCookies`
```

> HINT: You'll need to have 2 separate state hooks. One for `numCookies` and one for `purchasedItems`. This means that when you buy an item, you'll need to call 2 separate setter functions.

> ANOTHER HINT: When using an object as the state, you'll need to be careful not to overwrite other state values. For example, don't do this:
>
> setPurchasedItems({ cursor: 1 })
>
> If you do this, you'll accidentally delete the `grandma` and `farm` items! Instead, you can use the "spread" operator.

## Exercise 3: Focusing the cookie button on mount

It would be nice if the button holding our big clickable cookie was auto-focused on mount, for keyboard users.

## Exercise 3: Passive cookie generation

We need to add a hook to update our `numCookies` once every second.

Unfortunately, using `setInterval` with hooks is somewhat complicated. To solve for this complexity, a `useInterval` hook is provided in `src/hooks/use-interval.hook`. Import it, and add the following code:

```js
useInterval(() => {
  const numOfGeneratedCookies = calculateCookiesPerTick(purchasedItems);

  // Add this number of cookies to the total
}, 1000);
```

You'll need to write the `calculateCookiesPerTick` function yourself. This will require some data munging, since you need to iterate through each type of item, and figure out the total value of the items you have. For example, if you have 3 cursors and 1 farm, your total cookies per tick is 83 (1 _ 3 + 80 _ 1).

Once this is working, you should see the `numCookies` being shown auto-incrementing, once you purchase an item.

Also, we want to show that "cookies-per-second" within the `<Indicator>` component, below the total number of cookies.

> NOTE: Because we're rendering it in the code, you might think that you want to store `cookiesPerSecond` in state. This is a bad practice, though, because this is _derived data_. The # of cookies/second can be calculated from the `purchasedItems` bit of state. If we had a `cookiesPerSecond` state hook, we would need to make sure that they were always kept in sync, and bugs could creep in if we change one state hook but not the other.

## Exercise 4: Updating the tab title

The "cookie clicker" game shows your total # of cookies in the tab title:

![title bar](./__lecture/assets/title.gif)

We can use `useEffect` here! Whenever the `numCookies` state is changed, we want to update `document.title` to reflect this change.

Give this a shot. The solution is shown below.

.

..

...

....

.....

......

.......

......

.....

....

...

..

.

Here's how we do this with `useEffect`:

```js
React.useEffect(() => {
  document.title = `${numCookies} cookies - Cookie Clicker Workshop`;
}, [numCookies]);
```

There's one more problem too. What happens if you click "return home" in the top left, after generating some cookies? The document title remains set to that custom value, but we aren't playing the game anymore! It should revert to "Cookie Clicker Workshop".

To fix this, we can take advantage of the _return callback_:

```js
React.useEffect(() => {
  document.title = `${numCookies} cookies - Cookie Clicker Workshop`;

  return () => {
    document.title = `Cookie Clicker Workshop`;
  };
}, [numCookies]);
```

The _return callback_ is called right before `numCookies` is changed or unset.

Add a console.log to this callback, to deepen your understanding of when it's called.

## Exercise 5: Using the "space" key

Another way that `useEffect` is helpful is when we need to register global event listeners.

Let's say that we want to trigger the same "click" cookie-generation when the user presses the spacebar. Say that this should happen _no matter which element is selected_.

Here's how we would do this, in vanilla JS:

```js
function handleKeydown() {
  if (ev.code === 'Space') {
    // Trigger here
  }
}

window.addEventListener('keydown', handleKeydown);
```

With React components, we always want to _clean up after ourselves_. We can do that with `window.removeEventListener`, as well as the _return callback_ we saw in the previous exercise.

QUESTION: Why is it important that we clean after ourselves in React components? HINT: without cleaning up, try clicking the "Return home" button, and then pressing the spacebar. Do you see anything in the console?

### Exercise 5.2: Moving mount focus to store item

We're currently focusing the cookie on-mount right now. With "Space" being used for cookie clicking, this is a bit redundant. Instead, let's focus the very first store item, to make it easier for keyboard users to purchase items.

This is a deceptively tricky problem, but here's a hint: Write a new hook inside `Item`. You can add a new prop to `Item` to tell it whether this particular item is the first item in the list or not.

Remember, **you cannot use hooks conditionally**. This won't work:

```js
if (someParam) {
  React.useEffect(() => {
    /* stuff */
  });
}
```

Instead, you need to do this:

```js
React.useEffect(() => {
  if (someParam) {
    /* stuff */
  }
});
```

# STRETCH GOALS

## Stretch goal 1: Increasing cookies per click

In Cookie Clicker, there are two kinds of items:

- Items that increase the # of cookies per tick
- Items that increase the # of cookies per click

Right now, we've implemented the second type, but not the first. No matter what we purchase, we always earn exactly 1 cookie per click.

Add a new item type, `megaCursor`, which increases the # of cookies per click. You'll need to do some re-working of the game logic and the data format for this to work!

## Stretch goal 2: Increased pricing

In Cookie Clicker, each time you buy an item, it gets more expensive; The first cursor might only cost 10 cookies, but the second one might cost 12, and then 15, and then 20. The growth rate is _non-linear_; the price doesn't go up by 2 cookies every time, for example. Instead the jump gets higher and higher with every purchase.

Implement this!

## Stretch goal 3: Add whimsy

The Cookie Clicker game features a lot of animations, representing the cookies being earned, including cursors that rotate around the cookie, and raining background cookies:

![Animated cookie](./__lecture/assets/anim.gif)

There are a number of cool directions you can take this! Some ideas:

- Add falling cookies in the background by creating divs and using `transform: translate` to move them across the screen. For performance reasons, you should cap this to 10-20 at once. Some of the tricks from nyan-cat might come in handy!
- Add cursors rotating around the cookie. You can use `transform: rotate`, though you'll need to offset the cursors so that they aren't spinning in the center of the cookie!
- Anything else you think would be fun!

## Stretch goal 4: Understanding `useInterval`

Earlier, we mentioned that we use a custom `useInterval` hook because `setInterval` is complicated with React hooks.

To understand why this is complicated, a member of the React team named Dan Abramov wrote a blog post explaining this: https://overreacted.io/making-setinterval-declarative-with-react-hooks/

This content is pretty advanced, so this is indeed a stretchy stretch goal, but your task is to read through this blog post, and then answer the following 2 questions:

1. What is the problem with this code?

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
}, [numCookies]);
```

2. How can we use refs to update this code so that it works properly?

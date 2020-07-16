# Exercise 6: Focusing the first store item on mount

It would be great for keyboard users if the very first item was auto-focused on mount.

As a refresher, here's how to focus an item on mount:

```jsx
const App = () => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <>
      <button ref={firstNameRef} />
    </>
  );
};
```

In our case, it's a bit trickier since we're rendering multiple items and we only want to auto-focus the very first one!

Here's a hint: Write a new hook inside `Item`. You can add a new prop to `Item` to tell it whether this particular item is the first item in the list or not. If the item is the first, you can trigger the focus. Otherwise, do nothing.

Remember, **you cannot use hooks conditionally**. This won't work:

```js
if (someParam) {
  React.useEffect(() => {
    // stuff
  });
}
```

Instead, you need to do this:

```js
React.useEffect(() => {
  if (someParam) {
    // stuff
  }
});
```

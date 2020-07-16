# Exercise 5: Using the "space" Key

Another way that `useEffect` is helpful is when we need to register global event listeners.

Let's say that we want to trigger the same "click" cookie-generation when the user presses the spacebar.

Here's how we would do this, in vanilla JS:

```js
function handleKeydown(ev) {
  if (ev.code === "Space") {
    // Trigger here
  }
}

window.addEventListener("keydown", handleKeydown)
```

Write a `useEffect` hook that registers an event listener, and triggers the "cookie click" code when the user hits the `Space` key. don't forget to unregister that callback when the component unmounts.

With React components, we always want to _clean up after ourselves_. We can do that with `window.removeEventListener`, as well as the _return callback_ we saw in the previous exercise.

> QUESTION: Why is it important that we clean after ourselves in React components? _HINT:_ without cleaning up, try clicking the "Return home" button, and then pressing the spacebar. Do you see anything in the console?

Here's how we do this with `useEffect`:

```js
React.useEffect(() => {
  document.title = `${numCookies} cookies - Cookie Clicker Workshop`
}, [numCookies])
```

There's one more problem too. What happens if you click "return home" in the top left, after generating some cookies? The document title remains set to that custom value, but we aren't playing the game anymore! It should revert to "Cookie Clicker Workshop".

To fix this, we can take advantage of the _return callback_, which lets us do cleanup:

```js
React.useEffect(() => {
  document.title = `${numCookies} cookies - Cookie Clicker Workshop`

  return () => {
    document.title = `Cookie Clicker Workshop`
  }
}, [numCookies])
```

The _return callback_ is called whenever `numCookies` is changed, _or_ when the component is unmounting. This means that whenever the number changes, we'll make two calls to `document.title`, but they're close enough together that you'll only see the last one.

Add a console.log to this callback, to deepen your understanding of when it's called.

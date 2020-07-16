# Exercise 7: Custom hooks

We defined a few pieces of behaviour in our app that could potentially be reused. Let's refactor our code to extract generic logic into reusable hooks.

Create the following hooks:

- `useKeydown`
- `useDocumentTitle`

`useKeydown` should take two arguments: `code`, the key to track, and `callback`, some code to run when that key is pressed.

`useDocumentTitle` should take two arguments: `title` and `fallbackTitle`. Whenever `title` changes, it should be set as the document title. `fallbackTitle` should be used as cleanup.

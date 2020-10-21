# UseEffect hook

---

### Side effects

What happens when you want to do something _other_ than rendering to the screen?

---

- Updating the document title
- Fetching data from a network
- Doing something when the user scrolls

---

### Doing something on scroll

Here's how we do this in vanilla JS:

```js
window.addEventListener("scroll", () => {
  console.log("User scrolled!");
});
```

---

What about in React?

---

# 🙅‍♀️Not the answer:

```js
const App = () => {
  window.addEventListener("scroll", () => {
    console.log("scroll");
  });

  return (
    <div style={{ height: "500vh" }}>
      <p>This is bad.</p>
      <p>Set some state in the event listener to see why.</p>
    </div>
  );
};
```

---

# The `useEffect` hook

---

```js
// `useEffect` takes a function.
// It calls this function AFTER the render
React.useEffect(() => {});
```

It calls this function **AFTER** the render

---

It takes a "dependencies" array

```js
React.useEffect(() => {
  console.log("some state changed!");
}, [someState, someOtherState]);
```

---

Neat example: logging

```js live=true
const Input = ({ val, handleChange }) => {
  React.useEffect(() => {
    console.log(val);
  }, [val]); // <-- here

  return (
    <input
      value={val}
      onChange={(ev) => handleChange(ev.currentTarget.value)}
    />
  );
};

const App = ({ title }) => {
  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");

  return (
    <>
      <Input val={name} handleChange={setName} />
      <Input val={address} handleChange={setAddress} />
    </>
  );
};

render(<App />);
```

---

## Fetching from a network

You _definitely_ don't want to do this in every render

---

```js
const App = () => {
  const [cart, setCart] = React.useState({});

  fetch("some-url").then((data) => {
    console.log("Got data:", data);
    setCart(data);
  });

  React.useEffect(() => {
    fetch("some-url").then((data) => {
      console.log("Got data:", data);
      setCart(data);
    });

    return JSON.stringify(cart, null, 2);
  }, [cart]);

  // ...
};
```

---

**Tip:** Use an empty dependency array to _only_ run the fetch on mount

---

# Exercises

Update the following snippets to make use of `useEffect`

---

<Timer initialTime={2} />

```js
const App = () => {
  const [count, setCount] = React.useState(0);

  document.title = `You have clicked ${count} times`;

  return <button onClick={() => setCount(count + 1)}>Increment</button>;
};
```

---

```js
const App = ({ color }) => {
  const [value, setValue] = React.useState(false);

  window.localStorage.setItem("value", value);
  window.localStorage.setItem("color", color);

  return (
    <div>
      Value: {value}
      <button onClick={() => setValue(!value)}>Toggle thing</button>
    </div>
  );
};
```

---

```js
const Modal = ({ handleClose }) => {
  window.addEventListener("keydown", (ev) => {
    if (ev.code === "Escape") {
      handleClose();
    }
  });

  return <div>Modal stuff</div>;
};
```

---

# Unsubscribing

---

There's one other thing to know about `useEffect`: you can _clean stuff up_ when values change.

---

### The problem:

Let's say we have some routes:

```js
<Router>
  <Route path="/">
    <Home>
  </Route>
  <Route path="/about">
    <About />
  </Route>
</Router>
```

---

Our Home component has some sort of event listener.
It also has a link to the other route.

```js
const Home = () => {
  React.useEffect(() => {
    window.addEventListener("scroll", func());
  }, []);

  return (
    <div>
      <Link to="/about">About</Link>
    </div>
  );
};
```

---

We click the "About" link.

The scroll handler _doesn't go away_ just because we changed components.

`<Home>` is no longer rendered, but its scroll-handler lives on.

---

# Unsubscribing

```js
const Home = () => {
  React.useEffect(() => {
    window.addEventListener("scroll", aFunc());

    return () => {
      window.removeEventListener("scroll", aFunc());
    };
  }, []);
};
```

---

Unsubscribes are processed **right before** the next update, and **right before** removal.

---

<img src='./assets/update-A.svg' />

---

<img src='./assets/update-B.svg' />

---

<img src='./assets/update-C.svg' />

---

import updateDSrc from './assets/update-D.svg';

<img src='./assets/update-D.svg' />

---

# Exercises

Make sure to do the appropriate cleanup work

---

```js
// seTimeout is similar to setInterval...
const App = () => {
  React.useEffect(() => {
    window.setTimeout(() => {
      console.log("1 second after update!");
    });
  }, []);

  return null;
};
```

---

```js
const App = () => {
  React.useEffect(() => {
    window.addEventListener("keydown", (ev) => {
      console.log("You pressed: " + ev.code);
    });
  }, []);

  return null;
};
```

---

# Custom hooks

React hooks are powerful because we can _compose them_.

---

A custom hook is a **function** that starts with **use**.

Examples:

- _useApiEndpoint_
- _useTextToSpeech_
- _useScrollPosition_
- _useCounter_

React tooling actually **does** care that the name starts with `use`.

---

Custom hooks use **one or more** official React hooks.

They're a great way to **reuse logic**.

---

### Example

Tracking mouse position

<div class="row">
<div class="col">

```js
const App = ({ path }) => {
  const [mousePosition, setMousePosition] = React.useState({
    x: null,
    y: null,
  });

  React.useEffect(() => {
    const handleMousemove = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };

    window.addEventListener("mousemove", handleMousemove);

    return () => {
      window.removeEventListener("mousemove", handleMousemove);
    };
  }, []);

  return (
    <div>
      The mouse is at {mousePosition.x}, {mousePosition.y}.
    </div>
  );
};
```

</div>
<div class='col'>

```js
// refactoring time...
```

</div>
</div>

---

# Exercises

Extract a custom hook

---

<Timer initialTime={2} />

```js
const App = ({ path }) => {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch(path)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
      });
  }, [path]);

  return <span>Data: {JSON.stringify(data)}</span>;
};
```

---

```js live=true
const Time = ({ throttleDuration }) => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTime(new Date());
    }, throttleDuration);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [throttleDuration]);

  return (
    <span>
      It is currently
      <br />
      {time.toTimeString()}
    </span>
  );
};

render(<Time throttleDuration={1000} />);
```

# Etherio Pay API

```js
// src/routes/index.ts [Test User-1]
router.use((req, res, next) => {
  req["uid"] = "TJFsHJ3Z0YXv4rvlK25yCKWYDTa2";
  req["auth"] = {
    uid: req["uid"],
    phone_number: "+959786790789",
    email: null,
    created_at: 1634813766848,
  };
  next();
});

// src/routes/index.ts [Test User-2]
router.use((req, res, next) => {
  req["uid"] = "bDFXSgDDqnTOTcDwrK8EPNJuBFh2";
  req["auth"] = {
    uid: req["uid"],
    phone_number: "+95943119850",
    email: null,
    created_at: 1634813766848,
  };
  next();
});
```

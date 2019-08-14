
### AppBar variant
Toggles at minimum need 2 options.
Exclusive value. 
```js
const opts = [
    {value: 1, label: 'Production' },
    {value: 2, label: 'Sandbox' },
];
<Toggle 
    variant="appbar" 
    minWidth={120}
    defaultValue={1} options={opts} 
    exclusive 
    size="small" />
```

### Default variant
Toggles can have any number of options.
```js
const opts = [
    {value: 1, label: 'GET' },
    {value: 2, label: 'PUT' },
    {value: 3, label: 'POST' },
    {value: 4, label: 'DELETE' },
    {value: 5, label: 'HEAD' },
];
<Toggle 
    options={opts} 
    defaultValue={3}
    minWidth={40}
    exclusive />
```

Toggles don't have to be "exclusive".
```js
const opts = [
    {value: 1, label: 'Center' },
    {value: 2, label: 'Bold' },
    {value: 3, label: 'Underline' },
];
<Toggle options={opts} />
```

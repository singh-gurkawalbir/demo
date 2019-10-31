
### AppBar variant
Toggles at minimum need 2 options.

Options can be exclusive (only one allowed). Alternatively, 
if the "exclusive" prop is not set, any/all of the options can be selected.
```js

const demoContainer = {
    padding: 8,
};

const opts = [
    {value: 1, label: 'Production' },
    {value: 2, label: 'Sandbox' },
];
const opts2 = [
    {value: 1, label: 'Three' },
    {value: 2, label: 'Inclusive' },
    {value: 3, label: 'Options' },
];

<div>
    <div style={demoContainer}>
    <TextToggle 
        variant="appbar" 
        minWidth={120}
        value={1} options={opts} 
        exclusive 
        size="small" />
    </div>
    
    <div style={demoContainer}>
    <TextToggle 
        variant="appbar" 
        minWidth={80}
        value={0} options={opts2}  
        size="small" />
    </div>
</div>
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
<TextToggle 
    options={opts} 
    value={3}
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
<TextToggle options={opts} />
```

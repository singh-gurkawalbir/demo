Default inline spinner with sizes:
```js
const SpacedContainer = require('../../styleguide/SpacedContainer').default;
const Typography = require('@material-ui/core/Typography').default;
    <SpacedContainer>
    <Spinner loading><Typography>welcome</Typography></Spinner>
    <Spinner size="medium" color="secondary" />
    <Spinner size="small" />
    <Spinner size="large" />
</SpacedContainer>
```
Block-centered "loading" spinner with thicknes:
```js
const SpacedContainer = require('../../styleguide/SpacedContainer').default;
const Typography = require('@material-ui/core/Typography').default;
const wrapper = {
    position:'relative',
    height: '50px',
};

<SpacedContainer >
<Spinner loading  />
<Spinner size="large" color="secondary" />
<div style={wrapper}><Spinner centerAll /></div>
<div style={wrapper}>
    <Spinner centerAll>
        <Typography>Loading Drawer Content</Typography>
    </Spinner>
</div>
</SpacedContainer>
```

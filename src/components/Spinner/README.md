Default inline spinner with sizes:
```js
const SpacedContainer = require('../../styleguide/SpacedContainer').default;
    <SpacedContainer>
    <Spinner color="primary" />
    <Spinner size="medium" color="secondary" />
    <Spinner size="small" />
    <Spinner size="large" />
</SpacedContainer>
```
Block-centered "loading" spinner with thicknes:
```js
const SpacedContainer = require('../../styleguide/SpacedContainer').default;
<SpacedContainer >
<Spinner loading  />
<Spinner loading size="large" color="secondary" />
</SpacedContainer>
```

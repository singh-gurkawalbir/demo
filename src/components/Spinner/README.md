Default inline spinner with sizes:
```js
const SpacedContainer = require('../../styleguide/SpacedContainer').default;
    <SpacedContainer>
    <Spinner color="primary" />
    <Spinner size={24}  color="secondary" />
    <Spinner size={16} />
</SpacedContainer>
```
Block-centered "loading" spinner with thicknes:
```js
const SpacedContainer = require('../../styleguide/SpacedContainer').default;
<SpacedContainer >
<Spinner loading  />
<Spinner loading thickness={1.2} />
</SpacedContainer>
```

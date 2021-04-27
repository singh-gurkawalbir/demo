```js
const SpacedContainer = require('../../../styleguide/SpacedContainer').default;
const AddIcon = require('../../icons/AddIcon').default;
const DeleteIcon = require('../../icons/TrashIcon').default;
<SpacedContainer>
    <TertiaryButton disabled> Disabled</TertiaryButton>
    <TertiaryButton size="small">Default / Primary</TertiaryButton>
    <TertiaryButton color="primary" bold="true">Bold</TertiaryButton>
    <TertiaryButton color="secondary">Secondary</TertiaryButton>
    <TertiaryButton color="primary" bold="true" startIcon= {<AddIcon/>}>Start Icon</TertiaryButton>
    <TertiaryButton color="secondary" bold="true" size="large" endIcon= {<DeleteIcon/>}>End Icon</TertiaryButton>
    
</SpacedContainer>
```
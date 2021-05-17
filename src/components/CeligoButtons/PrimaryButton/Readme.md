```js
  const SpacedContainer = require('../../../../src/styleguide/SpacedContainer').default;
  const AddIcon = require('../../../../src/components/Icons/AddIcon').default;
  const DeleteIcon = require('../../../../src/components/Icons/TrashIcon').default;
 //const DeleteIcon = require('@material-ui/icons/Delete').default;
 //const AddIcon = require('@material-ui/icons/Add').default;
    <>
    <SpacedContainer> 
        <PrimaryButton>Welcome</PrimaryButton>
        <PrimaryButton color="error">Save</PrimaryButton>
    </SpacedContainer>

    <SpacedContainer>
        <PrimaryButton startIcon={<DeleteIcon/>}>Delete Icon</PrimaryButton>
        <PrimaryButton endIcon={<AddIcon/>}>Delete Icon</PrimaryButton>
    </SpacedContainer>
    </>
```
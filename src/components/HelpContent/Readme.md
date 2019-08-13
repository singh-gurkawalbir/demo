Help content


```js

const Typography = require('@material-ui/core/Typography').default;
const SpacedContainer = require('../../styleguide/SpacedContainer').default;

const CustomStyle = {
    display: 'flex',
};
<div style={CustomStyle}>
    <SpacedContainer>
        <HelpContent title="small Content">
            <Typography>Some content here</Typography>
        </HelpContent>
    </SpacedContainer>
     <SpacedContainer>
        <HelpContent title="Medium Content">
            <Typography>These are used to massage and optimize source records before they are passed along to down stream processors.</Typography>
        </HelpContent>
    </SpacedContainer>  
    <SpacedContainer>
        <HelpContent title="Large Content">
            <Typography>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</Typography>
        </HelpContent> 
    </SpacedContainer>  
         <SpacedContainer>
        <HelpContent caption="json.path.to.field" title="Field Help for Devs">
            <Typography>These are used to massage and optimize source records before they are passed along to down stream processors.</Typography>
        </HelpContent>
    </SpacedContainer>   
</div>
```
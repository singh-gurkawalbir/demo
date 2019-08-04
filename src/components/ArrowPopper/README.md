Default ArrowPopper
```js
const Typography = require('@material-ui/core/Typography').default;
const Button = require('@material-ui/core/Button').default;
const SpacedContainer = require('../../styleguide/SpacedContainer').default;
const HelpContent = require('../HelpContent').default;

initialState = { 
    anchorEl: null, 
    placement: 'bottom' 
};

const handleClose = () => setState({ anchorEl: null });
const handleClick = 
    (event, placement) => setState({ 
        anchorEl: state.anchorEl === event.currentTarget ? null : event.currentTarget,
        placement: placement
    });

<div>
    <SpacedContainer>
        <Button onClick={e => handleClick(e, 'top')} variant="contained">Open Popper on TOP</Button>
        <Button onClick={e => handleClick(e, 'bottom')} variant="contained">Open Popper on BOTTOM</Button>
        <Button onClick={e => handleClick(e, 'left')} variant="contained">Open Popper on LEFT</Button>
        <Button onClick={e => handleClick(e, 'right')} variant="contained">Open Popper on RIGHT</Button>
         <ArrowPopper 
            open={!!state.anchorEl} 
            anchorEl={state.anchorEl} 
            placement={state.placement} 
            onClose={handleClose}>
            <HelpContent title="transform">
                <Typography>
                    These are used to massage and optimize source records before they are passed along to down stream processors.
                </Typography>
            </HelpContent>
        </ArrowPopper>
    </SpacedContainer>
   
</div>
```
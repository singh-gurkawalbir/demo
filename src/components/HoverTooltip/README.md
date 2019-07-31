Default Tooltip
```js
const Typography = require('@material-ui/core/Typography').default;
const Button = require('@material-ui/core/Button').default;
const SpacedContainer = require('../../styleguide/SpacedContainer').default;
const TooltipContent = require('../TooltipContent').default;

initialState = { 
    anchorEl: null, 
    placement: 'bottom' 
};

const handleClick = 
    (event, placement) => setState({ 
        anchorEl: state.anchorEl === event.currentTarget ? null : event.currentTarget,
        placement: placement
    });

<SpacedContainer>
    <Button onClick={e => handleClick(e, 'top')} variant="contained" >Open Tooltip on TOP</Button>
    <Button onClick={e => handleClick(e, 'bottom')} variant="contained">Open Tooltip on BOTTOM</Button>
    <Button onClick={e => handleClick(e, 'left')} variant="contained">Open Tooltip on LEFT</Button>
    <Button onClick={e => handleClick(e, 'right')} variant="contained">Open Tooltip on RIGHT</Button>

    <HoverTooltip open={!!state.anchorEl} anchorEl={state.anchorEl} placement={state.placement} >
        <TooltipContent title="Some info here" />
    </HoverTooltip>
</SpacedContainer>
```
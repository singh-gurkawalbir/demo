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
    
const handleOver = (event, placement) => setState({ 
    anchorEl: event.currentTarget,
    placement: placement
});

const handleOut = () => setState({ anchorEl: null });

<div>
    <SpacedContainer>
        <Button onClick={e => handleClick(e, 'top')} variant="contained" >Open Tooltip on TOP</Button>
        <Button onClick={e => handleClick(e, 'bottom')} variant="contained">Open Tooltip on BOTTOM</Button>
        <Button onClick={e => handleClick(e, 'left')} variant="contained">Open Tooltip on LEFT</Button>
        <Button onClick={e => handleClick(e, 'right')} variant="contained">Open Tooltip on RIGHT</Button>
    </SpacedContainer>
    <br />
    <SpacedContainer>
        <Button 
            onMouseOut={handleOut} 
            onMouseOver={e => handleOver(e, 'top')} 
            variant="contained"
            color="secondary"
            >Open Tooltip on TOP (Hover)
        </Button>
        <Button 
            onMouseOut={handleOut} 
            onMouseOver={e => handleOver(e, 'bottom')} 
            variant="contained"
            color="secondary">Open Tooltip on BOTTOM (Hover)
        </Button>
        <Button 
            onMouseOut={handleOut} 
            onMouseOver={e => handleOver(e, 'left')} 
            variant="contained"
            color="secondary">Open Tooltip on LEFT (Hover)
        </Button>  
        <Button 
            onMouseOut={handleOut} 
            onMouseOver={e => handleOver(e, 'right')} 
            variant="contained"
            color="secondary">Open Tooltip on RIGHT (Hover)
        </Button>    
    </SpacedContainer>
     <Tooltip open={!!state.anchorEl} anchorEl={state.anchorEl} placement={state.placement} >
            <TooltipContent>some tooltip text here.</TooltipContent>
    </Tooltip>
</div>
```
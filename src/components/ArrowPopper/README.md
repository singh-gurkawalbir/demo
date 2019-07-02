Default ArrowPopper
```js
const Typography = require('@material-ui/core/Typography').default;
const Button = require('@material-ui/core/Button').default;

initialState = { 
    anchorEl: null, 
    placement: 'bottom' 
};

const handleClick = 
    (event, placement) => setState({ 
        anchorEl: state.anchorEl === event.currentTarget ? null : event.currentTarget,
        placement: placement
    });

<div>
    <Button variant="contained" onClick={e => handleClick(e, 'top')}>Open Popper on TOP</Button>
    <Button variant="contained" onClick={e => handleClick(e, 'bottom')}>Open Popper on BOTTOM</Button>
    <Button variant="contained" onClick={e => handleClick(e, 'left')}>Open Popper on LEFT</Button>
    <Button variant="contained" onClick={e => handleClick(e, 'right')}>Open Popper on RIGHT</Button>

    <ArrowPopper open={!!state.anchorEl} anchorEl={state.anchorEl} placement={state.placement}>
        <Typography>This is the content within the popper</Typography>
        <Typography>This is the content within the popper</Typography>
        <Typography>This is the content within the popper</Typography>
    </ArrowPopper>
</div>
```
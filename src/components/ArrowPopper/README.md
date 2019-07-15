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

const popperStyles = {
    padding: '5px 10px',
    maxWidth: '250px',
};

<div>
    <Button onClick={e => handleClick(e, 'top')}>Open Popper on TOP</Button>
    <Button onClick={e => handleClick(e, 'bottom')}>Open Popper on BOTTOM</Button>
    <br/>
    <Button onClick={e => handleClick(e, 'left')}>Open Popper on LEFT</Button>
    <Button onClick={e => handleClick(e, 'right')}>Open Popper on RIGHT</Button>

    <ArrowPopper open={!!state.anchorEl} anchorEl={state.anchorEl} placement={state.placement} >
        <div style = {popperStyles} >
            <Typography>
            This is the content within the popper This is the content within the popper This is the content within the popper This is the content within the popper This is the content within the popper This is the content within the popper This is the content within the popper</Typography>
        </div>
    </ArrowPopper>
</div>
```
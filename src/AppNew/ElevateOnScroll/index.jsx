import React from 'react';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';

const ElevateOnScroll = React.forwardRef((props, ref) => {
  const { children, threshold } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold,
  });

  return React.cloneElement(children, {
    ref,
    elevation: trigger ? 4 : 0,
  });
});

export default ElevateOnScroll;

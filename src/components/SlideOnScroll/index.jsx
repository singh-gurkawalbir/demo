import React from 'react';
import Slide from '@material-ui/core/Slide';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';

// eslint-disable-next-line react/display-name
const SlideOnScroll = React.forwardRef((props, ref) => {
  const { children, threshold } = props;

  return (
    <Slide
      ref={ref}
      appear={false}
      direction="down"
      in={!useScrollTrigger({ threshold })}>
      {
        children // React.cloneElement(children, { ref })}}
      }
    </Slide>
  );
});

export default SlideOnScroll;

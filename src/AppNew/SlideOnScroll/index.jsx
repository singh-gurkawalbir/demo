import React from 'react';
import Slide from '@material-ui/core/Slide';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';

// eslint-disable-next-line react/display-name
const SlideScroll = React.forwardRef((props, ref) => {
  const { children, threshold } = props;

  return (
    <Slide
      appear={false}
      direction="down"
      in={!useScrollTrigger({ threshold })}>
      {React.cloneElement(children, { ref })}
    </Slide>
  );
});

export default SlideScroll;

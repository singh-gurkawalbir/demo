import React, { useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Tooltip, Zoom } from '@material-ui/core';
import Truncate from 'react-truncate';
import isLoggableAttr from '../../utils/isLoggableAttr';

const useStyles = makeStyles({
  tooltipText: {
    wordWrap: 'break-word',
  },
});

export default function CeligoTruncate({ ellipsis, placement, lines, delay, isLoggable, children }) {
  const classes = useStyles();
  const [isTruncated, setIsTruncated] = useState(false);

  if (isTruncated) {
    return (
      <Tooltip
        title={<span className={classes.tooltipText}>{children}</span>}
        // explicitly setting a prop to null will force React to
        // remove it from the DOM.
        {...isLoggableAttr(isLoggable)}
        TransitionComponent={Zoom}
        placement={placement}
        enterDelay={delay}>
        <Truncate lines={lines} ellipsis={ellipsis} onTruncate={setIsTruncated}>
          {children}
        </Truncate>
      </Tooltip>
    );
  }

  return (
    <Truncate lines={lines} ellipsis={ellipsis} onTruncate={setIsTruncated} {...isLoggableAttr(isLoggable)}>
      {children}
    </Truncate>
  );
}

CeligoTruncate.propTypes = {
  children: PropTypes.element.isRequired,
  ellipsis: PropTypes.string,
  placement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  lines: PropTypes.number,
  delay: PropTypes.number,
  isLoggable: PropTypes.bool,
};

CeligoTruncate.defaultProps = {
  ellipsis: '...',
  placement: 'right',
  lines: 1,
  delay: 500,
  isLoggable: false,
};

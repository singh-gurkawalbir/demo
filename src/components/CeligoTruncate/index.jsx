import React, { useState} from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Zoom } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import TruncateMarkup from 'react-truncate-markup';
import isLoggableAttr from '../../utils/isLoggableAttr';

const useStyles = makeStyles({
  tooltipText: {
    wordWrap: 'break-word',
  },
});

export default function CeligoTruncate({ ellipsis, placement, lines, delay, isLoggable, children, className, disableHoverListener, lineHeight}) {
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
        enterDelay={delay}
        disableHoverListener={disableHoverListener}>
        <span style={{width: '100%'}}>
          <TruncateMarkup lines={lines} ellipsis={ellipsis} className={className} lineHeight={lineHeight}>
            <div>{children}</div>
          </TruncateMarkup>
        </span>
      </Tooltip>
    );
  }

  return (
    <span style={{width: '100%'}}>
      <TruncateMarkup
        lines={lines} ellipsis={ellipsis} onTruncate={setIsTruncated} className={className}
        lineHeight={lineHeight}
        {...isLoggableAttr(isLoggable)}>
        <div>{children}</div>
      </TruncateMarkup>
    </span>
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

import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  dragBar: {
    padding: 8,
    // gridArea: props => props.area,
    // cursor: props => props.orientation === 'vertical' ? 'ew-resize' : 'ns-resize',
    '&:hover > div': {
      borderColor: theme.palette.primary.light,
    },
  },
  line: {
    transition: theme.transitions.create('border-color'),
  },
  verticalLine: {
    width: 1,
    height: '100%',
    borderLeft: `solid 1px ${theme.palette.secondary.lightest}`,
  },
  horizontalLine: {
    width: '100%',
    height: 1,
    borderTop: `solid 1px ${theme.palette.secondary.lightest}`,
  },
}));

export default function DragHandleGridItem(props) {
  const {orientation, onMouseDown} = props;
  const classes = useStyles(props);

  return (
    <div className={classes.dragBar} style={{gridArea: props.area, cursor: props.orientation === 'vertical' ? 'ew-resize' : 'ns-resize'}} onMouseDown={onMouseDown}>
      <div className={clsx(classes.line, classes[`${orientation}Line`])} />
    </div>
  );
}

DragHandleGridItem.propTypes = {
  area: PropTypes.string.isRequired, // should follow pattern: `dragBar_[v|h]_[id]`
  onMouseDown: PropTypes.func.isRequired,
  orientation: PropTypes.oneOf(['vertical', 'horizontal']).isRequired,
};

DragHandleGridItem.defaultProps = {
  orientation: 'vertical',
};

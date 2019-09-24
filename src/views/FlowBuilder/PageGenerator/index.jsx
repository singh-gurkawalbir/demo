import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useDrag } from 'react-dnd';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import itemTypes from '../itemTypes';
import * as selectors from '../../../reducers';

const pgBoxSize = 150;
const useStyles = makeStyles(theme => ({
  pgContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  pgBox: {
    width: pgBoxSize,
    height: pgBoxSize,
    border: 'solid 1px lightblue',
    padding: theme.spacing(1),
    margin: theme.spacing(3, 0),
    cursor: 'move',
  },
  processorActions: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: theme.spacing(0, 1),
  },
  line: {
    borderBottom: `3px dotted ${theme.palette.divider}`,
    width: 50,
  },
  firstLine: {
    position: 'relative',
  },
  connectingLine: {
    top: -(pgBoxSize + theme.spacing(3 * 2)) / 2,
    height: pgBoxSize + theme.spacing(3 * 2),
    position: 'relative',
    borderRight: `3px dotted ${theme.palette.divider}`,
  },
}));
const PageGenerator = ({ index, isLast, ...pg }) => {
  const classes = useStyles();
  const ref = useRef(null);
  const { merged: resource = {} } = useSelector(state =>
    selectors.resourceData(state, 'exports', pg._exportId)
  );
  const [{ isDragging }, drag] = useDrag({
    item: { type: itemTypes.PAGE_GENERATOR, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0.5 : 1;

  drag(ref);

  return (
    <div className={classes.pgContainer}>
      <div ref={ref} className={classes.pgBox} style={{ opacity }}>
        <Typography variant="h2">{resource.name || resource.id}</Typography>
      </div>
      <div
        className={clsx(classes.line, {
          [classes.firstLine]: index === 0,
          [classes.connectingLine]: index > 0,
        })}
      />
    </div>
  );
};

export default PageGenerator;

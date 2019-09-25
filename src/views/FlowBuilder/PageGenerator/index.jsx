import { useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { useDrag } from 'react-dnd';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import itemTypes from '../itemTypes';
import AppBlock from '../AppBlock';

const pgBoxHeight = 100;
const useStyles = makeStyles(theme => ({
  pgContainer: {
    display: 'flex',
    alignItems: 'center',
    // marginBottom: theme.spacing(3),
  },
  line: {
    borderBottom: `3px dotted ${theme.palette.divider}`,
    width: 50,
  },
  firstLine: {
    position: 'relative',
  },
  connectingLine: {
    top: -(pgBoxHeight + theme.spacing(5 * 2)) / 2,
    height: pgBoxHeight + theme.spacing(5 * 2),
    position: 'relative',
    borderRight: `3px dotted ${theme.palette.divider}`,
  },
}));
const PageGenerator = ({ location, history, match, index, isLast, ...pg }) => {
  const classes = useStyles();
  const ref = useRef(null);
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
      <AppBlock
        match={match}
        history={history}
        ref={ref}
        resourceType="exports"
        resourceId={pg._exportId}
        opacity={opacity}
      />
      <div
        className={clsx(classes.line, {
          [classes.firstLine]: index === 0,
          [classes.connectingLine]: index > 0,
        })}
      />
    </div>
  );
};

export default withRouter(PageGenerator);

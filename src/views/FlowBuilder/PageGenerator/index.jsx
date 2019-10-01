import { useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { useDrag } from 'react-dnd-cjs';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import itemTypes from '../itemTypes';
import CalendarIcon from '../../../components/icons/CalendarIcon';
import TransformIcon from '../../../components/icons/TransformIcon';
import FilterIcon from '../../../components/icons/FilterIcon';
import HookIcon from '../../../components/icons/HookIcon';
import AppBlock from '../AppBlock';
import RightActions from '../AppBlock/RightActions';
import BottomActions from '../AppBlock/BottomActions';

/* the 'block' consts in this file and <AppBlock> should eventually go in the theme. 
   We the block consts across several components and thus is a maintenance issue to 
   manage as we enhance the FB layout. */
const blockHeight = 100;
const lineHeightOffset = 96;
const lineWidth = 1;
const useStyles = makeStyles(theme => ({
  pgContainer: {
    display: 'flex',
    alignItems: 'center',
    // marginBottom: theme.spacing(3),
  },
  line: {
    borderBottom: `3px dotted ${theme.palette.divider}`,
    width: lineWidth,
    marginTop: -theme.spacing(4),
  },
  firstLine: {
    position: 'relative',
  },
  connectingLine: {
    marginTop: -240,
    height: blockHeight + lineHeightOffset,
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
        ref={ref} /* ref is for drag and drop binding */
        resourceType="exports"
        resourceId={pg._exportId}
        opacity={opacity}>
        <RightActions>
          <IconButton>
            <TransformIcon />
          </IconButton>
          <IconButton>
            <FilterIcon />
          </IconButton>
          <IconButton>
            <HookIcon />
          </IconButton>
        </RightActions>
        <BottomActions>
          <IconButton>
            <CalendarIcon />
          </IconButton>
        </BottomActions>
      </AppBlock>
      <div
        /* -- connecting line */
        className={clsx({
          [classes.line]: index > 0,
          [classes.connectingLine]: index > 0,
        })}
      />
    </div>
  );
};

export default withRouter(PageGenerator);

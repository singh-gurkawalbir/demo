import { useRef } from 'react';
import { useSelector } from 'react-redux';
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
import * as selectors from '../../../reducers';

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
  const pending = !!pg._connectionId;
  const resourceType = pending ? 'connections' : 'exports';
  const resourceId = pg._exportId || pg._connectionId;
  const classes = useStyles();
  const { merged: resource = {} } = useSelector(state =>
    selectors.resourceData(state, resourceType, resourceId)
  );
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    item: { type: itemTypes.PAGE_GENERATOR, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0.5 : 1;

  function handleBlockClick() {
    const to = `${match.url}/edit/exports/${pg._exportId}`;

    if (pending) {
      // generate newId
      // patch it with the connectionId
      // re-assign "to"
    }

    if (match.isExact) {
      history.push(to);
    } else {
      history.replace(to);
    }
  }

  drag(ref);

  return (
    <div className={classes.pgContainer}>
      <AppBlock
        name={pending ? 'Pending configuration' : resource.name || resource.id}
        onBlockClick={handleBlockClick}
        connectorType={resource.adaptorType || resource.type}
        assistant={resource.assistant}
        ref={ref} /* ref is for drag and drop binding */
        blockType="export"
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

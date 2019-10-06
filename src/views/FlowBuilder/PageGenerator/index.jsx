import { useRef, Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useDrag } from 'react-dnd-cjs';
import shortid from 'shortid';
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
import actions from '../../../actions';
import applications from '../../../constants/applications';
import { getResourceSubType } from '../../../utils/resource';

/* the 'block' consts in this file and <AppBlock> should eventually go in the theme. 
   We the block consts across several components and thus is a maintenance issue to 
   manage as we enhance the FB layout. */
const blockHeight = 100;
const lineHeightOffset = 104;
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
    marginTop: -248,
    height: blockHeight + lineHeightOffset,
    position: 'relative',
    borderRight: `3px dotted ${theme.palette.divider}`,
  },
}));
const PageGenerator = ({ history, match, index, isLast, flowId, ...pg }) => {
  const pending = !pg._exportId;
  const resourceId = pg._connectionId || pg._exportId;
  const resourceType = pg._connectionId ? 'connections' : 'exports';
  const classes = useStyles();
  const dispatch = useDispatch();
  const [newGeneratorId, setNewGeneratorId] = useState(null);
  const { merged: resource = {} } = useSelector(state =>
    !resourceId ? {} : selectors.resourceData(state, resourceType, resourceId)
  );
  const createdGeneratorId = useSelector(state =>
    selectors.createdResourceId(state, newGeneratorId)
  );

  // #region Add Generator on creation effect
  useEffect(() => {
    if (createdGeneratorId) {
      const patchSet = [
        {
          op: 'replace',
          path: `/pageGenerators/${index}`,
          value: { _exportId: createdGeneratorId },
        },
      ];

      dispatch(actions.resource.patchStaged(flowId, patchSet, 'value'));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdGeneratorId, dispatch]);
  // #endregion
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    item: { type: itemTypes.PAGE_GENERATOR, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0.5 : 1;

  function handleBlockClick() {
    const newId = `new-${shortid.generate()}`;

    if (pending) {
      // generate newId
      setNewGeneratorId(newId);
      const { type, assistant } = getResourceSubType(resource);
      const application = pg.application || assistant || type;
      const patchSet = [
        {
          op: 'add',
          path: '/application',
          value: application,
        },
      ];

      if (pg.webhookOnly && pg.application !== 'webhook') {
        patchSet.push({ op: 'add', path: '/type', value: 'webhook' });
      }

      // patch it with the connectionId
      if (pg._connectionId) {
        patchSet.push({
          op: 'add',
          path: '/_connectionId',
          value: pg._connectionId,
        });
      }

      // console.log('patchSet: ', patchSet);

      dispatch(actions.resource.patchStaged(newId, patchSet, 'value'));
    }

    const to = pending
      ? `${match.url}/add/exports/${newId}`
      : `${match.url}/edit/exports/${pg._exportId}`;

    if (match.isExact) {
      history.push(to);
    } else {
      history.replace(to);
    }
  }

  function getApplication() {
    if (!pending || resourceId) {
      // even if we have a pending PG, as ling as we have a
      // resource, then the below logic still applies.
      return {
        connectorType: resource.adaptorType,
        assistant: resource.assistant,
        blockType:
          resource.adaptorType === 'WebhookExport' ? 'listener' : 'export',
      };
    }

    const app = applications.find(a => a.id === pg.application) || {};

    return {
      connectorType: app.type,
      assistant: app.assistant,
      blockType:
        pg.webhookOnly || resource.type === 'webhook' ? 'listener' : 'export',
    };
  }

  const blockName = pending
    ? 'Pending configuration'
    : resource.name || resource.id;
  const { connectorType, assistant, blockType } = getApplication();

  drag(ref);

  return (
    <div className={classes.pgContainer}>
      <AppBlock
        name={blockName}
        onBlockClick={handleBlockClick}
        connectorType={connectorType}
        assistant={assistant}
        ref={ref} /* ref is for drag and drop binding */
        blockType={blockType}
        opacity={opacity}>
        <RightActions>
          {!pending && (
            <Fragment>
              <IconButton>
                <TransformIcon data-test="transform" />
              </IconButton>
              <IconButton data-test="filter">
                <FilterIcon />
              </IconButton>
              <IconButton data-test="hooks">
                <HookIcon />
              </IconButton>
            </Fragment>
          )}
        </RightActions>
        <BottomActions>
          {!pending && (
            <IconButton>
              <CalendarIcon data-test="calendar" />
            </IconButton>
          )}
        </BottomActions>
      </AppBlock>
      <div
        /* -- connecting line */
        className={clsx({
          [classes.line]: index > 0,
          [classes.connectingLine]: index > 0 && !pending,
        })}
      />
    </div>
  );
};

export default withRouter(PageGenerator);

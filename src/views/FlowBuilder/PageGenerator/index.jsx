import { useRef, Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useDrag } from 'react-dnd-cjs';
import shortid from 'shortid';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import itemTypes from '../itemTypes';
import EllipsisIcon from '../../../components/icons/EllipsisHorizontalIcon';
import AppBlock from '../AppBlock';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import applications from '../../../constants/applications';
import { getResourceSubType } from '../../../utils/resource';
import exportHooksAction from './actions/exportHooks';
import transformationAction from './actions/transformation';
import scheduleAction from './actions/schedule';
import exportFilterAction from './actions/exportFilter';
import ActionIconButton from '../ActionIconButton';

/* the 'block' consts in this file and <AppBlock> should eventually go in the theme. 
   We the block consts across several components and thus is a maintenance issue to 
   manage as we enhance the FB layout. */
const blockHeight = 120;
const lineHeightOffset = 64;
const lineWidth = 130;
const useStyles = makeStyles(theme => ({
  pgContainer: {
    display: 'flex',
    alignItems: 'center',
    // marginBottom: theme.spacing(3),
  },
  line: {
    borderBottom: `3px dotted ${theme.palette.divider}`,
    width: lineWidth,
    marginTop: -theme.spacing(3) - 1,
  },
  firstLine: {
    position: 'relative',
  },
  connectingLine: {
    marginTop: -208,
    height: blockHeight + lineHeightOffset,
    borderRight: `3px dotted ${theme.palette.divider}`,
  },
  isNotOverActions: {
    top: 68,
    left: 116,
  },
}));
const PageGenerator = ({ history, match, index, isLast, flowId, ...pg }) => {
  const pending = !pg._exportId;
  const resourceId = pg._connectionId || pg._exportId;
  const resourceType = pg._connectionId ? 'connections' : 'exports';
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isOver, setIsOver] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
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

  let generatorActions = [];

  if (!pending) {
    if (blockType === 'export' && !pending) {
      generatorActions = [scheduleAction];
    }

    generatorActions = [
      ...generatorActions,
      transformationAction,
      exportHooksAction,
      exportFilterAction,
    ];
  }

  return (
    <div className={classes.pgContainer}>
      <AppBlock
        onMouseOver={() => setIsOver(true)}
        onMouseOut={() => setIsOver(false)}
        onFocus={() => setIsOver(true)}
        onBlur={() => setIsOver(false)}
        name={blockName}
        onBlockClick={handleBlockClick}
        connectorType={connectorType}
        assistant={assistant}
        ref={ref} /* ref is for drag and drop binding */
        blockType={blockType}
        opacity={opacity}>
        {generatorActions.map(a => (
          <Fragment key={a.name}>
            <ActionIconButton
              helpText={a.helpText}
              className={clsx({
                [classes.isNotOverActions]: !isOver,
              })}
              style={isOver ? { left: a.left, top: a.top } : undefined}
              onClick={() => setActiveAction(a.name)}
              data-test={a.name}>
              <a.Icon />
            </ActionIconButton>
            <a.Component
              open={activeAction === a.name}
              flowId={flowId}
              resourceId={resourceId}
              onClose={() => setActiveAction(null)}
            />
          </Fragment>
        ))}
        {!isOver && generatorActions.length > 0 && (
          <ActionIconButton className={classes.isNotOverActions}>
            <EllipsisIcon />
          </ActionIconButton>
        )}
      </AppBlock>
      <div
        /* -- connecting line */
        className={clsx({
          [classes.line]: !pending,
          [classes.connectingLine]: index > 0 && !pending,
        })}
      />
    </div>
  );
};

export default withRouter(PageGenerator);

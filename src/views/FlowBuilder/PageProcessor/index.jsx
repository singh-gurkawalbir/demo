import React, { useMemo, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { withRouter } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import AppBlock from '../AppBlock';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import IconBlock from '../IconBlock';
import SubFlowBlock from '../SubFlowBlock';
import { getResourceSubType, resourceCategory} from '../../../utils/resource';
import importMappingAction from './actions/importMapping';
import inputFilterAction from './actions/inputFilter_afe';
import pageProcessorHooksAction from './actions/pageProcessorHooks';
import outputFilterAction from './actions/outputFilter_afe';
import lookupTransformationAction from './actions/lookupTransformation_afe';
import responseMapping from './actions/responseMapping_afe';
import postResponseMapHook from './actions/postResponseMapHook_afe';
import responseTransformationAction from './actions/responseTransformation_afe';
import proceedOnFailureAction from './actions/proceedOnFailure';
import { actionsMap, isImportMappingAvailable } from '../../../utils/flows';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';

const useStyles = makeStyles({
  ppContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  pending: {
    minWidth: 50,
  },
});
const PageProcessor = ({
  match,
  location,
  history,
  flowId,
  index,
  isLast,
  showLeft,
  showRight,
  integrationId,
  isViewMode,
  isMonitorLevelAccess,
  onDelete,
  onMove,
  isSubFlow,
  openErrorCount,
  ...pp
}) => {
  const pending = pp.setupInProgress || (!pp._exportId && !pp._importId);
  const resourceId = pp._connectionId || pp._exportId || pp._importId;
  const resourceType = pp.type === 'export' ? 'exports' : 'imports';
  const classes = useStyles();
  const dispatch = useDispatch();
  const isSubFlowView = useSelector(state =>
    selectors.fbSubFlowView(state, flowId)
  );
  const resource =
    useSelector(state =>
      selectors.resource(
        state,
        pending ? 'connections' : resourceType,
        resourceId
      )
    ) || {};
  const flowDetails = useSelectorMemo(selectors.mkFlowDetails, flowId);
  const rdbmsAppType = useSelector(
    state => pending && selectors.rdbmsConnectionType(state, pp._connectionId)
  );
  const isIconView = useSelector(state =>
    selectors.fbIconview(state, flowId) === 'icon'
  );
  const isDataLoaderFlow = useSelector(state => selectors.isDataLoaderFlow(state, flowId));
  const pendingBlockType = isDataLoaderFlow ? 'newImport' : 'newPP';
  const blockType = pending ? pendingBlockType : resourceCategory(resource, !!pp._exportId, !!pp._importId);

  const showMapping = flowDetails._connectorId ? flowDetails.showMapping : true;

  // Returns map of all possible actions with true/false whether actions performed on the resource
  const usedActions =
    useSelector(
      state =>
        selectors.getUsedActionsForResource(
          state,
          resourceId,
          resourceType,
          pp
        ),
      shallowEqual
    ) || {};

  const handleBlockClick = useCallback(() => {
    if (pending) {
      // generate newId

      const { type, assistant } = getResourceSubType(resource);
      const application = assistant || type;
      const patchSet = [
        {
          op: 'add',
          path: '/application',
          value: application,
        },
        {
          op: 'add',
          path: '/resourceType',
          value: resourceType,
        },
        {
          op: 'add',
          path: '/_connectionId',
          value: pp._connectionId,
        },
        // rdbmsAppType refers to specific rdbms application inferred from connection of pending pp
        // used to populate the same when user opens resource form
        //
        {
          op: 'add',
          path: '/rdbmsAppType',
          value: rdbmsAppType,
        },
      ];

      dispatch(actions.flow.addNewPPStepInfo(flowId, {branchPath: `/routers/${pp.routerIndex}/branches/${pp.branchIndex}`, processorIndex: index}));
      dispatch(actions.resource.patchStaged(pp.id, patchSet));
    }

    const to = pending
      ? buildDrawerUrl({
        path: drawerPaths.RESOURCE.ADD,
        baseUrl: match.url,
        params: { resourceType: 'pageProcessor', id: pp.id },
      })
      : buildDrawerUrl({
        path: drawerPaths.RESOURCE.EDIT,
        baseUrl: match.url,
        params: { resourceType, id: resourceId },
      });

    if (match.isExact) {
      history.push(to);
    } else {
      history.replace(to);
    }
  }, [pending, match.url, match.isExact, pp.id, pp._connectionId, pp.routerIndex, pp.branchIndex, resourceType, resourceId, resource, rdbmsAppType, dispatch, flowId, index, history]);
  // #region Configure available processor actions
  // Add Help texts for actions common to lookups and imports manually
  const processorActions = useMemo(() => {
    const processorActions = [
      {
        ...inputFilterAction,
        isUsed: usedActions[actionsMap.inputFilter],
        helpKey: 'fb.pp.inputFilter',
      },
    ];

    if (!pending) {
      if (pp.type === 'export') {
        processorActions.push(
          {
            ...lookupTransformationAction,
            isUsed: usedActions[actionsMap.transformation],
          },
          {
            ...outputFilterAction,
            isUsed: usedActions[actionsMap.outputFilter],
          },
          {
            ...pageProcessorHooksAction,
            isUsed: usedActions[actionsMap.hooks],
            helpKey: 'fb.pp.exports.hooks',
          }
        );
      } else {
        processorActions.push(
          ...((isImportMappingAvailable(resource) && showMapping)
            ? [
              {
                ...importMappingAction,
                isUsed: usedActions[actionsMap.importMapping],
              },
            ]
            : []),
          ...(!isLast
            ? [
              {
                ...responseTransformationAction,
                isUsed: usedActions[actionsMap.responseTransformation],
              },
            ]
            : []),
          {
            ...pageProcessorHooksAction,
            isUsed: usedActions[actionsMap.hooks],
            helpKey: 'fb.pp.imports.hooks',
          }
        );
      }

      if (!isLast) {
        processorActions.push(
          ...(showMapping ? [{
            ...responseMapping,
            isUsed: usedActions[actionsMap.responseMapping],
            helpKey: `fb.pp.${resourceType}.responseMapping`,
          }] : []),
          {
            ...postResponseMapHook,
            isUsed: usedActions[actionsMap.postResponseMap],
            helpKey: `fb.pp.${resourceType}.postResponseMap`,
          },
          {
            ...proceedOnFailureAction,
            isUsed: usedActions[actionsMap.proceedOnFailure],
            helpKey: `fb.pp.${resourceType}.proceedOnFailure`,
          }
        );
      }
    }

    return processorActions;
  }, [isLast, pending, pp.type, resource, resourceType, showMapping, usedActions]);
  // #endregion

  const name = pending ? '' : resource.name || resource.id;

  // eslint-disable-next-line no-nested-ternary
  const Component = (isSubFlow && isSubFlowView) ? SubFlowBlock : (isIconView ? IconBlock : AppBlock);

  return (
    <>
      <div className={classes.ppContainer} >
        <Component
          {...pp}
          integrationId={integrationId}
          name={name}
          isSubFlow={isSubFlow}
          onDelete={onDelete}
          openErrorCount={openErrorCount}
          isViewMode={isViewMode}
          isMonitorLevelAccess={isMonitorLevelAccess}
          onBlockClick={handleBlockClick}
          connectorType={resource.adaptorType || resource.type}
          assistant={resource.assistant}
          blockType={blockType}
          flowId={flowId}
          index={index}
          id={pp.id}
          showLeft={showLeft}
          showRight={showRight}
          resource={resource}
          resourceId={resourceId}
          resourceIndex={index}
          resourceType={resourceType}
          actions={processorActions}
          routerIndex={pp.routerIndex}
          branchIndex={pp.branchIndex}
          pageProcessorIndex={pp.pageProcessorIndex}
        />
      </div>
    </>
  );
};

export default withRouter(PageProcessor);

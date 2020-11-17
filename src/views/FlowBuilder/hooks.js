import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import actions from '../../actions';
import useConfirmDialog from '../../components/ConfirmDialog';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../reducers';
import { generateNewId } from '../../utils/resource';
import itemTypes from './itemTypes';

export const isNewFlowFn = flowId => !flowId || flowId?.startsWith('new');
export const usePatchFlow = flowId => {
  const dispatch = useDispatch();

  const isNewFlow = isNewFlowFn(flowId);

  const patchFlow = useCallback(
    (path, value) => {
      const patchSet = [{ op: 'replace', path, value }];

      dispatch(actions.resource.patchStaged(flowId, patchSet, 'value'));
      dispatch(actions.resource.commitStaged('flows', flowId, 'value'));

      if (!isNewFlow) {
        dispatch(actions.flowData.updateFlow(flowId));
      }
    },
    [dispatch, flowId, isNewFlow]
  );

  return patchFlow;
};
export const useHandleDelete = flowId => {
  const { confirmDialog } = useConfirmDialog();
  const flow = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  ).merged;

  const patchFlow = usePatchFlow(flowId);
  const { pageProcessors = [], pageGenerators = [] } = flow;
  const handleDelete = useCallback(
    type => () => index => {
      confirmDialog({
        title: 'Confirm remove',
        message: 'Are you sure you want to remove this resource?',
        buttons: [
          {
            label: 'Remove',
            color: 'primary',
            onClick: () => {
              if (type === itemTypes.PAGE_PROCESSOR) {
                const newOrder = [...pageProcessors];

                newOrder.splice(index, 1);
                patchFlow('/pageProcessors', newOrder);
              }

              if (type === itemTypes.PAGE_GENERATOR) {
                const newOrder = [...pageGenerators];

                newOrder.splice(index, 1);
                patchFlow('/pageGenerators', newOrder);
              }
            },
          },
          {
            label: 'Cancel',
            color: 'secondary',
          },
        ],
      });
    },
    [pageGenerators, pageProcessors, patchFlow, confirmDialog]
  );

  return handleDelete;
};

export const useHandleMovePP = flowId => {
  const patchFlow = usePatchFlow(flowId);
  const flow = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  ).merged;

  const { pageProcessors = [] } = flow;
  const handleMovePP = useCallback(
    (dragIndex, hoverIndex) => {
      const dragItem = pageProcessors[dragIndex];
      const newOrder = [...pageProcessors];

      newOrder.splice(dragIndex, 1);
      newOrder.splice(hoverIndex, 0, dragItem);
      patchFlow('/pageProcessors', newOrder);
    },
    [pageProcessors, patchFlow]
  );

  return handleMovePP;
};

export const useHandleMovePG = flowId => {
  const patchFlow = usePatchFlow(flowId);
  const flow = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  ).merged;

  const { pageGenerators = [] } = flow;
  const handleMovePG = useCallback(
    (dragIndex, hoverIndex) => {
      const dragItem = pageGenerators[dragIndex];
      const newOrder = [...pageGenerators];

      newOrder.splice(dragIndex, 1);
      newOrder.splice(hoverIndex, 0, dragItem);
      patchFlow('/pageGenerators', newOrder);
    },
    [pageGenerators, patchFlow]
  );

  return handleMovePG;
};

export const usePushOrReplaceHistory = () => {
  const match = useRouteMatch();
  const history = useHistory();

  const pushOrReplaceHistory = useCallback(
    to => {
      if (match.isExact) {
        history.push(to);
      } else {
        history.replace(to);
      }
    },
    [history, match.isExact]
  );

  return pushOrReplaceHistory;
};

export const usePatchNewFlow = integrationId => {
  const dispatch = useDispatch();

  const patchNewFlow = useCallback(
    (newFlowId, newName, newPG) => {
      const startDisabled = !newPG || newPG.application !== 'dataLoader';
      const patchSet = [
        { op: 'add', path: '/name', value: newName || 'New flow' },
        { op: 'add', path: '/pageGenerators', value: newPG ? [newPG] : [] },
        { op: 'add', path: '/pageProcessors', value: [] },
        { op: 'add', path: '/disabled', value: startDisabled },
      ];

      if (integrationId && integrationId !== 'none') {
        patchSet.push({
          op: 'add',
          path: '/_integrationId',
          value: integrationId,
        });
      }

      dispatch(actions.resource.patchStaged(newFlowId, patchSet, 'value'));
    },
    [dispatch, integrationId]
  );

  return patchNewFlow;
};
export const useHandleExitClick = () => {
  const history = useHistory();
  const location = useLocation();

  const handleExitClick = useCallback(() => {
    // Note that our App init must do some internal redirects since
    // a new browser tab session always has a history depth of 2!
    // if depth is more than 2, we are safe to just go back in the history queue.
    if (history.length > 2) {
      return history.goBack();
    }

    // Otherwise parse the location and return the user to the integration
    // details page.
    const parts = location.pathname.split('/');

    if (parts[1].toLowerCase() === 'integrationapps') {
      // if user is editing an IA flow, the url is 1 segment longer.
      return history.push(parts.slice(0, 4).join('/'));
    }

    return history.push(parts.slice(0, 3).join('/'));
  }, [history, location]);

  return handleExitClick;
};

export function useHandleAddGenerator() {
  const match = useRouteMatch();
  const pushOrReplaceHistory = usePushOrReplaceHistory();
  const handleAddGenerator = useCallback(() => {
    const newTempGeneratorId = generateNewId();

    pushOrReplaceHistory(
      `${match.url}/add/pageGenerator/${newTempGeneratorId}`
    );
  }, [match.url, pushOrReplaceHistory]);

  return handleAddGenerator;
}

export function useHandleAddProcessor() {
  const match = useRouteMatch();
  const pushOrReplaceHistory = usePushOrReplaceHistory();

  const handleAddProcessor = useCallback(() => {
    const newTempProcessorId = generateNewId();

    pushOrReplaceHistory(
      `${match.url}/add/pageProcessor/${newTempProcessorId}`
    );
  }, [match.url, pushOrReplaceHistory]);

  return handleAddProcessor;
}

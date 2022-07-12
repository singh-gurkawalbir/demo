import React from 'react';
import { useStore } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import TextButton from '../../../../components/Buttons/TextButton';
import useShowDebugTools from '../../../../hooks/useShowDebugTools';

const useStyles = makeStyles(() => ({
  button: {
    position: 'absolute',
    zIndex: 1300,
    left: 50,
    bottom: 10,
  },
}));

function getResourceIds(flow) {
  let exportIds = [];
  const importIds = [];
  const visitedRouters = {};

  if (flow && flow.routers && flow.routers.length) {
    exportIds = flow.pageGenerators.map(pg => pg._exportId);
    const routerId = flow.routers[0].id;

    const routerStepsCount = routerId => {
      const router = flow.routers.find(r => r.id === routerId);

      if (router && !visitedRouters[routerId]) {
        visitedRouters[routerId] = true;

        (router.branches || []).forEach(branch => {
          (branch.pageProcessors || []).forEach(pp => {
            if (pp._exportId) exportIds.push(pp._exportId);
            if (pp._importId) importIds.push(pp._importId);
          });

          if (branch.nextRouterId) {
            routerStepsCount(branch.nextRouterId);
          }
        });
      }
    };

    routerStepsCount(routerId);
  }

  return {exportIds, importIds};
}

// Logs all resources related to current flow in a redux state slice format so a story can be easily created in storybook to debug issues.
export function ExportFlowStateButton({flowId}) {
  const classes = useStyles();
  const store = useStore();
  const showButton = useShowDebugTools();

  const handleClick = () => {
    const state = store.getState();
    const flow = state.session.flowbuilder[flowId]?.flow;
    const {exportIds, importIds} = getResourceIds(flow);
    const allExports = state.data.resources.exports;
    const allImports = state.data.resources.imports;
    const exports = allExports.filter(e => exportIds.includes(e._id));
    const imports = allImports.filter(i => importIds.includes(i._id));

    // console.log(exportIds, importIds, allExports, allImports);
    // eslint-disable-next-line no-console
    console.log({flows: [flow], exports, imports});
  };

  return showButton && (
    <TextButton className={classes.button} onClick={handleClick}>
      Export flow state
    </TextButton>
  );
}


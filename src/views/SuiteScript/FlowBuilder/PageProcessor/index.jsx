import React, { useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import AppBlock from '../AppBlock';
import * as selectors from '../../../../reducers';

const useStyles = makeStyles(theme => ({
  ppContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  lineRight: {
    minWidth: 130,
  },
  lineLeft: {
    minWidth: 50,
  },
  dottedLine: {
    alignSelf: 'start',
    marginTop: 84,
    borderBottom: `3px dotted ${theme.palette.divider}`,
  },
  pending: {
    minWidth: 50,
  },
}));
const PageProcessor = ({ history, match }) => {
  const { flowId, ssLinkedConnectionId } = match.params;
  const classes = useStyles();
  const resource = useSelector(state =>
    selectors.suiteScriptResource(state, {
      resourceType: 'flows',
      id: flowId,
      ssLinkedConnectionId,
    })
  );
  const handleBlockClick = useCallback(() => {
    const to = `${match.url}/edit/imports/${flowId}`;

    if (match.isExact) {
      history.push(to);
    } else {
      history.replace(to);
    }
  }, [flowId, history, match.isExact, match.url]);

  return (
    <div className={classes.ppContainer}>
      {/* Initial left line connecting Source Apps */}
      <div className={clsx(classes.dottedLine, classes.lineLeft)} />
      <AppBlock
        blockType="import"
        onBlockClick={handleBlockClick}
        resource={resource}
      />
    </div>
  );
};

export default withRouter(PageProcessor);

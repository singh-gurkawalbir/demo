import React, { useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector } from 'react-redux';
import AppBlock from '../AppBlock';
import { selectors } from '../../../../reducers';

const useStyles = makeStyles({
  pgContainer: {
    display: 'flex',
    alignItems: 'center',
    // marginBottom: theme.spacing(3),
  },
});
const PageGenerator = ({ history, match }) => {
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
    const to = `${match.url}/edit/exports/${flowId}`;

    if (match.isExact) {
      history.push(to);
    } else {
      history.replace(to);
    }
  }, [flowId, history, match.isExact, match.url]);

  return (
    <div className={classes.pgContainer}>
      <AppBlock
        blockType="export"
        onBlockClick={handleBlockClick}
        resource={resource}
      />
    </div>
  );
};

export default withRouter(PageGenerator);

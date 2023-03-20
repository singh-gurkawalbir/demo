import React, { useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { formatErrorDetails } from '../../../../utils/errorManagement';
import CodeEditor from '../../../CodeEditor';
import { selectors } from '../../../../reducers';

const useStyles = makeStyles(() => ({
  container: {
    flexGrow: 1,
  },
}));

export default function ViewErrorDetails({ flowId, resourceId, errorId, isResolved }) {
  const classes = useStyles();
  const errorDoc = useSelector(
    state => selectors.resourceError(state, {
      flowId,
      resourceId,
      errorId,
      isResolved,
    }) || {},
    shallowEqual
  );
  const errorDetails = useMemo(() => formatErrorDetails(errorDoc), [errorDoc]);

  return (
    <div className={classes.container} data-private >
      <CodeEditor
        value={errorDetails}
        mode="text"
        readOnly
        showGutter={false}
    />
    </div>
  );
}

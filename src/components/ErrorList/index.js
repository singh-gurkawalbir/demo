import { useState, Fragment } from 'react';
import { useRouteMatch } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import OpenErrors from './OpenErrors';
import ResolvedErrors from './ResolvedErrors';

const useStyles = makeStyles(() => ({
  errorType: {
    float: 'right',
    position: 'relative',
    bottom: '60px',
    right: '100px',
  },
}));

export default function ErrorList({ flowId }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const { resourceId } = match.params;
  const [isResolvedErrorType, setIsResolvedErrorType] = useState(false);

  return (
    <Fragment>
      <Button
        onClick={() => setIsResolvedErrorType(!isResolvedErrorType)}
        className={classes.errorType}>
        {isResolvedErrorType ? 'View Open Errors' : 'View Resolved History'}
      </Button>
      {!isResolvedErrorType ? (
        <OpenErrors flowId={flowId} resourceId={resourceId} />
      ) : (
        <ResolvedErrors flowId={flowId} resourceId={resourceId} />
      )}
    </Fragment>
  );
}

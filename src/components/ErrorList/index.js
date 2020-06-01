import { useState, Fragment, useCallback } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import TextToggle from '../../components/TextToggle';
import OpenErrors from './OpenErrors';
import ResolvedErrors from './ResolvedErrors';

const useStyles = makeStyles(theme => ({
  errorTypeToggle: {
    float: 'right',
    position: 'relative',
    bottom: '60px',
    right: '100px',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
}));

export default function ErrorList({ flowId }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const { resourceId } = match.params;
  const [errorType, setErrorType] = useState('open');
  const errorTypes = [
    { label: 'View open errors', value: 'open' },
    { label: 'View resolved errors', value: 'resolved' },
  ];
  const handleErrorTypeChange = useCallback(() => {
    setErrorType(errorType === 'open' ? 'resolved' : 'open');
  }, [errorType]);

  return (
    <Fragment>
      <TextToggle
        value={errorType}
        className={classes.errorTypeToggle}
        onChange={handleErrorTypeChange}
        exclusive
        options={errorTypes}
      />
      <OpenErrors
        flowId={flowId}
        resourceId={resourceId}
        show={errorType === 'open'}
      />
      <ResolvedErrors
        flowId={flowId}
        resourceId={resourceId}
        show={errorType === 'resolved'}
      />
    </Fragment>
  );
}

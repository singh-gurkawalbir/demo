// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@mui/styles';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../actions';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';
import { selectors } from '../../../../reducers';
import DynaSubmit from '../../DynaSubmit';
import MaterialUiTextField from '../DynaText';

const useStyles = makeStyles(theme => ({
  dynaTokenWrapper: {
    flexDirection: 'row !important',
  },
  dynaTokenField: {
    flex: 1,
  },
  dynaTokenbtn: {
    marginBottom: theme.spacing(2),
  },
}));

function GenerateTokenButton(props) {
  const { disabled, label, id, resourceId, formKey} = props;
  const dispatch = useDispatch();
  const tokenRequestLoading = useSelector(state =>
    selectors.tokenRequestLoading(state, resourceId)
  );

  const handleRequestToken = useCallback(
    (resourceId, fieldId) => values => {
      dispatch(
        actions.resource.connections.requestToken(resourceId, fieldId, values)
      );
    },
    [dispatch]
  );

  return (
    <DynaSubmit
      formKey={formKey}
      variant="outlined"
      color="secondary"
      data-test={id}
      disabled={disabled || tokenRequestLoading}
      isValid
      onClick={handleRequestToken(resourceId, id)}>
      {tokenRequestLoading ? 'Generating token...' : label}
    </DynaSubmit>
  );
}

export default function TokenGenerator(props) {
  const {
    onFieldChange,
    resourceId,
    inputboxLabel,
    label,
  } = props;
  const dispatch = useDispatch();

  const connectionToken =
   useSelector(state => selectors.connectionTokens(state, resourceId));
  const handleClearToken = useCallback(
    resourceId => {
      dispatch(actions.resource.connections.clearToken(resourceId));
    },
    [dispatch]
  );

  const { fieldsToBeSetWithValues, message } = connectionToken || {};
  const classes = useStyles();
  const [enquesnackbar] = useEnqueueSnackbar();

  useEffect(() => {
    if (fieldsToBeSetWithValues) {
      Object.keys(fieldsToBeSetWithValues).forEach(key =>
        onFieldChange(key, fieldsToBeSetWithValues[key], true)
      );

      handleClearToken(resourceId);
    }
  }, [fieldsToBeSetWithValues, handleClearToken, onFieldChange, resourceId]);

  useEffect(() => {
    if (message) {
      enquesnackbar({ message, variant: 'error' });
      handleClearToken(resourceId);
    }
  }, [enquesnackbar, handleClearToken, message, resourceId]);

  return (
    <div className={classes.dynaTokenWrapper}>
      <div className={classes.dynaTokenbtn}>
        <GenerateTokenButton {...props} className={classes.children} />
      </div>
      <div className={classes.dynaTokenField}>
        <MaterialUiTextField
          {...props} label={inputboxLabel || label} disabled={false} required
          isLoggable={false} />
      </div>
    </div>
  );
}


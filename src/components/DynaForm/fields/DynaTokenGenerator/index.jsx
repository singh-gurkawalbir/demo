import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import DynaSubmit from '../../DynaSubmit';
import MaterialUiTextField from '../DynaText';

const mapStateToProps = (state, { resourceId }) => ({
  connectionToken: selectors.connectionTokens(state, resourceId),
});
const mapDispatchToProps = dispatch => ({
  handleRequestToken: (resourceId, fieldId) => values => {
    dispatch(
      actions.resource.connections.requestToken(resourceId, fieldId, values)
    );
  },
  handleClearToken: resourceId =>
    dispatch(actions.resource.connections.clearToken(resourceId)),
});
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
  const { handleRequestToken, disabled, label, id, resourceId, formKey} = props;
  const tokenRequestLoading = useSelector(state =>
    selectors.tokenRequestLoading(state, resourceId)
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

function TokenGenerator(props) {
  const {
    onFieldChange,
    connectionToken,
    handleClearToken,
    resourceId,
    inputboxLabel,
    label,
  } = props;
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
        <MaterialUiTextField {...props} label={inputboxLabel || label} disabled={false} required />
      </div>
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TokenGenerator);

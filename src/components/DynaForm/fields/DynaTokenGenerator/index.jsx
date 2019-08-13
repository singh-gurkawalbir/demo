import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import DynaSubmit from '../../DynaSubmit';
import { MaterialUiTextField } from '../DynaText';

const mapStateToProps = (state, { resourceId }) => ({
  connectionToken: selectors.connectionTokens(state, resourceId),
});
const mapDispatchToProps = dispatch => ({
  handleRequestToken: resourceId => values =>
    dispatch(actions.resource.connections.requestToken(resourceId, values)),
  handleClearToken: resourceId =>
    dispatch(actions.resource.connections.clearToken(resourceId)),
});
const useStyles = makeStyles(() => ({
  children: {
    flex: 1,
  },
}));

function GenerateTokenButton(props) {
  const { handleRequestToken, disabled, label, resourceId } = props;

  return (
    <DynaSubmit
      disabled={disabled}
      isValid
      onClick={handleRequestToken(resourceId)}>
      {label}
    </DynaSubmit>
  );
}

function TokenGenerator(props) {
  const {
    onFieldChange,
    connectionToken,
    handleClearToken,
    resourceId,
  } = props;
  const { fieldsToBeSetWithValues, message } = connectionToken || {};
  const classes = useStyles(props);
  const [enquesnackbar] = useEnqueueSnackbar();

  useEffect(() => {
    if (fieldsToBeSetWithValues) {
      Object.keys(fieldsToBeSetWithValues).forEach(key =>
        onFieldChange(key, fieldsToBeSetWithValues[key])
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
    <Fragment>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flexBasis: '70%', '& div': { width: '100%' } }}>
          <MaterialUiTextField
            {...props}
            disabled={false}
            required
            className={classes.children}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <GenerateTokenButton {...props} className={classes.children} />
        </div>
      </div>
    </Fragment>
  );
}

const DynaTokenGenerator = connect(
  mapStateToProps,
  mapDispatchToProps
)(TokenGenerator);

export default DynaTokenGenerator;

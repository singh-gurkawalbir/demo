import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { FieldWrapper } from 'react-forms-processor/dist';
import { withStyles } from '@material-ui/core/styles';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import DynaSubmit from '../../DynaSubmit';
import { MaterialUiTextField } from '../DynaText';

const mapStateToProps = (state, { resourceId }) => ({
  connectionToken: selectors.connectionTokens(state, resourceId),
});
const mapDispatchToProps = dispatch => ({
  handleGenerateToken: resourceId => values =>
    dispatch(actions.resource.connections.generateToken(resourceId, values)),
  handleClearToken: resourceId =>
    dispatch(actions.resource.connections.clearToken(resourceId)),
});
const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },

  children: {
    flex: 1,
  },
});

function GenerateTokenButton(props) {
  const { handleGenerateToken, disabled, label, resourceId } = props;

  return (
    <DynaSubmit
      disabled={disabled}
      isValid
      onClick={handleGenerateToken(resourceId)}>
      {label}
    </DynaSubmit>
  );
}

function DynaTokenGenerator(props) {
  const {
    onFieldChange,
    connectionToken,
    handleClearToken,
    resourceId,
    classes,
  } = props;
  const { fieldsToBeSetWithValues, message } = connectionToken || {};
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

const ConnectedTokenGenerator = connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DynaTokenGenerator));
const FieldWrappedTokenGenerator = props => (
  <FieldWrapper {...props}>
    <ConnectedTokenGenerator />
  </FieldWrapper>
);

export default FieldWrappedTokenGenerator;

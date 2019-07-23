import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { FieldWrapper, FormContext } from 'react-forms-processor/dist';
import { withStyles } from '@material-ui/core/styles';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import { FormButton } from '../DynaSubmit';
import { MaterialUiTextField } from './DynaText';

const mapStateToProps = (state, { resourceId }) => ({
  connectionToken: selectors.connectionTokens(state, resourceId),
});
const mapDispatchToProps = (
  dispatch,
  { resourceId, formPayloadFn, tokenSetForFieldsFn }
) => ({
  handleGenerateToken: values =>
    dispatch(
      actions.resource.connections.generateToken(
        resourceId,
        values,
        formPayloadFn,
        tokenSetForFieldsFn
      )
    ),
  handleClearToken: () =>
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
  const { handleGenerateToken, disabled, label } = props;

  return (
    <FormContext.Consumer>
      {form => (
        <FormButton
          disabled={disabled}
          isValid
          onClick={() => {
            handleGenerateToken(form.value);
          }}>
          {label}
        </FormButton>
      )}
    </FormContext.Consumer>
  );
}

function DynaTokenGenerator(props) {
  const {
    id,
    onFieldChange,
    connectionToken,
    handleClearToken,
    classes,
  } = props;
  const { fieldsToBeSetWithValues, message } = connectionToken || {};
  const [enquesnackbar] = useEnqueueSnackbar();

  useEffect(() => {
    if (fieldsToBeSetWithValues) {
      Object.keys(fieldsToBeSetWithValues).forEach(key =>
        onFieldChange(key, fieldsToBeSetWithValues[key])
      );

      handleClearToken();
    }
  }, [fieldsToBeSetWithValues, handleClearToken, id, onFieldChange]);

  useEffect(() => {
    if (message) {
      enquesnackbar({ message, variant: 'error' });
      handleClearToken();
    }
  }, [enquesnackbar, handleClearToken, message]);

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
const FieldWrappedTokenGenerator = props => {
  console.log('check props ', props);

  return (
    <FieldWrapper {...props}>
      <ConnectedTokenGenerator />
    </FieldWrapper>
  );
};

export default FieldWrappedTokenGenerator;

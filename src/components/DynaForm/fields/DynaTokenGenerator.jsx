import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { FieldWrapper, FormContext } from 'react-forms-processor/dist';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import { FormButton } from '../DynaSubmit';
import DynaText from './DynaText';

const mapStateToProps = (state, { resourceId }) => ({
  connectionToken: selectors.connectionTokens(state, resourceId),
});
const mapDispatchToProps = (dispatch, { resourceId }) => ({
  handleGenerateToken: values =>
    dispatch(actions.resource.connections.generateToken(resourceId, values)),
  handleClearToken: () =>
    dispatch(actions.resource.connections.clearToken(resourceId)),
});

function isApiKeyAndSecretValid(form) {
  const { fields } = form;

  return fields
    .filter(
      field => field.id.endsWith('apiKey') || field.id.endsWith('apiSecret')
    )
    .reduce((acc, curr) => acc && curr.value, true);
}

function GenerateTokenButton(props) {
  const { handleGenerateToken } = props;

  return (
    <FormContext.Consumer>
      {form => (
        <FormButton
          disabled={!isApiKeyAndSecretValid(form)}
          isValid
          onClick={() => {
            handleGenerateToken(form.value);
          }}>
          Generate Token
        </FormButton>
      )}
    </FormContext.Consumer>
  );
}

function DynaTokenGenerator(props) {
  const { id, onFieldChange, connectionToken, handleClearToken } = props;
  const { bearerToken, message } = connectionToken || {};
  const [enquesnackbar] = useEnqueueSnackbar();

  useEffect(() => {
    if (bearerToken) {
      onFieldChange(id, bearerToken);
      handleClearToken();
    }
  }, [bearerToken, handleClearToken, id, onFieldChange]);

  useEffect(() => {
    if (message) {
      enquesnackbar({ message, variant: 'error' });
      handleClearToken();
    }
  }, [enquesnackbar, handleClearToken, message]);

  return (
    <Fragment>
      <DynaText {...props} />
      <GenerateTokenButton {...props} />
    </Fragment>
  );
}

const ConnectedTokenGenerator = connect(
  mapStateToProps,
  mapDispatchToProps
)(DynaTokenGenerator);
const FieldWrappedTokenGenerator = props => (
  <FieldWrapper {...props}>
    <ConnectedTokenGenerator {...props.fieldOpts} />
  </FieldWrapper>
);

export default FieldWrappedTokenGenerator;

import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/RefreshOutlined';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { FieldWrapper } from 'react-forms-processor/dist';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import Spinner from '../../Spinner';

const utilGetResourcePath = (applicationType, connectionId, resourceType) =>
  `${applicationType}/metadata/webservices/connections/${connectionId}/${resourceType}`;
const mapStateToProps = (state, ownProps) => {
  const { connectionId, resourceType } = ownProps;
  // export function resource(state, resourceType, id) {
  const connection = selectors.resource(state, 'connections', connectionId);
  const applicationType = connection.type;
  const commResourcePath = utilGetResourcePath(
    applicationType,
    connectionId,
    resourceType
  );

  return {
    applicationType,
    commResourcePath,
    loadingData: selectors.resourceStatus(state, commResourcePath).isLoading,
    resourceData: selectors.metadataResource(
      state,
      connectionId,
      applicationType,
      resourceType
    ),
  };
};

const mapDispatchToProps = dispatch => ({
  onFetchResource: stateProps => {
    const {
      commResourcePath,
      applicationType,
      connectionId,
      resourceType,
    } = stateProps;

    return dispatch(
      actions.metadata.requestCollection(
        commResourcePath,
        applicationType,
        connectionId,
        resourceType
      )
    );
  },
});

@withStyles(() => ({
  inlineElements: {
    display: 'inline',
  },
  selectElement: {
    width: '80%',
  },
}))
class DynaRefreshOptions extends React.Component {
  componentDidMount() {
    const { onFetchResource } = this.props;

    onFetchResource(this.props);
  }
  render() {
    const {
      description,
      disabled,
      id,
      name,
      // options = [],
      value = '',
      label,
      defaultItemValue,
      defaultItemLabel,
      onFieldChange,
      resourceData,
      onFetchResource,
      loadingData,
      classes,
    } = this.props;

    if (!resourceData) return <Spinner />;
    let availableResourceOptions = resourceData.map(recordType => {
      const { label, internalId: value } = recordType;

      return (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      );
    });

    if (defaultItemValue) {
      const defaultItem = (
        <MenuItem key={defaultItemValue} value={defaultItemValue}>
          {defaultItemLabel || defaultItemValue}
        </MenuItem>
      );

      availableResourceOptions = [defaultItem, ...availableResourceOptions];
    }

    return (
      <div>
        <FormControl
          key={id}
          disabled={disabled}
          className={classes.inlineElements}>
          <InputLabel shrink={!!value} htmlFor={id}>
            {label}
          </InputLabel>
          <Select
            className={classes.selectElement}
            value={value}
            onChange={evt => {
              onFieldChange(id, evt.target.value);
            }}
            input={<Input name={name} id={id} />}>
            {availableResourceOptions}
          </Select>
          {!loadingData && (
            <RefreshIcon onClick={() => onFetchResource(this.props)} />
          )}
          {resourceData && loadingData && <Spinner />}
          {description && <FormHelperText>{description}</FormHelperText>}
        </FormControl>
      </div>
    );
  }
}

const ConnectedDynaSelectResource = connect(
  mapStateToProps,
  mapDispatchToProps
)(DynaRefreshOptions);
const FieldWrappedRefreshOptions = props => (
  <FieldWrapper {...props}>
    <ConnectedDynaSelectResource {...props.fieldOpts} />
  </FieldWrapper>
);

export default FieldWrappedRefreshOptions;

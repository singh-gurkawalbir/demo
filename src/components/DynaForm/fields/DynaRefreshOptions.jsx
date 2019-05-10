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

const mapStateToProps = (state, ownProps) => {
  const { resourceToRetrieve } = ownProps;

  return {
    loadingData: selectors.resourceStatus(state, resourceToRetrieve).isLoading,
    resourceData: selectors.resourceCollection(state, resourceToRetrieve),
  };
};

const mapDispatchToProps = dispatch => ({
  onFetchResource: resource =>
    dispatch(actions.resource.requestCollection(resource)),
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
  handleRetrieveResource(props) {
    const { onFetchResource, resourceToRetrieve } = props;

    onFetchResource(resourceToRetrieve);
  }
  componentDidMount() {
    this.handleRetrieveResource(this.props);
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
      loadingData,
      classes,
    } = this.props;

    if (!resourceData) return <Spinner />;
    console.log('check options');
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
            <RefreshIcon
              onClick={() => this.handleRetrieveResource(this.props)}
            />
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

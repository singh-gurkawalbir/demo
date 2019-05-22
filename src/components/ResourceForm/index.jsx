import { Component } from 'react';
import ResourceForm from './GenericResourceForm';
import ConnectionForm from './ConnectionForm';
import factory from '../../forms/formFactory';
import { sanitizePatchSet } from '../../forms/utils';

const getRelevantMeta = (resource, resourceType, connection, handleSubmit) => {
  let fieldMeta;
  let handleClick;
  let optionsHandler;
  let converter;

  // TODO: does custom forms support optionsHanlder
  // and a converter function
  if (resource.customForm && resource.customForm.form) {
    // this resource has an embedded custom form.
    // TODO: will there be an associated connection for this custom form
    // because you create an export based on a connection
    fieldMeta = factory.getFieldsWithDefaults(
      resource.customForm.form,
      resourceType,
      resource
    );
    handleClick = value => {
      // eslint-disable-next-line no-console
      console.log('values passed to custom form submit handler: ', value);
    };
  } else {
    // this is a stock UI form...
    const assets = factory.getResourceFormAssets({
      resourceType,
      resource,
      connection,
    });

    ({ optionsHandler, converter } = assets);

    fieldMeta = factory.getFieldsWithDefaults(
      assets.fieldMeta,
      resourceType,
      resource
    );
    handleClick = value =>
      handleSubmit(
        sanitizePatchSet({
          patchSet: assets.converter(value),
          fieldMeta,
          resource,
        })
      );
  }

  return {
    fieldMeta,
    handleSubmit,
    handleClick,
    optionsHandler,
    converter,
  };
};

export default class ResourceFormFactory extends Component {
  render() {
    const { resource, resourceType, connection, handleSubmit } = this.props;
    const metaProps = getRelevantMeta(
      resource,
      resourceType,
      connection,
      handleSubmit
    );

    if (resourceType === 'connections') {
      return <ConnectionForm {...this.props} {...metaProps} />;
    }

    return <ResourceForm {...this.props} {...metaProps} />;
  }
}

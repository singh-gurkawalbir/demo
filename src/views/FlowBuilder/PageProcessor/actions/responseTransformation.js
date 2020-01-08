import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/TransformIcon';
import helpTextMap from '../../../../components/Help/helpTextMap';
import ModalDialog from '../../../../components/ModalDialog';

function ResponseTransformationDialog(props) {
  const dispatch = useDispatch();
  const { open, onClose, resource, isViewMode } = props;
  const resourceId = resource._id;
  const { sampleResponseData, responseTransform } = resource;
  const fieldMeta = {
    fieldMap: {
      sampleResponseData: {
        id: 'sampleResponseData',
        name: 'sampleResponseData',
        type: 'textarea',
        defaultValue: sampleResponseData,
      },
      responseTransform: {
        id: 'responseTransform',
        name: 'responseTransform',
        label: 'Response Transform',
        type: 'responsetransformeditor',
        defaultValue: responseTransform,
        refreshOptionsOnChangesTo: ['sampleResponseData'],
        resourceId,
      },
    },
    layout: {
      fields: ['sampleResponseData', 'responseTransform'],
    },
  };
  const optionsHandler = (fieldId, fields) => {
    if (fieldId === 'responseTransform') {
      const sampleResponseData = fields.find(
        field => field.id === 'sampleResponseData'
      );

      return {
        sampleResponseData: sampleResponseData && sampleResponseData.value,
      };
    }
  };

  const handleSubmit = formValues => {
    const { sampleResponseData, responseTransform } = formValues;
    const patchSet = [];

    patchSet.push(
      {
        op: 'replace',
        path: '/sampleResponseData',
        value: sampleResponseData,
      },
      {
        op: 'replace',
        path: '/responseTransform',
        value: responseTransform,
      }
    );
    // Save the resource
    dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
    dispatch(actions.resource.commitStaged('imports', resourceId, 'value'));
    onClose();
  };

  return (
    <ModalDialog onClose={onClose} show={open}>
      <div>Response Transform</div>
      <div>
        <DynaForm
          disabled={isViewMode}
          fieldMeta={fieldMeta}
          optionsHandler={optionsHandler}>
          <DynaSubmit data-test="saveResponseTransform" onClick={handleSubmit}>
            Save
          </DynaSubmit>
          <Button data-test="cancelResponseTransform" onClick={onClose}>
            Cancel
          </Button>
        </DynaForm>
      </div>
    </ModalDialog>
  );
}

function ResponseTransformation(props) {
  const { open } = props;

  return (
    <Fragment>{open && <ResponseTransformationDialog {...props} />}</Fragment>
  );
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'responseTransformation',
  position: 'middle',
  Icon,
  helpText: helpTextMap['fb.pp.imports.transform'],
  Component: ResponseTransformation,
};

import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import HttpRequestBodyEditorDialog from '../../../components/AFE/HttpRequestBodyEditor/Dialog';

export default function DynaHttpRequestBody(props) {
  const { id, onFieldChange, options, value, label } = props;
  const [showEditor, setShowEditor] = useState(false);
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { template } = editorValues;

      if (
        options &&
        typeof options.effectIndex === 'number' &&
        value &&
        value.length
      ) {
        const valueTmp = value;

        valueTmp[options.effectIndex] = template;
        onFieldChange(id, valueTmp);
      } else {
        onFieldChange(id, template);
      }
    }

    handleEditorClick();
  };

  let template;

  if (
    options &&
    typeof options.effectIndex === 'number' &&
    value &&
    value.length
  ) {
    template = value[options.effectIndex];
  } else {
    template = value;
  }

  return (
    <Fragment>
      {showEditor && (
        <HttpRequestBodyEditorDialog
          title="Build HTTP Request Body"
          id={id}
          lookupId={options && options.lookups && options.lookups.fieldId}
          rule={template}
          lookups={options && options.lookups && options.lookups.data}
          onFieldChange={onFieldChange}
          onClose={handleClose}
        />
      )}
      <Button variant="outlined" color="secondary" onClick={handleEditorClick}>
        {label}
      </Button>
    </Fragment>
  );
}

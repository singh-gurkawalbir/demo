import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import HttpRequestBodyEditorDialog from '../../../components/AFE/HttpRequestBodyEditor/Dialog';
import DynaLookupEditor from './DynaLookupEditor';

const useStyles = makeStyles(theme => ({
  actionbar: {
    width: '100%',
    display: 'inline-block',
    marginBottom: theme.spacing(2),
  },
}));

export default function DynaHttpRequestBody(props) {
  const { id, onFieldChange, options, value, label } = props;
  const [showEditor, setShowEditor] = useState(false);
  const classes = useStyles();
  const parsedData =
    options && typeof options.saveIndex === 'number' && value && value.length
      ? value[options.saveIndex]
      : value;
  const lookupFieldId = options && options.lookups && options.lookups.fieldId;
  const lookups = options && options.lookups && options.lookups.data;
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { template } = editorValues;

      if (
        options &&
        typeof options.saveIndex === 'number' &&
        value &&
        value.length
      ) {
        // save to array at position saveIndex
        const valueTmp = value;

        valueTmp[options.saveIndex] = template;
        onFieldChange(id, valueTmp);
      } else {
        // save to field
        onFieldChange(id, template);
      }
    }

    handleEditorClick();
  };

  return (
    <Fragment>
      {showEditor && (
        <HttpRequestBodyEditorDialog
          title="Build HTTP Request Body"
          id={id}
          rule={parsedData}
          onFieldChange={onFieldChange}
          onClose={handleClose}
          showLayoutOptions={false}>
          {lookupFieldId && (
            <div className={classes.actionbar}>
              <DynaLookupEditor
                id={lookupFieldId}
                label="Manage Lookups"
                value={lookups}
                onFieldChange={onFieldChange}
              />
            </div>
          )}
        </HttpRequestBodyEditorDialog>
      )}
      <Button variant="outlined" color="secondary" onClick={handleEditorClick}>
        {label}
      </Button>
    </Fragment>
  );
}

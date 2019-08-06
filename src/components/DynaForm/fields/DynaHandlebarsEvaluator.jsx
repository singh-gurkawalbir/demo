import { Fragment, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { FieldWrapper } from 'react-forms-processor/dist';
import HttpRequestBodyEditor from '../../AFE/HttpRequestBodyEditor/Dialog';

const styles = () => ({
  textField: {
    minWidth: 200,
  },
  editorButton: {
    // float: 'right',
  },
});

function DynaHandlebarsEvaluator(props) {
  const { classes, id, value, label, sampleData, onFieldChange } = props;
  const [showEditor, setShowEditor] = useState(false);
  const handleEditorClick = () => {
    setShowEditor(state => !state);
  };

  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { value } = editorValues;

      onFieldChange(id, value);
    }

    handleEditorClick();
  };

  return (
    <Fragment>
      {showEditor && (
        <HttpRequestBodyEditor
          title="Http Request Body editor"
          id={id}
          data={sampleData}
          rule={value}
          onClose={handleClose}
        />
      )}
      <Button
        variant="contained"
        // color="secondary"
        onClick={handleEditorClick}
        className={classes.editorButton}>
        {label}
      </Button>
    </Fragment>
  );
}

const WrappedDynaHandlebarsEvaluator = props => (
  <FieldWrapper {...props}>
    <DynaHandlebarsEvaluator classes={props.classes} />
  </FieldWrapper>
);

export default withStyles(styles)(WrappedDynaHandlebarsEvaluator);

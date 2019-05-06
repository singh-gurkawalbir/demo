import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { FieldWrapper } from 'react-forms-processor/dist';
import TransformEditorDialog from '../../../components/AFE/TransformEditor/Dialog';

@withStyles(() => ({
  textField: {
    minWidth: 200,
  },
  editorButton: {
    // float: 'right',
  },
}))
class DynaTransformEditor extends React.Component {
  state = {
    showEditor: false,
  };

  handleEditorClick = () => {
    this.setState({ showEditor: !this.state.showEditor });
  };

  handleClose = (shouldCommit, editorValues) => {
    const { id, onFieldChange } = this.props;

    if (shouldCommit) {
      const {
        columnDelimiter,
        hasHeaderRow,
        keyColumns,
        rowsToSkip,
        trimSpaces,
      } = editorValues;

      onFieldChange(id, {
        columnDelimiter,
        hasHeaderRow,
        keyColumns,
        rowsToSkip,
        trimSpaces,
      });
    }

    this.handleEditorClick();
  };

  render() {
    const { showEditor } = this.state;
    const { classes, id, rules, label, sampleData } = this.props;
    // when we launch the editor we are only going to entertain the first
    // rule set
    const firstRuleSet = rules ? rules[0] : null;

    return (
      <Fragment>
        {showEditor && (
          <TransformEditorDialog
            title="CSV parse options"
            id={id}
            data={sampleData}
            rule={firstRuleSet}
            onClose={this.handleClose}
          />
        )}
        <Button
          variant="contained"
          // color="secondary"
          onClick={this.handleEditorClick}
          className={classes.editorButton}>
          {label}
        </Button>
      </Fragment>
    );
  }
}

const WrappedDynaTransformEditor = props => (
  <FieldWrapper {...props}>
    <DynaTransformEditor />
  </FieldWrapper>
);

export default WrappedDynaTransformEditor;

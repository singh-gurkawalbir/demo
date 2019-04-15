import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { FieldWrapper } from 'integrator-ui-forms/packages/core/dist';
import CsvParseEditorDialog from '../../../components/AFE/CsvParseEditor/Dialog';

@withStyles(() => ({
  textField: {
    minWidth: 200,
  },
  editorButton: {
    // float: 'right',
  },
}))
class DynaCsvParse extends React.Component {
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
    const { classes, id, value, label, sampleData } = this.props;

    return (
      <Fragment>
        {showEditor && (
          <CsvParseEditorDialog
            title="CSV parse options"
            id={id}
            mode="csv"
            data={sampleData}
            rule={value}
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

const WrappedDynaCsvParse = props => (
  <FieldWrapper {...props}>
    <DynaCsvParse />
  </FieldWrapper>
);

export default WrappedDynaCsvParse;

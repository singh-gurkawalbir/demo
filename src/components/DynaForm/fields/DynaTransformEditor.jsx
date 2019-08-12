import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { FieldWrapper } from 'react-forms-processor/dist';
import TransformEditorDialog from '../../../components/AFE/TransformEditor/Dialog';

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
      const { rule } = editorValues;

      onFieldChange(id, {
        rule,
      });
    }

    this.handleEditorClick();
  };

  render() {
    const { showEditor } = this.state;
    const { id, rules, label, sampleData, resourceId } = this.props;
    // when we launch the editor we are only going to entertain the first
    // rule set
    const firstRuleSet = rules ? rules[0] : null;

    // We are deliberately compounding the id and resourceId, inorder to create
    // a more unique key for the transform editor launch per resource. This will
    // cause react to shake the component tree to perform a rerender and the
    // rule elements key would use just the row index.
    return (
      <Fragment>
        {showEditor && (
          <TransformEditorDialog
            title="Transform Mapping"
            id={id + resourceId}
            data={sampleData}
            rule={firstRuleSet}
            onClose={this.handleClose}
          />
        )}
        <Button
          variant="contained"
          // color="secondary"
          onClick={this.handleEditorClick}>
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

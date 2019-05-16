import { connect } from 'react-redux';
import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FieldWrapper } from 'integrator-ui-forms/packages/core/dist';
import { EditorField } from './DynaEditor';
import actions from '../../../actions';
import * as selectors from '../../../reducers';

const mapStateToProps = state => {
  const getScriptContent = id => selectors.scriptContent(state, id);

  return { getScriptContent };
};

const mapDispatchToProps = dispatch => ({
  requestScript: id => {
    dispatch(actions.resource.request('scriptsContent', id));
  },
});

@withStyles({
  editor: {
    height: 250,
  },
})
class DynaScriptContent extends Component {
  componentDidMount() {
    const {
      id,
      getScriptContent,
      onFieldChange,
      resourceId,
      requestScript,
    } = this.props;
    const scriptContent = getScriptContent(resourceId);

    if (scriptContent === undefined) {
      requestScript(resourceId);
    } else {
      onFieldChange(id, scriptContent);
    }
  }

  render() {
    const { classes, ...rest } = this.props;

    return (
      <EditorField
        {...rest}
        editorClassName={classes.editor}
        mode="javascript"
      />
    );
  }
}

const ConnectedDynaEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(DynaScriptContent);
const FieldWrappedDynaEditor = props => (
  <FieldWrapper {...props}>
    <ConnectedDynaEditor {...props.fieldOpts} />
  </FieldWrapper>
);

export default FieldWrappedDynaEditor;

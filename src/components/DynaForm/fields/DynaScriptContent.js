import { connect } from 'react-redux';
import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { FieldWrapper } from 'react-forms-processor/dist';
import { EditorField } from './DynaEditor';
import actions from '../../../actions';
import * as selectors from '../../../reducers';

const mapStateToProps = (state, { resourceId }) => {
  const data = selectors.resourceData(state, 'scripts', resourceId);
  let scriptContent;

  if (data) {
    scriptContent = data.merged && data.merged.content;
  }

  return { scriptContent };
};

const mapDispatchToProps = (dispatch, { resourceId }) => ({
  requestScript: () => {
    dispatch(actions.resource.request('scripts', resourceId));
  },
});

@withStyles({
  editor: {
    height: 250,
  },
})
class DynaScriptContent extends Component {
  componentDidMount() {
    const { id, scriptContent, onFieldChange, requestScript } = this.props;

    if (scriptContent === undefined) {
      requestScript();
    } else {
      onFieldChange(id, scriptContent);
    }
  }

  render() {
    const { scriptContent, classes, ...rest } = this.props;

    if (scriptContent === undefined) {
      return <Typography>Loading Script...</Typography>;
    }

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

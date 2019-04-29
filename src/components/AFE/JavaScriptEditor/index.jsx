import { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CodePanel from '../GenericEditor/CodePanel';
import JavaScriptPanel from './JavaScriptPanel';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';
import ErrorGridItem from '../ErrorGridItem';
import actions from '../../../actions';
import * as selectors from '../../../reducers';

const mapStateToProps = (state, { editorId }) => {
  const editor = selectors.editor(state, editorId);

  return { editor };
};

const mapDispatchToProps = (
  dispatch,
  {
    editorId,
    code = 'function main(form) {\n  return form\n}',
    entryFunction = 'main',
    data,
  }
) => ({
  handleDataChange: data => {
    dispatch(actions.editor.patch(editorId, { data }));
  },
  handleInit: () => {
    dispatch(
      actions.editor.init(editorId, 'javascript', {
        code,
        entryFunction,
        data,
      })
    );
  },
});

@withStyles(() => ({
  template: {
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr 0fr',
    gridTemplateAreas: '"rule data" "rule result" "error error"',
  },
}))
class JavaScriptEditor extends Component {
  componentDidMount() {
    const { handleInit } = this.props;

    handleInit();
  }
  render() {
    const { editorId, editor, handleDataChange, classes } = this.props;
    const { data, result, error, violations } = editor;
    const parsedData = result ? result.data : '';

    return (
      <PanelGrid className={classes.template}>
        <PanelGridItem gridArea="rule">
          <PanelTitle title="Your Script" />
          <JavaScriptPanel editorId={editorId} />
        </PanelGridItem>
        <PanelGridItem gridArea="data">
          <PanelTitle title="Function Input" />
          <CodePanel
            name="data"
            value={data}
            mode="json"
            onChange={handleDataChange}
          />
        </PanelGridItem>
        <PanelGridItem gridArea="result">
          <PanelTitle title="Function Output" />
          <CodePanel name="result" value={parsedData} mode="json" readOnly />
        </PanelGridItem>

        <ErrorGridItem
          error={error ? error.message : null}
          violations={violations}
        />
      </PanelGrid>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(JavaScriptEditor);

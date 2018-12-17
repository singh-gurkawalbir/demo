import { Component } from 'react';
import { connect } from 'react-redux';
import { func, object } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CodePanel from '../GenericEditor/CodePanel';
import XmlParsePanel from './XmlParsePanel';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';
import ErrorGridItem from '../ErrorGridItem';
import actions from '../../../actions';
import * as selectors from '../../../reducers';

const mapStateToProps = (state, { editorId }) => ({
  editor: selectors.editor(state, editorId),
});
const mapDispatchToProps = (dispatch, { editorId, rule, data }) => ({
  handleDataChange: data => {
    dispatch(actions.editor.patch(editorId, { data }));
  },
  handleInit: () => {
    dispatch(
      actions.editor.init(editorId, 'xmlParser', {
        data,
        autoEvaluate: true,
        leanJson: true,
        trimSpaces: false,
        ...rule,
      })
    );
  },
});

@withStyles(() => ({
  template: {
    gridTemplateColumns: '1fr 2fr',
    gridTemplateRows: '1fr 2fr 0fr',
    gridTemplateAreas: '"rule data" "rule result" "error error"',
  },
}))
class XmlParseEditor extends Component {
  static propTypes = {
    editor: object,
    handleInit: func.isRequired,
    handleDataChange: func.isRequired,
  };

  componentDidMount() {
    const { handleInit } = this.props;

    handleInit();
  }

  render() {
    const { editorId, classes, editor, handleDataChange } = this.props;
    const { data, result, error, violations } = editor;
    const selectResult = result ? result.data[0] : '';

    return (
      <PanelGrid className={classes.template}>
        <PanelGridItem gridArea="rule">
          <PanelTitle title="XML Parse Options" />
          <XmlParsePanel editorId={editorId} />
        </PanelGridItem>
        <PanelGridItem gridArea="data">
          <PanelTitle title="XML to Parse" />
          <CodePanel
            name="data"
            value={data}
            mode="xml"
            onChange={handleDataChange}
          />
        </PanelGridItem>
        <PanelGridItem gridArea="result">
          <PanelTitle title="Parsed Result" />
          <CodePanel name="result" value={selectResult} mode="json" readOnly />
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
export default connect(mapStateToProps, mapDispatchToProps)(XmlParseEditor);

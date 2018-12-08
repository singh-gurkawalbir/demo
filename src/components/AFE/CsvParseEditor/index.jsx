import { Component } from 'react';
import { connect } from 'react-redux';
import { func, object } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CodePanel from '../GenericEditor/CodePanel';
import CsvParsePanel from './CsvParsePanel';
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
      actions.editor.init(editorId, 'csvParser', {
        data,
        autoEvaluate: true,
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
class csvParseEditor extends Component {
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
    const parsedData = result ? result.data : '';

    return (
      <PanelGrid className={classes.template}>
        <PanelGridItem gridArea="rule">
          <PanelTitle title="CSV Parse Options" />
          <CsvParsePanel editorId={editorId} />
        </PanelGridItem>
        <PanelGridItem gridArea="data">
          <PanelTitle title="CSV to Parse" />
          <CodePanel
            name="data"
            value={data}
            mode="text"
            onChange={handleDataChange}
          />
        </PanelGridItem>
        <PanelGridItem gridArea="result">
          <PanelTitle title="Parsed Result" />
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
export default connect(mapStateToProps, mapDispatchToProps)(csvParseEditor);

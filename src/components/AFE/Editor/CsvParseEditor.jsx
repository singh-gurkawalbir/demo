import { Component } from 'react';
import { connect } from 'react-redux';
import { func, object } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CodePanel from '../panels/CodePanel';
import CsvParsePanel from '../panels/CsvParsePanel';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';
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
    dispatch(actions.editor.init(editorId, 'csvParser', { data, ...rule }));
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
    const { data, result, error } = editor;
    const parsedData = result ? result.data : '';

    return (
      <PanelGrid className={classes.template}>
        <PanelGridItem gridArea="rule">
          <PanelTitle>CSV Parse Options</PanelTitle>
          <CsvParsePanel editorId={editorId} />
        </PanelGridItem>
        <PanelGridItem gridArea="data">
          <PanelTitle>CSV to Parse</PanelTitle>
          <CodePanel
            name="data"
            value={data}
            mode="csv"
            onChange={handleDataChange}
          />
        </PanelGridItem>
        <PanelGridItem gridArea="result">
          <PanelTitle>Parsed Result</PanelTitle>
          <CodePanel name="result" value={parsedData} mode="json" readOnly />
        </PanelGridItem>
        {error && (
          <PanelGridItem gridArea="error">
            <PanelTitle>
              <Typography color="error">Error</Typography>
            </PanelTitle>
            <CodePanel readOnly name="error" value={error} mode="json" />
          </PanelGridItem>
        )}
      </PanelGrid>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(csvParseEditor);

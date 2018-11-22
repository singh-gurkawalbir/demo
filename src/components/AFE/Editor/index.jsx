import { Component } from 'react';
import { func, string } from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CodePanel from '../panels/CodePanel';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';
import actions from '../../../actions';
import * as selectors from '../../../reducers';

const mapStateToProps = (state, { id }) => ({
  editor: selectors.editor(state, id),
});
const mapDispatchToProps = (dispatch, { id }) => ({
  pushRuleChange: rule => {
    dispatch(actions.editor.ruleChange(id, rule));
  },
  pushDataChange: data => {
    dispatch(actions.editor.dataChange(id, data));
  },
  handleInit: (processor, rules, data) => {
    dispatch(actions.editor.init(id, processor, rules, data));
  },
  handlePreview: () => {
    dispatch(actions.editor.evaluateRequest(id));
  },
});

@withStyles(() => ({
  compactTemplate: {
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr 0fr',
    gridTemplateAreas: '"rule data" "rule result" "error error"',
  },
  compact2Template: {
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr 0fr',
    gridTemplateAreas: '"rule data" "result data" "error error"',
  },
  columnTemplate: {
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr 1ft 1fr 0fr',
    gridTemplateAreas: '"rule" "data" "result" "error"',
  },
  rowTemplate: {
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateRows: '4fr 0fr',
    gridTemplateAreas: '"rule data result" "error error error"',
  },
}))
class Editor extends Component {
  static propTypes = {
    id: string.isRequired,
    processor: string.isRequired,
    onChange: func,
  };

  handleDataChange = data => {
    const { pushDataChange, onDataChange } = this.props;

    pushDataChange(data);

    if (onDataChange) onDataChange(data);
  };

  handleRuleChange = rule => {
    const { pushRuleChange, onRuleChange } = this.props;

    pushRuleChange(rule);

    if (onRuleChange) onRuleChange(rule);
  };

  componentDidMount() {
    const { processor, rules, data, handleInit } = this.props;

    handleInit(processor, rules, data);
  }

  render() {
    const {
      classes,
      layout = 'compact',
      templateClassName,
      editor,
      ruleMode,
      ruleTitle,
      dataMode,
      dataTitle,
      resultMode,
      resultTitle,
    } = this.props;
    const { rule, data, result, error } = editor;
    // favor custom template over pre-defined layouts.
    const gridTemplate = templateClassName || classes[`${layout}Template`];

    return (
      <PanelGrid className={gridTemplate}>
        <PanelGridItem gridArea="rule">
          <PanelTitle>{ruleTitle}</PanelTitle>
          <CodePanel
            name="rules"
            value={rule}
            mode={ruleMode}
            onChange={this.handleRuleChange}
          />
        </PanelGridItem>
        <PanelGridItem gridArea="data">
          <PanelTitle>{dataTitle}</PanelTitle>
          <CodePanel
            name="data"
            value={data}
            mode={dataMode}
            onChange={this.handleDataChange}
          />
        </PanelGridItem>
        <PanelGridItem gridArea="result">
          <PanelTitle>{resultTitle}</PanelTitle>
          <CodePanel
            name="result"
            value={result && result.data}
            mode={resultMode}
            readOnly
          />
        </PanelGridItem>
        {error && (
          <PanelGridItem gridArea="error">
            <PanelTitle>
              <Typography color="error">Error</Typography>
            </PanelTitle>
            <CodePanel name="error" value={error} mode="json" />
          </PanelGridItem>
        )}
      </PanelGrid>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);

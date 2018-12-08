import { Component } from 'react';
import { connect } from 'react-redux';
import { func, object } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CodePanel from '../GenericEditor/CodePanel';
import TransformPanel from './TransformPanel';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import ErrorGridItem from '../ErrorGridItem';

const mapStateToProps = (state, { editorId }) => ({
  editor: selectors.editor(state, editorId),
});
const mapDispatchToProps = (dispatch, { editorId, rule, data }) => ({
  handleDataChange: data => {
    dispatch(actions.editor.patch(editorId, { data }));
  },
  handleInit: () => {
    dispatch(
      actions.editor.init(editorId, 'transform', {
        data,
        autoEvaluate: true,
        rule,
      })
    );
  },
});

@withStyles(() => ({
  template: {
    gridTemplateColumns: '2fr 3fr 2fr',
    gridTemplateRows: '1fr 0fr',
    gridTemplateAreas: '"data rule result" "error error error"',
  },
}))
class TransformEditor extends Component {
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
          <PanelTitle title="Transform Rules" />
          <TransformPanel editorId={editorId} />
        </PanelGridItem>

        <PanelGridItem gridArea="data">
          <PanelTitle title="Incoming Data" />
          <CodePanel
            name="data"
            value={data}
            mode="text"
            onChange={handleDataChange}
          />
        </PanelGridItem>

        <PanelGridItem gridArea="result">
          <PanelTitle title="Transformed Data" />
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
export default connect(mapStateToProps, mapDispatchToProps)(TransformEditor);

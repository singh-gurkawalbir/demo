import { Component } from 'react';
import { connect } from 'react-redux';
import { func, object } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CodePanel from '../GenericEditor/CodePanel';
import FilterPanel from './FilterPanel';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';
// import ErrorGridItem from '../ErrorGridItem';
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
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr .2fr 0fr',
    gridTemplateAreas: '"filter data " "expression evaluation" ',
  },
}))
class ExportFilterEditor extends Component {
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
    const { data, result } = editor;

    return (
      <PanelGrid className={classes.template}>
        <PanelGridItem gridArea="filter">
          <PanelTitle title="Filter Rules" />
          <FilterPanel editorId={editorId} />
        </PanelGridItem>
        <PanelGridItem gridArea="data">
          <PanelTitle title="Sample Record" />
          <CodePanel
            name="data"
            value={data}
            mode="json"
            onChange={handleDataChange}
          />
        </PanelGridItem>
        <PanelGridItem gridArea="expression">
          <PanelTitle title="Filter Expression" />
          <span>Some expression</span>
        </PanelGridItem>
        <PanelGridItem gridArea="evaluation">
          <PanelTitle title="Filter Evaluation" />
          {/* could be successfull or errored out */}
          {result && <h5>Success</h5>}
        </PanelGridItem>

        {/* <ErrorGridItem
          error={error ? error.message : null}
          violations={violations}
        /> */}
      </PanelGrid>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(ExportFilterEditor);

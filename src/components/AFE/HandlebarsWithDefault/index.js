import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import * as completers from '../editorSetup/completers';
import Editor from '../SqlQueryEditor';

const { merge } = require('lodash');

export default function HandlebarsWithDefaults(props) {
  const {
    editorId,
    ruleTitle,
    layout,
    showDefaultData,
    templateClassName,
    resultTitle,
  } = props;
  const {
    template,
    sampleData,
    defaultData,
    result,
    error,
    violations,
  } = useSelector(state => selectors.editor(state, editorId));

  useSelector(state => {
    if (!violations) {
      const jsonData = JSON.stringify(
        merge(
          {},
          defaultData ? JSON.parse(defaultData) : {},
          sampleData ? JSON.parse(sampleData) : {}
        )
      );
      const helperFunctions = selectors.editorHelperFunctions(state);

      completers.handleBarsCompleters.setCompleters(jsonData, helperFunctions);
    }
  });

  const dispatch = useDispatch();
  const handleChange = (field, value) => {
    dispatch(actions.editor.patch(editorId, { [field]: value }));
  };

  const handleInit = () => {
    dispatch(
      actions.editor.init(editorId, 'sql', {
        props: props.strict,
        autoEvaluate: true,
        autoEvaluateDelay: 300,
        template: props.rule,
        defaultData: props.defaultData || '',
        sampleData: props.sampleData,
      })
    );
    // get Helper functions when the editor intializes
    dispatch(actions.editor.refreshHelperFunctions());
  };

  return (
    <Editor
      editorId={editorId}
      handleInit={handleInit}
      handleChange={handleChange}
      processor="sql"
      ruleMode="handlebars"
      dataMode="json"
      resultMode="text"
      layout={layout}
      templateClassName={templateClassName}
      ruleTitle={ruleTitle}
      resultTitle={resultTitle}
      violations={violations}
      showDefaultData={showDefaultData}
      rule={template}
      sampleData={sampleData}
      defaultData={defaultData || ''}
      result={result ? result.data : ''}
      error={error && error.message}
      enableAutocomplete
    />
  );
}

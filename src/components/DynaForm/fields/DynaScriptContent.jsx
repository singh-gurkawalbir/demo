import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import EditorField from './DynaEditor';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import { isNewId } from '../../../utils/resource';
import scriptHookStubs from '../../../utils/scriptHookStubs';

const useStyles = makeStyles({
  editor: {
    height: 250,
  },
});

export default function DynaScriptContent(props) {
  const { id, onFieldChange, resourceId, value, options = {} } = props;
  const classes = useStyles();
  const scriptContent = useSelector(state => {
    const data = selectors.resourceData(state, 'scripts', resourceId);

    if (data && data.merged && data.merged.content !== undefined) {
      return data.merged && data.merged.content;
    } else if (isNewId(resourceId)) {
      return '';
    }

    return undefined;
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (scriptContent === undefined && !isNewId(resourceId)) {
      dispatch(actions.resource.request('scripts', resourceId));
    }
  }, [dispatch, resourceId, scriptContent]);

  const [valueChanged, setValueChanged] = useState(false);

  useEffect(() => {
    setValueChanged(true);
  }, [scriptContent]);
  // onFieldChange is a bound function and causing endless recursive calls
  useEffect(() => {
    if (valueChanged) {
      onFieldChange(id, scriptContent, true);
      setValueChanged(false);
    }
  }, [id, onFieldChange, scriptContent, valueChanged]);

  useEffect(() => {
    if (
      options.scriptFunctionStub &&
      scriptHookStubs[options.scriptFunctionStub]
    ) {
      // TODO @Raghu: Revisit updating script content
      const updatedScriptContent =
        value + scriptHookStubs[options.scriptFunctionStub];

      onFieldChange(id, updatedScriptContent, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, options.scriptFunctionStub]);

  if (scriptContent === undefined) {
    return <Typography>Loading Script...</Typography>;
  }

  return (
    <EditorField
      {...props}
      editorClassName={classes.editor}
      mode="javascript"
    />
  );
}

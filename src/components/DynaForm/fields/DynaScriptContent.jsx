import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { FieldWrapper } from 'react-forms-processor/dist';
import { EditorField } from './DynaEditor';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import { isNewId } from '../../../utils/resource';

const useStyles = makeStyles({
  editor: {
    height: 250,
  },
});

function DynaScriptContent(props) {
  const { id, onFieldChange, resourceId } = props;
  const classes = useStyles(props);
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

  useEffect(() => {
    onFieldChange(id, scriptContent);
  }, [id, onFieldChange, scriptContent]);

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

const FieldWrappedDynaEditor = props => (
  <FieldWrapper {...props}>
    <DynaScriptContent />
  </FieldWrapper>
);

export default FieldWrappedDynaEditor;

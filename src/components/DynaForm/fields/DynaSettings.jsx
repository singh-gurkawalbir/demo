import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../../../reducers';
import EditorField from './DynaEditor';

const useStyles = makeStyles({
  editor: {
    height: 50,
  },
});

export default function DynaSettings({ resourceContext, ...rest }) {
  const classes = useStyles();
  const { resourceType, resourceId } = rest;
  // form = { form: {[metadata]}, init: {function, _scriptId}}
  const form = useSelector(state => {
    const { merged } = selectors.resourceData(state, resourceType, resourceId);

    return merged.settingsForm;
  });

  console.log('DynaSettings form:', form);

  return <EditorField {...rest} editorClassName={classes.editor} mode="json" />;
}

import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import * as selectors from '../../../reducers';
import Help from '../../Help';

const useStyles = makeStyles(() => ({
  iconButton: {
    marginLeft: 6,
  },
}));

export default function FieldHelp({
  id,
  label,
  helpText,
  helpKey,
  resourceContext,
}) {
  const classes = useStyles();
  const { developer } = useSelector(state => selectors.userProfile(state));

  return (
    <Help
      key={`help-${id}`}
      data-test={`help-${id}`}
      title={label || 'Field Help'}
      className={classes.iconButton}
      caption={developer && helpKey}
      helpKey={helpKey}
      helpText={helpText}
      fieldId={id}
      resourceType={resourceContext && resourceContext.resourceType}
    />
  );
}

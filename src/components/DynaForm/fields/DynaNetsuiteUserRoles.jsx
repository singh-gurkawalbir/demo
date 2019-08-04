import { useSelector } from 'react-redux';
import { FieldWrapper } from 'react-forms-processor/dist';
import { withStyles } from '@material-ui/core/styles';
import { MaterialUiSelect } from './DynaSelect';
import * as selectors from '../../../reducers/index';

const styles = () => ({
  root: {
    display: 'flex !important',
    flexWrap: 'nowrap',
  },
});

function DynaNetsuiteUserRolesOptions(props) {
  const { options, resourceId, netsuiteResourceType } = props;
  const { env, acc } = options;
  const netSuiteUserRoles = useSelector(state =>
    selectors.netsuiteUserRoles(
      state,
      resourceId,
      netsuiteResourceType,
      env,
      acc
    )
  );
  const { optionsArr } = netSuiteUserRoles;

  return (
    <MaterialUiSelect
      {...props}
      classes={props.classes}
      options={[{ items: optionsArr || [] }]}
    />
  );
}

const DynaSelect = props => (
  <FieldWrapper {...props}>
    <DynaNetsuiteUserRolesOptions classes={props.classes} />
  </FieldWrapper>
);

export default withStyles(styles)(DynaSelect);

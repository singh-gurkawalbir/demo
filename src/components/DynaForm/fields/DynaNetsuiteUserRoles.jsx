import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MaterialUiSelect from './DynaSelect';
import * as selectors from '../../../reducers/index';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex !important',
    flexWrap: 'nowrap',
  },
}));

export default function DynaNetsuiteUserRolesOptions(props) {
  const {
    options,
    resourceId,
    netsuiteResourceType,
    onFieldChange,
    id,
    value,
  } = props;
  const classes = useStyles();
  const { env, acc } = options || {};
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
  const matchingOption =
    optionsArr && optionsArr.find(ele => ele.value === value);
  const [autofill, setAutofill] = useState(false);

  useEffect(() => {
    if (!autofill && optionsArr) {
      if (!matchingOption) {
        if (netsuiteResourceType === 'environment') {
          if (optionsArr.length === 1) {
            onFieldChange(id, optionsArr[0].value);
          } else if (
            optionsArr.length === 2 &&
            optionsArr.find(ele => ele.value === 'beta')
          ) {
            const nonBetaOption = optionsArr.find(ele => ele.value !== 'beta');

            onFieldChange(id, nonBetaOption.value);
          }
        }

        if (
          netsuiteResourceType === 'account' ||
          netsuiteResourceType === 'role'
        ) {
          if (optionsArr.length === 1) {
            onFieldChange(id, optionsArr[0].value);
          }
        }
      }

      setAutofill(true);
    }
  }, [
    autofill,
    id,
    matchingOption,
    netsuiteResourceType,
    onFieldChange,
    optionsArr,
  ]);
  const onFieldChangeMaterialUi = (id, value) => {
    onFieldChange(id, value);

    if (netsuiteResourceType === 'environment') {
      ['netsuite.account', 'netsuite.roleId'].forEach(id =>
        onFieldChange(id, '')
      );
    }
  };

  return (
    <MaterialUiSelect
      {...props}
      onFieldChange={onFieldChangeMaterialUi}
      classes={classes}
      options={[{ items: optionsArr || [] }]}
    />
  );
}

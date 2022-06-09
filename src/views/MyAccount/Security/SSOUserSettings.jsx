import React, { useCallback, useMemo, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import DynaForm from '../../../components/DynaForm';
import DynaSubmit from '../../../components/DynaForm/DynaSubmit';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import useSaveStatusIndicator from '../../../hooks/useSaveStatusIndicator';
import CollapsableContainer from '../../../components/ResourceDiffVisualizer/CollapsableContainer';

const useStyles = makeStyles(theme => ({
  ssoForm: {
    margin: theme.spacing(1, 2),
  },
  footer: {
    margin: theme.spacing(2),
  },
  helpTextButton: {
    marginLeft: theme.spacing(0.5),
    height: theme.spacing(2),
    width: theme.spacing(2),
    padding: 0,
    marginRight: theme.spacing(2),
  },
  ssoFormContainer: {
    '&>div>div:last-child': {
      marginBottom: 0,
    },
  },
  collapseContainer: {
    margin: theme.spacing(2),
    '& .MuiAccordionDetails-root': {
      borderTop: `1px solid ${theme.palette.secondary.lightest}`,
      padding: 0,
    },
  },

}));

export default function Security() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [remountCount, setRemountCount] = useState(0);
  const preferences = useSelector(state => selectors.userProfilePreferencesProps(state), shallowEqual);
  const isAccountOwner = useSelector(state => selectors.isAccountOwner(state));
  const ssoPrimaryAccounts = useSelector(state => selectors.ssoPrimaryAccounts(state), shallowEqual);
  const primaryAccountOptions = useMemo(() => (
    [{
      items: ssoPrimaryAccounts.map(
        acc => ({label: acc.ownerUser?.name, value: acc.ownerUser?._id})
      ),
    }]
  ), [ssoPrimaryAccounts]);

  const fieldMeta = useMemo(
    () => ({
      fieldMap: {
        _ssoAccountId: {
          id: '_ssoAccountId',
          type: 'select',
          name: '_ssoAccountId',
          label: 'Primary account',
          required: true,
          options: primaryAccountOptions,
          defaultValue: preferences?._ssoAccountId,
          defaultDisabled: preferences?.authTypeSSO?.sub,
        },
      },
    }),
    [preferences?._ssoAccountId, preferences?.authTypeSSO?.sub, primaryAccountOptions]
  );
  const remountAfterSaveFn = useCallback(() => {
    setRemountCount(count => count + 1);
  }, []);

  const formKey = useFormInitWithPermissions({ fieldMeta, remount: remountCount });

  const handleSubmit = useCallback(formValues => {
    const {_ssoAccountId} = formValues;

    if (_ssoAccountId) {
      const payload = {...preferences, _ssoAccountId};

      dispatch(actions.user.profile.update(payload));
    }
  }, [dispatch, preferences]);

  const { submitHandler, disableSave, defaultLabels} = useSaveStatusIndicator(
    {
      path: '/profile',
      method: 'PUT',
      onSave: handleSubmit,
      remountAfterSaveFn,
    }
  );

  if (isAccountOwner || ssoPrimaryAccounts.length === 0) return null;

  return (
    <div className={classes.collapseContainer} >
      <CollapsableContainer title="User settings" forceExpand>
        <div className={classes.ssoForm}>
          <DynaForm formKey={formKey} className={classes.ssoFormContainer} />
        </div>
        <div className={classes.footer}>
          <DynaSubmit
            formKey={formKey}
            disabled={disableSave}
            onClick={submitHandler()}>
            {defaultLabels.saveLabel}
          </DynaSubmit>
        </div>
      </CollapsableContainer>
    </div>
  );
}

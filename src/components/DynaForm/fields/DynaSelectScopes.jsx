import React, { useState, useMemo } from 'react';
import { FormControl, FormLabel } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { get } from 'lodash';
import ModalDialog from '../../ModalDialog';
import TransferList from '../../TransferList';
import FieldMessage from './FieldMessage';
import FieldHelp from '../FieldHelp';
import { FilledButton, OutlinedButton} from '../../Buttons';
import { useIsLoggable } from '../../IsLoggableContextProvider';
import isLoggableAttr from '../../../utils/isLoggableAttr';
import HelpLink from '../../HelpLink';
import { selectors } from '../../../reducers';
import { useSelectorMemo } from '../../../hooks';

const useStyles = makeStyles({
  dynaSelectScopesContainer: {
    width: '100%',
  },
  dynaTextLabelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  scopesLabel: {
    marginBottom: 6,
  },
  scopesBtn: {
    maxWidth: 160,
  },
  helpLinkScope: {
    float: 'right',
    fontSize: '0.875rem',
  },
});
const excludeSelectedScopes = (defaultScopes, selectedScopes = []) =>
  defaultScopes.filter(scope => !selectedScopes.includes(scope));
const TransferListModal = props => {
  const {
    availableScopes: defaultAvailableScopes,
    selectedScopes: defaultSelectedScopes,
    handleClose,
    id,
    scopesOrig,
    subHeaderMap,
    onFieldChange,
    helpLink,
  } = props;
  const [availableScopes, setAvailableScopes] = useState(
    defaultAvailableScopes
  );
  const [selectedScopes, setSelectedScopes] = useState(defaultSelectedScopes);
  const classes = useStyles();
  const transferListProps = {
    scopesOrig,
    subHeaderMap,
    left: availableScopes,
    setLeft: setAvailableScopes,
    right: selectedScopes,
    setRight: setSelectedScopes,
  };
  const isLoggable = useIsLoggable();

  return (
    <ModalDialog show onClose={handleClose} maxWidth="lg">
      <div>Scopes editor <HelpLink helpLink={helpLink} className={classes.helpLinkScope} /></div>
      <span {...isLoggableAttr(isLoggable)}>
        <TransferList {...transferListProps} />
      </span>
      <>
        <FilledButton
          data-test="saveSelectedScopes"
          onClick={() => {
            onFieldChange(id, selectedScopes);
            handleClose();
          }}>
          Save
        </FilledButton>
      </>
    </ModalDialog>
  );
};

export default function (props) {
  const classes = useStyles();
  const {
    label,
    scopes: scopesOrig,
    value: selectedScopes = [],
    onFieldChange,
    id,
    helpLink,
    required,
    pathToScopeField,
    options = {},
    defaultValue = [],
  } = props;

  const {resourceType, resourceId} = options;

  const resource = useSelectorMemo(selectors.makeResourceSelector, resourceType, resourceId);

  const updatedScopes = useMemo(() => {
    if (resource && pathToScopeField) {
      const resourceScope = get(resource, pathToScopeField);

      return resourceScope?.length ? resourceScope : defaultValue;
    }

    return selectedScopes.length ? selectedScopes : defaultValue;
  }, [defaultValue, pathToScopeField, resource, selectedScopes]);

  const [showScopesModal, setShowScopesModal] = useState(false);

  const {flattenedScopes, subHeaderMap} = useMemo(() => {
    if (scopesOrig && scopesOrig.some(scope => typeof scope === 'string')) {
      return {flattenedScopes: scopesOrig};
    }
    // if elements are an object they would have a subheader

    const subHeaderMap = scopesOrig.reduce((acc, ele) => {
      const {subHeader, scopes} = ele;

      scopes && scopes.forEach(scope => {
        acc[scope] = subHeader;
      });

      return acc;
    }, {});
    const flattenedScopes = scopesOrig.flatMap(ele => ele?.scopes);

    return { subHeaderMap, flattenedScopes};
  }, [scopesOrig]);

  const defaultAvailableScopes = excludeSelectedScopes(flattenedScopes, updatedScopes);

  return (
    <>
      {showScopesModal && (
      <TransferListModal
        id={id}
        scopesOrig={flattenedScopes}
        subHeaderMap={subHeaderMap}
        availableScopes={defaultAvailableScopes}
        selectedScopes={updatedScopes}
        onFieldChange={onFieldChange}
        handleClose={() => {
          setShowScopesModal(false);
        }}
        helpLink={helpLink}
      />
      )}
      <FormControl variant="standard" className={classes.dynaSelectScopesContainer}>
        <div className={classes.dynaTextLabelWrapper}>
          <FormLabel htmlFor={id} className={classes.scopesLabel} required={required}>
            {label}
          </FormLabel>
          <FieldHelp {...props} />
        </div>
        <OutlinedButton
          data-test={id}
          className={classes.scopesBtn}
          onClick={() => setShowScopesModal(true)}>
          {label}
        </OutlinedButton>

        <FieldMessage {...props} />
      </FormControl>
    </>
  );
}

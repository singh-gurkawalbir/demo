import React, { useState, useMemo } from 'react';
import { FormControl, FormLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ModalDialog from '../../ModalDialog';
import TransferList from '../../TransferList';
import FieldMessage from './FieldMessage';
import FieldHelp from '../FieldHelp';
import FilledButton from '../../Buttons/FilledButton';
import OutlinedButton from '../../Buttons/OutlinedButton';

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
  } = props;
  const [availableScopes, setAvailableScopes] = useState(
    defaultAvailableScopes
  );
  const [selectedScopes, setSelectedScopes] = useState(defaultSelectedScopes);
  const transferListProps = {
    scopesOrig,
    subHeaderMap,
    left: availableScopes,
    setLeft: setAvailableScopes,
    right: selectedScopes,
    setRight: setSelectedScopes,
  };

  return (
    <ModalDialog show onClose={handleClose} maxWidth="lg">
      <div>Scopes Editor</div>

      <TransferList {...transferListProps} />
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

export default function DynaSelectScopesDialog(props) {
  const classes = useStyles();
  const { label, scopes: scopesOrig, value: selectedScopes = [], onFieldChange, id } = props;
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

  const defaultAvailableScopes = excludeSelectedScopes(flattenedScopes, selectedScopes);

  return (
    <>
      {showScopesModal && (
        <TransferListModal
          id={id}
          scopesOrig={flattenedScopes}
          subHeaderMap={subHeaderMap}
          availableScopes={defaultAvailableScopes}
          selectedScopes={selectedScopes}
          onFieldChange={onFieldChange}
          handleClose={() => {
            setShowScopesModal(false);
          }}
        />
      )}
      <FormControl className={classes.dynaSelectScopesContainer}>
        <div className={classes.dynaTextLabelWrapper}>
          <FormLabel htmlFor={id} className={classes.scopesLabel}>
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

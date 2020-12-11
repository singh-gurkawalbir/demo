import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ActionButton from '../../../../components/ActionButton';
import SettingsIcon from '../../../../components/icons/SettingsIcon';
import { selectors } from '../../../../reducers';

/**
 * disabled property set to true in case of monitor level access
 */
const emptyObject = {};
export default function MappingSettingsButton(props) {
  const {
    dataTest,
    mappingKey,
  } = props;
  const history = useHistory();
  const isDisabled = useSelector(state => {
    const { mappings } = selectors.suiteScriptMapping(state);

    const value = mappings.find(({key}) => key === mappingKey) || emptyObject;

    return !('generate' in value);
  });
  const handleBtnClick = useCallback(() => {
    history.push(`${history.location.pathname}/settings/${mappingKey}`);
  }, [history, mappingKey]);

  return (
    <ActionButton
      data-test={dataTest}
      disabled={isDisabled}
      aria-label="settings"
      onClick={handleBtnClick}
      key="settings">
      <SettingsIcon />
    </ActionButton>
  );
}

import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SettingsIcon from '../../icons/SettingsIcon';
import ActionButton from '../../ActionButton';
import {selectors} from '../../../reducers';
import { emptyObject } from '../../../utils/constants';

/**
 * disabled property set to true in case of monitor level access
 */
export default function MappingSettingsButton(props) {
  const {
    dataTest,
    mappingKey,
    disabled,
    isCategoryMapping,
  } = props;
  const history = useHistory();
  const {mappingIndex, integrationId, flowId, editorId} = props;
  const isDisabled = useSelector(state => {
    if (isCategoryMapping) {
      if (disabled) return true;
      const {mappings} = selectors.categoryMappingsForSection(state, integrationId, flowId, editorId);
      const value = mappings?.[mappingIndex] || emptyObject;

      return !('generate' in value);
    }
    const { mappings} = selectors.mapping(state);

    const value = mappings.find(({key}) => key === mappingKey) || emptyObject;

    return !('generate' in value);
  });
  const handleBtnClick = useCallback(() => {
    if (isCategoryMapping) {
      history.push(`${history.location.pathname}/settings/category/${editorId}/${mappingIndex}`);
    } else {
      history.push(`${history.location.pathname}/settings/${mappingKey}`);
    }
  }, [editorId, history, isCategoryMapping, mappingIndex, mappingKey]);

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

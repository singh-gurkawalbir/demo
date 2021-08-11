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
    integrationId,
    flowId,
    editorId,
    depth,
    sectionId,
  } = props;
  const history = useHistory();

  const isDisabled = useSelector(state => {
    let mappings;

    if (isCategoryMapping) {
      if (disabled) return true;
      ({mappings} = selectors.categoryMappingsForSection(state, integrationId, flowId, editorId));
    } else {
      ({ mappings} = selectors.mapping(state));
    }

    const value = mappings?.find(({key}) => key === mappingKey) || emptyObject;

    return !('generate' in value);
  });
  const handleBtnClick = useCallback(() => {
    if (isCategoryMapping) {
      history.push(`${history.location.pathname}/settings/category/${editorId}/sections/${sectionId}/${depth}/${mappingKey}`);
    } else {
      history.push(`${history.location.pathname}/settings/${mappingKey}`);
    }
  }, [editorId, history, isCategoryMapping, mappingKey, sectionId, depth]);

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

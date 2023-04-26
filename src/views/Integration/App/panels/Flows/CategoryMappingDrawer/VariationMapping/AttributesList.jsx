/* eslint-disable camelcase */
import React, { useMemo } from 'react';
import { List, ListItem } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { NavLink } from 'react-router-dom';
import { selectors } from '../../../../../../../reducers';
import useSelectorMemo from '../../../../../../../hooks/selectors/useSelectorMemo';
import { variationUrlName } from '.';

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
  listItem: {
    color: theme.palette.text.primary,
    wordBreak: 'break-word',
  },
  activeListItem: {
    color: theme.palette.primary.main,
  },
}));

export default function VariationAttributesList({
  integrationId,
  flowId,
  categoryId,
  depth,
}) {
  const classes = useStyles();
  const memoizedOptions = useMemo(() => ({sectionId: categoryId, depth}), [categoryId, depth]);
  const { variation_themes = [] } = useSelectorMemo(selectors.mkCategoryMappingGenerateFields, integrationId, flowId, memoizedOptions) || {};
  // propery being read as is from IA metadata, to facilitate initialization and to avoid re-adjust while sending back.
  const { variation_attributes = [] } =
    variation_themes.find(theme => theme.id === 'variation_theme') || {};

  return (
    <List>
      {variation_attributes.map(attribute => (
        <ListItem key={attribute}>
          <NavLink
            className={classes.listItem}
            activeClassName={classes.activeListItem}
            to={variationUrlName(attribute)}
            data-test={attribute}>
            {attribute}
          </NavLink>
        </ListItem>
      ))}
    </List>
  );
}

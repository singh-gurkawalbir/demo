import { makeStyles, List, ListItem } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import * as selectors from '../../../../../../../reducers';

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
  listItem: {
    color: theme.palette.text.primary,
  },
  activeListItem: {
    color: theme.palette.primary.main,
  },
}));

export default function VariationAttributesList({
  integrationId,
  flowId,
  categoryId,
}) {
  //   const match = useRouteMatch();
  const classes = useStyles();
  //   const { integrationId, flowId, subCategoryId } = match.params;
  const { variation_themes: variationThemes } =
    useSelector(state =>
      selectors.categoryMappingGenerateFields(state, integrationId, flowId, {
        sectionId: categoryId,
      })
    ) || {};
  const variationAttributes = variationThemes.find(
    theme => theme.id === 'variation_theme'
  ).variation_attributes;

  return (
    <List>
      {variationAttributes.map(attribute => (
        <ListItem key={attribute}>
          <NavLink
            className={classes.listItem}
            activeClassName={classes.activeListItem}
            to={attribute}
            data-test={attribute}>
            {attribute}
          </NavLink>
        </ListItem>
      ))}
    </List>
  );
}

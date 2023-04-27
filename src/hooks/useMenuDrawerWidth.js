import { useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectors } from '../reducers';

export default function useMenuDrawerWidth() {
  const theme = useTheme();
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));

  if (drawerOpened) return theme.drawerWidth;

  return theme.drawerWidthMinimized;
}

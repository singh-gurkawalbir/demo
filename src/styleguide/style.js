export default theme => ({
  StyleGuide: {
    root: {
      overflowY: 'scroll',
      minHeight: '100vh',
    },
  },
  fontFamily: {
    base: theme.typography.fontFamily,
  },
  fontSize: {
    base: theme.typography.fontSize - 1,
    text: theme.typography.fontSize,
    small: theme.typography.fontSize - 2,
  },
  color: {
    base: theme.palette.text.primary,
    link: theme.palette.text.primary,
    linkHover: theme.palette.text.primary,
    border: theme.palette.divider,
    sidebarBackground: theme.palette.background.main,
    codeBackground: theme.palette.primary.main,
  },
  sidebarWidth: theme.drawerWidth,
  maxWidth: '100vw',
});

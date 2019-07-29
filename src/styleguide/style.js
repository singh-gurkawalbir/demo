export default theme => ({
  StyleGuide: {
    root: {
      overflowY: 'scroll',
      minHeight: '100vh',
    },
    content: {
      maxWidth: 1260,
      padding: [[15, 30]],
      margin: [[0, 0]],
      display: 'block',
    },
  },
  fontFamily: {
    base: theme.typography.fontFamily,
  },
  fontSize: {
    base: theme.typography.htmlFontSize,
    text: theme.typography.htmlFontSize,
    small: theme.typography.htmlFontSize,
  },
  color: {
    base: theme.palette.text.primary,
    link: theme.palette.text.link,
    linkHover: theme.palette.text.linkHover,
    linkActive: theme.palette.text.linkActive,
    border: theme.palette.divider,
    sidebarBackground: theme.palette.background.sideBar,
    codeBackground: theme.palette.background.main,
  },
  sidebarWidth: theme.drawerWidth,
});

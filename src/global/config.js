export const Config = {
  auth: {
    registerEnabled: false,
    isAuthMandatory: true,
    refreshIdentityOnLoad: true
  },
  baseLayout: {
    defaultBarMode: 'sidebar', // appbar | sidebar
    appBarHeight: 64,
    barColor: 'primary',
    isBarColorDark: true,
    isAppBarSticky: true,
    mainContentAreaTopSpacing: 12,
    appBarToolbarHeight: 44,
    appBarToolbarScrollbarHeight: 15
  },
  socket: {
    needsAuthentication: true
  },
  localization: {
    default: 'en'
  }
}
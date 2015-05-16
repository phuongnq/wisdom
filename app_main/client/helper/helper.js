Template.registerHelper('active_route', function() {
  return Router.current().route.getName();
});

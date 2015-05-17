Template.registerHelper('active_route', function() {
  return Router.current().route.getName();
});

Template.registerHelper('imageFullPath', function(fileName) {
  if (!fileName) return '';
  return '/assets/images/' + fileName;
});

Template.registerHelper('dateFormat', function(date) {
  return date ? date.format('mm/dd HH:MM') : null;
});

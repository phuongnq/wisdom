Subs = new SubsManager({
  cacheLimit: 9999, //maxinum number of cache subscribes
  expireIn: 9999  //expire after [n] minutes if it's not subscribed again
});

Router.configure({
  layoutTemplate: 'appBody',
  notFoundTemplate: 'notFound',
  loadingTemplate: 'loading',
  onBeforeAction: function() {
    this.next();
  }
});

Router.route('/', {
  name:'home'
});

Meteor.startup(function() {
  Subs.subscribe('userData');
});

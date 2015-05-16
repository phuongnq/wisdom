// Configure login
Router.onBeforeAction(function() {
  if (!(Meteor.user() || Meteor.loggingIn())) {
    var nextPath = 'userLogin';
    Router.go(nextPath);
  } else {
    this.next();
  }
}, {except: ['userLogin']});

Router.route('/login', {
  name: 'userLogin'
});

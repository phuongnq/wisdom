Template.userLogin.events({
  'click #facebook-login': function(event) {
    Meteor.loginWithFacebook({}, function(err){
      if (err) {
          throw new Meteor.Error("Facebook login failed");
      }
      Router.go('home');
    });
  }
});

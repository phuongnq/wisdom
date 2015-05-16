Template.userLogin.events({
  'click #facebook-login': function(event) {
    Meteor.loginWithFacebook({}, function(err){
        if (err) {
            throw new Meteor.Error("Facebook login failed");
        }
        Router.go('home');
    });
  },

  'click #logout': function(event) {
    Meteor.logout(function(err){
      if (err) {
        throw new Meteor.Error("Logout failed");
      }
    });
  }
});

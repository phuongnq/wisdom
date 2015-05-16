Template.contestMyContest.events({
  'click .back-btn': function(e) {
    e.preventDefault();
    Router.go('home');
  }
})

Template.contestReview.events({
  'click .back-btn': function(e) {
    e.preventDefault();
    Router.go('/contest/my-contest/');
  },
})

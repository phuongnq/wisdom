
Router.route('/contest/detail', {
  name: 'contestDetail'
});

Router.route('/contest/math', {
  name:'mathContestsList',
  onBeforeAction: function() {
    this.next();
  }
});

Router.route('/comming-soon', {
  name: 'comingSoon'
});

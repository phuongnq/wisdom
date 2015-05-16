
Router.route('/contest/detail/:_contestId', {
  name: 'contestDetail',
  data: function() {
    return {
      contestId: this.params._contestId
    };
  },
  waitOn: function() {
    return [
      Subs.subscribe('contests')
    ];
  }
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

Router.route('/contest/my-contest', {
  name: 'contestMyContest'
});

//DumpData
/*var Questions = [{
  text: 'question 1',
  answers: [{
    code: 'a',
    text: 'Choice 1'
  }, {
    code: 'b',
    text: 'Choice 2'
  }, {
    code: 'c',
    text: 'Choice 3'
  }, {
    code: 'd',
    text: 'Choice 4'
  }],
  correct_answer: 'a'
},
{
  text: 'question 2',
  answers: [{
    code: 'a',
    text: 'Choice 1'
  }, {
    code: 'b',
    text: 'Choice 2'
  }, {
    code: 'c',
    text: 'Choice 3'
  }, {
    code: 'd',
    text: 'Choice 4'
  }],
  correct_answer: 'a'
}];*/
var thisContest;
var ContestReactive = new ReactiveVar();
var QuestionReactive = new ReactiveVar();
var chart = null;

Template.contestDetail.created = function() {
  var contestId = this.data.contestId;
  thisContest = Contests.findOne({_id: contestId});
  if (thisContest) {
    ContestReactive.set(thisContest);
  }

  Tracker.autorun(function() {
    //console.log('There are ' + Posts.find().count() + ' posts');
    var AllEntries = Entries.find({contest_id: contestId}).fetch();
    if (!chart) {
      createChart(AllEntries);
    }
    else {
      updateChart(AllEntries);
    }
  });
}

Template.contestDetail.rendered = function() {
  console.log('rendered');
  jumpQuestion(1);
}

Template.contestDetail.helpers({
  contest: function() {
    return ContestReactive.get();
  },
  contestName: function() {
    return ContestReactive.get() ? ContestReactive.get().name : 'Contest Details';
  },
  errorMessage: function(field) {
    return Session.get('postSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
  },
  questionContent: function(){
    return QuestionReactive.get() ? QuestionReactive.get().content : null;
  },
  questionListButtons: function() {
    if (!thisContest) return null;
    var qnum = thisContest.questions.length;
    var listbuttons = [];
    for (var i = 0; i < qnum; i ++){
      listbuttons.push(i);
    }
    return listbuttons;
  },
  answers: function(){
    var current = QuestionReactive.get() ? QuestionReactive.get().current : null;
    if (!current) return null;
    return thisContest.questions[current].answers;
  }
});

Template.contestDetail.events({
  'click .upvote': function(e) {
    e.preventDefault();
    //Meteor.call('upvote', this._id);
  },
  'click .question-btn': function(e) {
    e.preventDefault();
    var qid = $(e.target).closest('.question-btn').attr('question-id');
    jumpQuestion(qid);
  },
  'click .back-btn': function(e) {
    e.preventDefault();
    Router.go('/contest/math');
  }
});

/**
 *
 */
function createChart(AllEntries){
	nv.addGraph(function() {
	  chart = nv.models.discreteBarChart()
	      .x(function(d) { return d.label })    //Specify the data accessors.
	      .y(function(d) { return d.value })
	      .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
	      .tooltips(false)        //Don't show tooltips
	      .showValues(false)       //...instead, show the bar value right on top of each bar.
	      .duration(350)
	      .showYAxis(false)
	      .showXAxis(true)
	      ;

	  updateChart(AllEntries);

	  /*d3.select('#chart svg#c2')
	      .datum(chartData())
	      .call(chart);*/

	  nv.utils.windowResize(chart.update);

	  return chart;
	});
}

function updateChart(AllEntries){
  if (!chart) return;
  console.log('update chart');
  d3.select('#chart svg#c1')
      .datum(chartData(AllEntries))
      .call(chart);
}

//Each bar represents a single discrete quantity.
function chartData(AllEntries) {
  var values = [];
  for (var i = 0; i < AllEntries.length; i ++){
    var entry = AllEntries[i];
    values.push({
      label: entry.user_first_name,
      value: entry.score
    });
  }
  return  [
    {
      key: "Cumulative Return",
      values: values
    }
  ]

}

function jumpQuestion(number){
  if (!thisContest) return;
  QuestionReactive.set({
    'current': number,
    'content': thisContest.questions[number].text + number
  })
}

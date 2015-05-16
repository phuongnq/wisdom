var thisContest;
var ContestReactive = new ReactiveVar();
var QuestionReactive = new ReactiveVar();
var chart = null;
var MyEntry;

Template.contestDetail.created = function() {
  var contestId = this.data.contestId;
  thisContest = Contests.findOne({_id: contestId});
  if (thisContest) {
    ContestReactive.set(thisContest);
  }

  Tracker.autorun(function() {
    //console.log('There are ' + Posts.find().count() + ' posts');
    var AllEntries = Entries.find({contest_id: contestId}, {sort: {question: 1}}).fetch();
    MyEntry = Entries.findOne({contest_id: contestId, user_id: Meteor.userId() }) || 
      Entries.insert({
        "contest_id": contestId,
        "user_id": Meteor.userId(),
        "user_first_name": Meteor.userId(),
        "score": 0,
        "question": 0,
        "rank": 1,
        "winning": 1,
        "answers": []
      });
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
  //restore current result
  restoreAnswer(MyEntry);
  //jumpQuestion(1);
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
  },
  'click .choice': function(e) {
    e.preventDefault();
    answerQ(getCurrentQuestion(), $(e.target).data('code'));
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
      .showValues(true)       //...instead, show the bar value right on top of each bar.
      .duration(350)
      .showYAxis(false)
      //.showXAxis(false)
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
      label: entry.question,
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
  if (MyEntry){
    MyEntry.question = number;
    //save
    Entries.update({_id: MyEntry._id}, MyEntry);
  }

  $('.btn-currentQ').removeClass('btn-currentQ');
  $('.question-btn-' + number).addClass('btn-currentQ');
}

function nextQuestion(){
  var number = parseInt(getCurrentQuestion()) + 1;
  jumpQuestion(number);
}

function answerQ(qnumber, ansCode){
  if (!MyEntry) return;
  if (MyEntry.answers[qnumber]) return;
  if (thisContest.questions[qnumber].correct_answer == ansCode){
    MyEntry.score ++;
    //mark right
    markRight(qnumber);
  }
  else {
    //mark wrong
    markWrong(qnumber);
  }

  MyEntry.answers[qnumber] = ansCode;

  nextQuestion();
}

function getCurrentQuestion(){
  return QuestionReactive.get().current;
}

function markRight(qnumber){
  $('.question-btn-' + qnumber).removeClass('btn-default btn-danger').addClass('btn-success');
}

function markWrong(qnumber){
  $('.question-btn-' + qnumber).removeClass('btn-default btn-success').addClass('btn-danger');
}

function restoreAnswer(MyEntry){
  if (!thisContest || !MyEntry || !MyEntry.answers) return;
  var answers = MyEntry.answers;
  var lastnum = -1;
  for (var qnumber in answers) if (answers[qnumber]){
    lastnum = qnumber;
    var question = thisContest.questions[qnumber];
    if (question.correct_answer == answers[qnumber]){
      markRight(qnumber);
    }
    else {
      markWrong(qnumber);
    }
  }
  jumpQuestion(parseInt(lastnum) + 1);
}
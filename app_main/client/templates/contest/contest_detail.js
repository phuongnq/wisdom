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
var Questions;
var QuestionReactive = new ReactiveVar();

Template.contestDetail.created = function() {
  console.log('123');
  Questions = Contests.findOne().questions;
}

Template.contestDetail.rendered = function() {
  console.log('rendered');
  jumpQuestion(1);
  createChart();
}

Template.contestDetail.helpers({
  errorMessage: function(field) {
    return Session.get('postSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
  },
  questionContent: function(){
    return QuestionReactive.get().content;
  },
  questionListButtons: function(){
    var qnum = Questions.length;
    var listbuttons = [];
    for (var i = 0; i < qnum; i ++){
      listbuttons.push(i);
    }
    return listbuttons;
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
  }
});

/**
 *
 */
function createChart(){
	nv.addGraph(function() {
	  var chart = nv.models.discreteBarChart()
	      .x(function(d) { return d.label })    //Specify the data accessors.
	      .y(function(d) { return d.value })
	      .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
	      .tooltips(false)        //Don't show tooltips
	      .showValues(false)       //...instead, show the bar value right on top of each bar.
	      .duration(350)
	      .showYAxis(false)
	      .showXAxis(true)
	      ;

	  d3.select('#chart svg#c1')
	      .datum(exampleData())
	      .call(chart);

	  d3.select('#chart svg#c2')
	      .datum(exampleData())
	      .call(chart);

	  nv.utils.windowResize(chart.update);

	  return chart;
	});
}
//Each bar represents a single discrete quantity.
function exampleData() {
 return  [ 
    {
      key: "Cumulative Return",
      values: [
        { 
          "label" : "A" ,
          "value" : -29.765957771107
        } , 
        { 
          "label" : "B" , 
          "value" : 0
        } , 
        { 
          "label" : "C" , 
          "value" : 32.807804682612
        } , 
        { 
          "label" : "D" , 
          "value" : 196.45946739256
        } , 
        { 
          "label" : "E" ,
          "value" : 0.19434030906893
        } , 
        { 
          "label" : "F" , 
          "value" : -98.079782601442
        } , 
        { 
          "label" : "G" , 
          "value" : -13.925743130903
        } , 
        { 
          "label" : "H" , 
          "value" : -5.1387322875705
        }
      ]
    }
  ]

}

function jumpQuestion(number){
  QuestionReactive.set({
    'current': number,
    'content': Questions[number].text + number
  })
}
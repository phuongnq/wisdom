

Template.contestDetail.created = function() {
  console.log('123');
}

Template.contestDetail.rendered = function() {
  console.log('rendered');
  createChart();
}

Template.contestDetail.helpers({
  errorMessage: function(field) {
    return Session.get('postSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
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
	      .showYAxis(true)
	      .showXAxis(false)
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
          "label" : "A Label" ,
          "value" : -29.765957771107
        } , 
        { 
          "label" : "B Label" , 
          "value" : 0
        } , 
        { 
          "label" : "C Label" , 
          "value" : 32.807804682612
        } , 
        { 
          "label" : "D Label" , 
          "value" : 196.45946739256
        } , 
        { 
          "label" : "E Label" ,
          "value" : 0.19434030906893
        } , 
        { 
          "label" : "F Label" , 
          "value" : -98.079782601442
        } , 
        { 
          "label" : "G Label" , 
          "value" : -13.925743130903
        } , 
        { 
          "label" : "H Label" , 
          "value" : -5.1387322875705
        }
      ]
    }
  ]

}
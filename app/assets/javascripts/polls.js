window.onload = function () {
  var chart = new CanvasJS.Chart("testing", {
    theme: "theme3",
    title:{
      text: "Poll of Polls - Coalition Wins",
      fontFamily: "Armata",      
      fontColor: "#730D45"       
   },
    data: [              
    {
      type: "pie",
      indexLabelFontFamily: "Armata",
      indexLabelLineColor: "#E13E06",
      indexLabelFontColor: "#FA1451",
      indexLabelFontSize: 16,
      dataPoints: [
      { label: "COAL", y: 54.1 },
      { label: "ALP", y: 45.9 }
      ]
    }
    ]
  });
  chart.render();

  var chart = new CanvasJS.Chart("test", {
    theme: "theme1",
    title:{
      text: "Latest Odds",
      fontFamily: "Armata",      
      fontColor: "#730D45"                
    },
    data: [              
    {
    type: "doughnut",
    indexLabelFontFamily: "Armata",
    indexLabelLineColor: "#E13E06",
    indexLabelFontColor: "#FA1451",
    indexLabelFontSize: 16,
    dataPoints: [
    { label: "COAL", y: 92 },
    { label: "ALP", y: 53 },
    { label: "Andrew Wilkie", y: 1 },
    { label: "KAP", y: 1 }
    ]
    }
    ]
  });
  chart.render();
};

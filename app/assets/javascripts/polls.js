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
      type: "doughnut",
      indexLabelFontFamily: "Armata",
      indexLabelLineColor: "#E13E06",
      indexLabelFontColor: "#FA1451",
      indexLabelFontSize: 16,
      dataPoints: [
      { label: "COAL", y: 53.2 },
      { label: "ALP", y: 46.8 }
      ]
    }
    ]
  });
  chart.render();

  var chart = new CanvasJS.Chart("test", {
    theme: "theme1",
    title:{
      text: "Odds: Coalition WIN by 50 Seats",
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
    { label: "COAL", y: 97 },
    { label: "ALP", y: 47 },
    { label: "Andrew Wilkie", y: 1 },
    { label: "KAP", y: 1 }
    ]
    }
    ]
  });
  chart.render();
};

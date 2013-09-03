window.onload = function () {
  var chart = new CanvasJS.Chart("testing", {
    theme: "theme3",
    title:{
      text: "Poll of Polls - Coalition Wins"              
   },
    data: [              
    {
      type: "pie",
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
      text: "Latest Odds: Coalition WIN by 39 Seats"              
    },
    data: [              
    {
    type: "doughnut",
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

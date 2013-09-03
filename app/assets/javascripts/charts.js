window.onload = function () {
  var chart1 = new CanvasJS.Chart("chartContainer", {
      theme: "theme2",//theme1
      title:{
          text: "Basic Column Chart - CanvasJS"              
     },
      data: [              
      {
        type: "column",
        dataPoints: [
        { label: "apple", y: 10 },
        { label: "orange", y: 15 },
        { label: "banana", y: 25 },
        { label: "mango", y: 30 },
        { label: "grape", y: 28 }
        ]
      }
      ]
  });
  chart1.render();
  };

  


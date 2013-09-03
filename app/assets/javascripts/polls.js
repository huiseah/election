window.onload = function () {
          var chart = new CanvasJS.Chart("pollOfPolls", {
              theme: "theme3",//theme1
              title:{
                  text: "Poll of Polls - Coalition Wins"              
             },
              data: [              
              {
// Change type to "bar", "splineArea", "area", "spline", "pie",etc.
                  type: "pie",
                  dataPoints: [
                  { label: "COAL", y: 54.1 },
                  { label: "ALP", y: 45.9 }
                  ]
              }
              ]
          });

          chart.render();
      };

window.onload = function () {
          var chart = new CanvasJS.Chart("latestOdds", {
              theme: "theme1",//theme1
              title:{
                text: "Latest Odds: Coalition WIN by 39 Seats"              
             },
              data: [              
              {
// Change type to "bar", "splineArea", "area", "spline", "pie",etc.
                  type: "bar",
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
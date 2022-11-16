// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

const date = new Date();
const month = date.getMonth() +1;
const test = date.getDate();

console.log(month);
// Area Chart Example
var ctx = document.getElementById("myAreaChart");
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [`${month}월${test}일`, `${month + "월" + (test+1) + "일"}`, `${month + "월" + (test+2) + "일"}`, `${month + "월" + (test+3) + "일"}`, `${month + "월" + (test+4) + "일"}`, `${month + "월" + (test+5) + "일"}`, `${month + "월" + (test+6) + "일"}`, `${month + "월" + (test+7) + "일"}`, `${month + "월" + (test+8) + "일"}`, `${month + "월" + (test+9) + "일"}`, `${month + "월" + (test+10) + "일"}`, `${month + "월" + (test+11) + "일"}`, `${month + "월" + (test+12) + "일"}`],
    datasets: [{
      label: "Sessions",
      lineTension: 0.3,
      backgroundColor: "rgba(2,117,216,0.2)",
      borderColor: "rgba(2,117,216,1)",
      pointRadius: 5,
      pointBackgroundColor: "rgba(2,117,216,1)",
      pointBorderColor: "rgba(255,255,255,0.8)",
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(2,117,216,1)",
      pointHitRadius: 50,
      pointBorderWidth: 2,
      data: [10000, 30162, 26263, 18394, 18287, 28682, 31274, 33259, 25849, 24159, 32651, 31984, 38451],
    }],
  },
  options: {
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: 40000,
          maxTicksLimit: 5
        },
        gridLines: {
          color: "rgba(0, 0, 0, .125)",
        }
      }],
    },
    legend: {
      display: false
    }
  }
});

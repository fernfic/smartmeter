var p1 = [];
var p2 = [];
var p3 = [];
var p4 = [];
var q1 = [];
var q2 = [];
var q3 = [];
var q4 = [];
var i1 = [];
var i2 = [];
var i3 = [];
var i4 = [];
var s1 = [];
var s2 = [];
var s3 = [];
var s4 = [];
var pf1 = [];
var p2_pre = [];
var p3_pre = [];
var p4_pre = [];
for(var i=0;i<e.length;i++){
    var time = e[i]["time"]*1000;
    p2_pre.push([time, pred["light"][i]]);
    p3_pre.push([time, pred["plug"][i]]);
    p4_pre.push([time, pred["air"][i]]);

    p1.push([time, e[i]["P1"]]);
    p2.push([time, e[i]["P2"]]);
    p3.push([time, e[i]["P3"]]);
    p4.push([time, e[i]["P4"]]);
    
    q1.push([time, e[i]["Q1"]]);
    q2.push([time, e[i]["Q2"]]);
    q3.push([time, e[i]["Q3"]]);
    q4.push([time, e[i]["Q4"]]);
    
    i1.push([time, e[i]["I1"]]);
    i2.push([time, e[i]["I2"]]);
    i3.push([time, e[i]["I3"]]);
    i4.push([time, e[i]["I4"]]);

    s1.push([time, e[i]["S1"]]);
    s2.push([time, e[i]["S2"]]);
    s3.push([time, e[i]["S3"]]);
    s4.push([time, e[i]["S4"]]);

    // pf1.push([time, e[i]["PF"]]);
}
Highcharts.stockChart('predict_container', {
chart: {
    events: {
        load: function () {
            // set up the updating of the chart each second
            var series1 = this.series[0];
            var series2 = this.series[1];
            var series3 = this.series[2];
            var series4 = this.series[3];
            var ref = database.ref("energy");
            ref.orderByChild("time").limitToLast(1).on("child_added", function(snapshot) {
                var changedData = snapshot.val();                        
                var x =  changedData.time*1000;
                var p1 =  changedData.P1;
                var p2 =  changedData.P2;
                var p3 =  changedData.P3;
                var p4 =  changedData.P4;
               
                series1.addPoint([x, p1], false, true);
                series2.addPoint([x, p2], false, true);
                series3.addPoint([x, p3], false, true);
                series4.addPoint([x, p4], true, true);
            })
        }
    }
},

time: {
    useUTC: false
},

rangeSelector: {
    buttons: [{
        count: 15,
        type: 'minute',
        text: '15M'
    },{
        count: 30,
        type: 'minute',
        text: '30M'
    },{
        type: 'all',
        text: 'All'
    }],
    selected: 3,
    inputEnabled: false, // ปิดเลือกวันที่
},
legend: {
    enabled : true,
    verticalAlign: 'top',
    align : "right"
},
yAxis: {
  title: {
      text: "Active Power(P)"
  },
  labels: {
      format: '{value}W'
  },
},
tooltip: {
    valueDecimals: 2,
},
credits: {
    enabled: false
},
exporting: {
    enabled: false
},

navigator: {
    enabled: true
},

scrollbar: {
    enabled: false
},

series: [{
    name: 'Actual',
    data: (p4)
},
{
    name: 'Predict',
    data: (p4_pre)
}]
});
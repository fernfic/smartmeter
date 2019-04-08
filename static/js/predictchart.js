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

}
Highcharts.stockChart('actual_main', {
    chart: {
        events: {
            load: function () {
                // set up the updating of the chart each second
                var series1 = this.series[0];
                // var series2 = this.series[1];
                var ref = database.ref("energy");
                ref.orderByChild("time").limitToLast(1).on("child_added", function(snapshot) {
                    var changedData = snapshot.val();                        
                    var x =  changedData.time*1000;
                    var p1 =  changedData.P1;
                    series1.addPoint([x, p1], true, true);
                })
            }
        }
    },
    title: {
        text: 'Main'
    },
    time: {
        useUTC: false
    },
    
    rangeSelector: {
        buttonTheme: {
            visibility: 'hidden'
        },
        labelStyle: {
            visibility: 'hidden'
        },
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
        enabled: false
    },
    
    scrollbar: {
        enabled: false
    },
    
    series: [{
        name: 'Actual',
        data: (p1)
    }]
    });

Highcharts.stockChart('predict_light', {
chart: {
    events: {
        load: function () {
            // set up the updating of the chart each second
            var series1 = this.series[0];
            var series2 = this.series[1];
            var ref = database.ref("energy");
            ref.orderByChild("time").limitToLast(1).on("child_added", function(snapshot) {
                var changedData = snapshot.val();                        
                var x =  changedData.time*1000;
                var p2 =  changedData.P2;
                series1.addPoint([x, p2], false, true);
                $.ajax({
                    url: '/ajax/get_current_predict/',
                    data: {
                      'check': true
                    },
                    dataType: 'json',
                    success: function (data) {
                        if (data) {
                            var p2_pre = data['light'][0]
                            // alert(data);
                            series2.addPoint([x, p2_pre], true, true);
                        }
                    }
                });
            })
        }
    }
},
title: {
    text: 'Light'
},
time: {
    useUTC: false
},

rangeSelector: {
    buttonTheme: {
            visibility: 'hidden'
        },
        labelStyle: {
            visibility: 'hidden'
        },
    inputEnabled: false, // ปิดเลือกวันที่
},
legend: {
    enabled : true,
    verticalAlign: 'top',
    align : "center"
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
    enabled: false
},

scrollbar: {
    enabled: false
},

series: [{
    name: 'Actual',
    data: (p2)
},
{
    name: 'Predict',
    data: (p2_pre)
},]
});

Highcharts.stockChart('predict_air', {
    chart: {
        events: {
            load: function () {
                // set up the updating of the chart each second
                var series1 = this.series[0];
                var series2 = this.series[1];
                var ref = database.ref("energy");
                ref.orderByChild("time").limitToLast(1).on("child_added", function(snapshot) {
                    var changedData = snapshot.val();                        
                    var x =  changedData.time*1000;
                    var p4 =  changedData.P4;
                    series1.addPoint([x, p4], false, true);
                    $.ajax({
                        url: '/ajax/get_current_predict/',
                        data: {
                          'check': true
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data) {
                                var p4_pre = data['air'][0]
                                // alert(data);
                                series2.addPoint([x, p4_pre], true, true);
                            }
                        }
                    });
                })
            }
        }
    },
    title: {
        text: 'Air'
    },
    time: {
        useUTC: false
    },
    
    rangeSelector: {
        buttonTheme: {
            visibility: 'hidden'
        },
        labelStyle: {
            visibility: 'hidden'
        },        inputEnabled: false, // ปิดเลือกวันที่
    },
    legend: {
        enabled : true,
        verticalAlign: 'top',
        align : "center"
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
        enabled: false
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
    },]
    });

Highcharts.stockChart('predict_plug', {
    chart: {
        events: {
            load: function () {
                // set up the updating of the chart each second
                var series1 = this.series[0];
                var series2 = this.series[1];
                var ref = database.ref("energy");
                ref.orderByChild("time").limitToLast(1).on("child_added", function(snapshot) {
                    var changedData = snapshot.val();                        
                    var x =  changedData.time*1000;
                    var p3 =  changedData.P3;
                    series1.addPoint([x, p3], false, true);
                    $.ajax({
                        url: '/ajax/get_current_predict/',
                        data: {
                          'check': true
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data) {
                                var p3_pre = data['plug'][0]
                                // alert(data);
                                series2.addPoint([x, p3_pre], true, true);
                            }
                        }
                    });
                })
            }
        }
    },
    title: {
        text: 'Plug'
    },
    time: {
        useUTC: false
    },
    
    rangeSelector: {
        buttonTheme: {
            visibility: 'hidden'
        },
        labelStyle: {
            visibility: 'hidden'
        },
        inputEnabled: false, // ปิดเลือกวันที่
    },
    legend: {
        enabled : true,
        verticalAlign: 'top',
        align : "center"
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
        enabled: false
    },
    
    scrollbar: {
        enabled: false
    },
    
    series: [{
        name: 'Actual',
        data: (p3)
    },
    {
        name: 'Predict',
        data: (p3_pre)
    },]
});
$(function() {
    $('#datepickerka2').daterangepicker({
        autoUpdateInput: false,
        locale: {
            cancelLabel: 'Clear'
        }
    });
});

$('#datepickerka2').on('apply.daterangepicker', function(ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
});

$('#datepickerka2').on('cancel.daterangepicker', function(ev, picker) {
    $(this).val('');
});
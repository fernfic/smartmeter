function getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
        dateArray.push( moment(currentDate).format('YYYY-MM-DD') )
        currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
}
var p1 = [];
var p2 = [];
var p3 = [];
var p4 = [];
var q1 = [];
var q2 = [];
var q3 = [];
var q4 = [];
var s1 = [];
var s2 = [];
var s3 = [];
var s4 = [];
var i1 = [];
var i2 = [];
var i3 = [];
var i4 = [];
for(var i=0;i< data_last7.time[0].length ;i++){
    var time = parseInt(data_last7.time[0][i])*1000; 
    p1.push([time, parseInt(data_last7.p1[0][i])]);
    p2.push([time, parseInt(data_last7.p2[0][i])]);
    p3.push([time, parseInt(data_last7.p3[0][i])]);
    p4.push([time, parseInt(data_last7.p4[0][i])]);

    q1.push([time, parseInt(data_last7.q1[0][i])]);
    q2.push([time, parseInt(data_last7.q2[0][i])]);
    q3.push([time, parseInt(data_last7.q3[0][i])]);
    q4.push([time, parseInt(data_last7.q4[0][i])]);

    s1.push([time, parseInt(data_last7.s1[0][i])]);
    s2.push([time, parseInt(data_last7.s2[0][i])]);
    s3.push([time, parseInt(data_last7.s3[0][i])]);
    s4.push([time, parseInt(data_last7.s4[0][i])]);

    i1.push([time, parseInt(data_last7.i1[0][i])]);
    i2.push([time, parseInt(data_last7.i2[0][i])]);
    i3.push([time, parseInt(data_last7.i3[0][i])]);
    i4.push([time, parseInt(data_last7.i4[0][i])]);
}

var chart_year = Highcharts.chart('container_kwh', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Whole Energy Per Day'
    },
    subtitle: {
        text: moment().subtract(6,'d').format('DD/MM/YYYY')+' - '+moment().format('DD/MM/YYYY')
    },
    xAxis: {
        categories: col,
        max:6,
        crosshair: true,
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Energy (kwh)'
        }
    },
    credits: {
        enabled: false
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.2f} kwh</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        },
        series: {
            dataLabels: {
                enabled: true,
                align: 'center',
                format: '{y:.2f}',
                style: {
                    fontSize: '9px',
                }
            },
            cursor: 'pointer',
            point: {
                    events: {
                        click: function () {
                            alert('Category: ' + this.category);
                        }
                    }
                }
        }
    },
    series: [{
        name: ch1_name,
        data: p1_wh
    },{
        name: ch2_name,
        data: p2_wh
    },{
        name: ch3_name,
        data: p3_wh
    },{
        name: ch4_name,
        data: p4_wh
    }]
});

Highcharts.stockChart('container_p', {
    title: {
        text: 'Active Power'
    },
    subtitle: {
        text: moment().subtract(6,'d').format('DD/MM/YYYY')+' - '+moment().format('DD/MM/YYYY')
    },
    time: {
        useUTC: false
    },
    rangeSelector: {
        inputEnabled: false, 
        buttonTheme: {
            visibility: 'hidden'
        },
        labelStyle: {
            visibility: 'hidden'
        }
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
        enabled: true
    },

    scrollbar: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    series: [{
        name: ch1_name,
        data: (p1)
    },
    {
        name: ch2_name,
        data: (p2)
    },
    {
        name: ch3_name,
        data: (p3)
    },{
        name: ch4_name ,
        data: (p4)
    }]
});
Highcharts.stockChart('container_q', {
    title: {
        text: 'Reactive Power'
    },
    subtitle: {
        text: moment().subtract(6,'d').format('DD/MM/YYYY')+' - '+moment().format('DD/MM/YYYY')
    },
    time: {
        useUTC: false
    },
    rangeSelector: {
        inputEnabled: false, 
        buttonTheme: {
            visibility: 'hidden'
        },
        labelStyle: {
            visibility: 'hidden'
        }
    },
    legend: {
        enabled : true,
        verticalAlign: 'top',
        align : "center"
    },
    yAxis: {
        title: {
            text: "Reactive Power(Q)"
        },
        labels: {
            format: '{value}VAR'
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
    credits: {
        enabled: false
    },
    series: [{
        name: ch1_name,
        data: (q1)
    },
    {
        name: ch2_name,
        data: (q2)
    },
    {
        name: ch3_name,
        data: (q3)
    },{
        name: ch4_name ,
        data: (q4)
    }]
});

Highcharts.stockChart('container_s', {
    title: {
        text: 'Apparent Power'
    },
    subtitle: {
        text: moment().subtract(6,'d').format('DD/MM/YYYY')+' - '+moment().format('DD/MM/YYYY')
    },
    time: {
        useUTC: false
    },
    rangeSelector: {
        inputEnabled: false, 
        buttonTheme: {
            visibility: 'hidden'
        },
        labelStyle: {
            visibility: 'hidden'
        }
    },
    legend: {
        enabled : true,
        verticalAlign: 'top',
        align : "center"
    },
    yAxis: {
        title: {
            text: "Apparent Power(S)"
        },
        labels: {
            format: '{value}VA'
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
    credits: {
        enabled: false
    },
    series: [{
        name: ch1_name,
        data: (s1)
    },
    {
        name: ch2_name,
        data: (s2)
    },
    {
        name: ch3_name,
        data: (s3)
    },{
        name: ch4_name ,
        data: (s4)
    }]
});
Highcharts.stockChart('container_i', {
    title: {
        text: 'Current'
    },
    subtitle: {
        text: moment().subtract(6,'d').format('DD/MM/YYYY')+' - '+moment().format('DD/MM/YYYY')
    },
    time: {
        useUTC: false
    },
    rangeSelector: {
        inputEnabled: false, 
        buttonTheme: {
            visibility: 'hidden'
        },
        labelStyle: {
            visibility: 'hidden'
        }
    },
    legend: {
        enabled : true,
        verticalAlign: 'top',
        align : "center"
    },
    yAxis: {
        title: {
            text: "Current(I)"
        },
        labels: {
            format: '{value}A'
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
    credits: {
        enabled: false
    },
    series: [{
        name: ch1_name,
        data: (i1)
    },
    {
        name: ch2_name,
        data: (i2)
    },
    {
        name: ch3_name,
        data: (i3)
    },{
        name: ch4_name ,
        data: (i4)
    }]
});
// var dateTo = moment().format('YYYYMMDD');
// var dateFrom = moment().subtract(6,'d').format('YYYYMMDD');
// var get_all_date = getDates(dateFrom,dateTo);
// $.ajax({
//     type:"POST",
//     url: '/ajax/get_date_return_json/',
//     data: {all_date : JSON.stringify(get_all_date)},
//     dataType: 'json',
//     success: function (data) {
//         console.log(data);
//         if (Object.keys(data).length > 1) {
//             var p1 = [];
//             var p2 = [];
//             var p3 = [];
//             var p4 = [];
//             var q1 = [];
//             var q2 = [];
//             var q3 = [];
//             var q4 = [];
//             var s1 = [];
//             var s2 = [];
//             var s3 = [];
//             var s4 = [];
//             var i1 = [];
//             var i2 = [];
//             var i3 = [];
//             var i4 = [];
//             var p1_whs = data.p1_val;
//             var p2_whs = data.p2_val;
//             var p3_whs = data.p3_val;
//             var p4_whs = data.p4_val;
//             console.log(p1_whs);
//             var cols = data.d_col;
//             for(var i=0;i< data.time[0].length ;i++){
//                 var time = parseInt(data.time[0][i])*1000; 
//                 p1.push([time, parseInt(data.p1[0][i])]);
//                 p2.push([time, parseInt(data.p2[0][i])]);
//                 p3.push([time, parseInt(data.p3[0][i])]);
//                 p4.push([time, parseInt(data.p4[0][i])]);

//                 i1.push([time, parseInt(data.i1[0][i])]);
//                 i2.push([time, parseInt(data.i2[0][i])]);
//                 i3.push([time, parseInt(data.i3[0][i])]);
//                 i4.push([time, parseInt(data.i4[0][i])]);
//             }
//             Highcharts.stockChart('container_p', {
//                 title: {
//                     text: 'Active Power'
//                 },
//                 subtitle: {
//                     text: moment().subtract(6,'d').format('DD/MM/YYYY')+' - '+moment().format('DD/MM/YYYY')
//                 },
//                 time: {
//                     useUTC: false
//                 },
//                 rangeSelector: {
//                     inputEnabled: false, 
//                     buttonTheme: {
//                         visibility: 'hidden'
//                     },
//                     labelStyle: {
//                         visibility: 'hidden'
//                     }
//                 },
//                 legend: {
//                     enabled : true,
//                     verticalAlign: 'top',
//                     align : "center"
//                 },
//                 yAxis: {
//                     title: {
//                         text: "Active Power(P)"
//                     },
//                     labels: {
//                         format: '{value}W'
//                     },
//                 },
//                 tooltip: {
//                     valueDecimals: 2,
//                 },
//                 credits: {
//                     enabled: false
//                 },
//                 exporting: {
//                     enabled: false
//                 },

//                 navigator: {
//                     enabled: true
//                 },

//                 scrollbar: {
//                     enabled: false
//                 },
//                 credits: {
//                     enabled: false
//                 },
//                 series: [{
//                     name: ch1_name,
//                     data: (p1)
//                 },
//                 {
//                     name: ch2_name,
//                     data: (p2)
//                 },
//                 {
//                     name: ch3_name,
//                     data: (p3)
//                 },{
//                     name: ch4_name ,
//                     data: (p4)
//                 }]
//             });
//             Highcharts.stockChart('container_i', {
//                 title: {
//                     text: 'Current'
//                 },
//                 subtitle: {
//                     text: moment().subtract(6,'d').format('DD/MM/YYYY')+' - '+moment().format('DD/MM/YYYY')
//                 },
//                 time: {
//                     useUTC: false
//                 },
//                 rangeSelector: {
//                     inputEnabled: false, 
//                     buttonTheme: {
//                         visibility: 'hidden'
//                     },
//                     labelStyle: {
//                         visibility: 'hidden'
//                     }
//                 },
//                 legend: {
//                     enabled : true,
//                     verticalAlign: 'top',
//                     align : "center"
//                 },
//                 yAxis: {
//                     title: {
//                         text: "Current(I)"
//                     },
//                     labels: {
//                         format: '{value}A'
//                     },
//                 },
//                 tooltip: {
//                     valueDecimals: 2,
//                 },
//                 credits: {
//                     enabled: false
//                 },
//                 exporting: {
//                     enabled: false
//                 },

//                 navigator: {
//                     enabled: true
//                 },

//                 scrollbar: {
//                     enabled: false
//                 },
//                 credits: {
//                     enabled: false
//                 },
//                 series: [{
//                     name: ch1_name,
//                     data: (i1)
//                 },
//                 {
//                     name: ch2_name,
//                     data: (i2)
//                 },
//                 {
//                     name: ch3_name,
//                     data: (i3)
//                 },{
//                     name: ch4_name ,
//                     data: (i4)
//                 }]
//             });
//     }}});


$("#container_kwh .highcharts-axis-labels:first text").click(function() {
    alert($(this).text());
});

$(function() {
  $('#datepickerka').daterangepicker({
        autoUpdateInput: false,
        locale: {
            cancelLabel: 'Clear'
    }
});
$("#button").click(function() {
    var start_date = $("#datepickerka").data('daterangepicker').startDate.format('YYYYMMDD');
    var end_date = $("#datepickerka").data('daterangepicker').endDate.format('YYYYMMDD');
    console.log(end_date);
    var get_all_date = getDates(start_date, end_date);
    console.log(get_all_date)
    $.ajax({
        type:"POST",
        url: '/ajax/get_date_return_json/',
        data: {all_date : JSON.stringify(get_all_date)},
        dataType: 'json',
        success: function (data) {
            if (Object.keys(data).length > 1) {
                var p1 = [];
                var p2 = [];
                var p3 = [];
                var p4 = [];
                var q1 = [];
                var q2 = [];
                var q3 = [];
                var q4 = [];
                var s1 = [];
                var s2 = [];
                var s3 = [];
                var s4 = [];
                var i1 = [];
                var i2 = [];
                var i3 = [];
                var i4 = [];
                var p1_whs = data.p1_val;
                var p2_whs = data.p2_val;
                var p3_whs = data.p3_val;
                var p4_whs = data.p4_val;
                var cols = data.d_col;
                console.log(cols)
                for(var i=0;i< data.time[0].length ;i++){
                    var time = parseInt(data.time[0][i])*1000; 
                    p1.push([time, parseInt(data.p1[0][i])]);
                    p2.push([time, parseInt(data.p2[0][i])]);
                    p3.push([time, parseInt(data.p3[0][i])]);
                    p4.push([time, parseInt(data.p4[0][i])]);
                    q1.push([time, parseInt(data.q1[0][i])]);
                    q2.push([time, parseInt(data.q2[0][i])]);
                    q3.push([time, parseInt(data.q3[0][i])]);
                    q4.push([time, parseInt(data.q4[0][i])]);
                    s1.push([time, parseInt(data.s1[0][i])]);
                    s2.push([time, parseInt(data.s2[0][i])]);
                    s3.push([time, parseInt(data.s3[0][i])]);
                    s4.push([time, parseInt(data.s4[0][i])]);
                    i1.push([time, parseInt(data.i1[0][i])]);
                    i2.push([time, parseInt(data.i2[0][i])]);
                    i3.push([time, parseInt(data.i3[0][i])]);
                    i4.push([time, parseInt(data.i4[0][i])]);
                }
                if(get_all_date.length <= 7){
                    var max_series = get_all_date.length-1;
                }else{
                    var max_series = 6;
                }
                Highcharts.chart('container_kwh', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Whole Energy Per Day'
                    },
                    subtitle: {
                        text: moment(start_date).format('DD/MM/YYYY')+' - '+moment(end_date).format('DD/MM/YYYY')
                    },
                    credits: {
                        enabled: false
                    },
                    xAxis: {
                        categories: cols,
                        min:0,
                        max:max_series,
                        scrollbar: {
                            enabled: true
                        },
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Energy (kwh)'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.2f} kwh</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        },
                        series: {
                            dataLabels: {
                                enabled: true,
                                align: 'center',
                                format: '{y:.2f}',
                                style: {
                                    fontSize: '9px',
                                }
                            },
                            cursor: 'pointer',
                            point: {
                                events: {
                                    click: function () {
                                        alert('Category: ' + this.category);
                                    }
                                }
                            }
                        }
                    },
                    series: [{
                        name: ch1_name,
                        data: p1_whs
                    },{
                        name: ch2_name,
                        data: p2_whs
                    },{
                        name: ch3_name,
                        data: p3_whs
                    },{
                        name: ch4_name,
                        data: p4_whs
                    }]
                });

                Highcharts.stockChart('container_p', {
                    title: {
                        text: 'Active Power'
                    },
                    subtitle: {
                        text: moment(start_date).format('DD/MM/YYYY')+' - '+moment(end_date).format('DD/MM/YYYY')
                    },
                    time: {
                        useUTC: false
                    },
                    rangeSelector: {
                        inputEnabled: false, 
                        buttonTheme: {
                            visibility: 'hidden'
                        },
                        labelStyle: {
                            visibility: 'hidden'
                        }
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
                        enabled: true
                    },

                    scrollbar: {
                        enabled: false
                    },

                    series: [{
                        name: ch1_name,
                        data: (p1)
                    },
                    {
                        name: ch2_name,
                        data: (p2)
                    },
                    {
                        name: ch3_name,
                        data: (p3)
                    },{
                        name: ch4_name ,
                        data: (p4)
                    }]
                });
                
                Highcharts.stockChart('container_q', {
                    title: {
                        text: 'Reactive Power'
                    },
                    subtitle: {
                        text: moment(start_date).format('DD/MM/YYYY')+' - '+moment(end_date).format('DD/MM/YYYY')
                    },
                    time: {
                        useUTC: false
                    },
                    rangeSelector: {
                        inputEnabled: false, 
                        buttonTheme: {
                            visibility: 'hidden'
                        },
                        labelStyle: {
                            visibility: 'hidden'
                        }
                    },
                    legend: {
                        enabled : true,
                        verticalAlign: 'top',
                        align : "center"
                    },
                    yAxis: {
                    title: {
                        text: "Reactive Power(Q)"
                    },
                    labels: {
                        format: '{value}VAR'
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
                        name: ch1_name,
                        data: (q1)
                    },
                    {
                        name: ch2_name,
                        data: (q2)
                    },
                    {
                        name: ch3_name,
                        data: (q3)
                    },{
                        name: ch4_name ,
                        data: (q4)
                    }]
                });

                Highcharts.stockChart('container_s', {
                    title: {
                        text: 'Apparent Power'
                    },
                    subtitle: {
                        text: moment(start_date).format('DD/MM/YYYY')+' - '+moment(end_date).format('DD/MM/YYYY')
                    },
                    time: {
                        useUTC: false
                    },
                    rangeSelector: {
                        inputEnabled: false, 
                        buttonTheme: {
                            visibility: 'hidden'
                        },
                        labelStyle: {
                            visibility: 'hidden'
                        }
                    },
                    legend: {
                        enabled : true,
                        verticalAlign: 'top',
                        align : "center"
                    },
                    yAxis: {
                    title: {
                        text: "Apparent Power(S)"
                    },
                    labels: {
                        format: '{value}VA'
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
                        name: ch1_name,
                        data: (s1)
                    },
                    {
                        name: ch2_name,
                        data: (s2)
                    },
                    {
                        name: ch3_name,
                        data: (s3)
                    },{
                        name: ch4_name ,
                        data: (s4)
                    }]
                });

                Highcharts.stockChart('container_i', {
                    title: {
                        text: 'Current'
                    },
                    subtitle: {
                        text: moment(start_date).format('DD/MM/YYYY')+' - '+moment(end_date).format('DD/MM/YYYY')
                    },
                    time: {
                        useUTC: false
                    },
                    rangeSelector: {
                        inputEnabled: false, 
                        buttonTheme: {
                            visibility: 'hidden'
                        },
                        labelStyle: {
                            visibility: 'hidden'
                        }
                    },
                    legend: {
                        enabled : true,
                        verticalAlign: 'top',
                        align : "center"
                    },
                    yAxis: {
                    title: {
                        text: "Current(I)"
                    },
                    labels: {
                        format: '{value}A'
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
                        name: ch1_name,
                        data: (i1)
                    },
                    {
                        name: ch2_name,
                        data: (i2)
                    },
                    {
                        name: ch3_name,
                        data: (i3)
                    },{
                        name: ch4_name ,
                        data: (i4)
                    }]
                });
                
            }else{
                console.log(data.error);
            }
        }
    });
});

$('#datepickerka').on('apply.daterangepicker', function(ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
});

$('#datepickerka').on('cancel.daterangepicker', function(ev, picker) {
    $(this).val('');
});
});
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

function diff(a1, a2) {
    return a1.concat(a2).filter(function(val, index, arr){
      return arr.indexOf(val) === arr.lastIndexOf(val);
    });
}

var p1s = [];
var p2s = [];
var p3s = [];
var p4s = [];
var p2_pres = [];
var p3_pres = [];
var p4_pres = [];
for(var i=0;i< data_last7.time[0].length ;i++){
    var times = parseInt(data_last7.time[0][i])*1000; 
    p1s.push([times, parseInt(data_last7.p1[0][i])]);
    p2s.push([times, parseInt(data_last7.p2[0][i])]);
    p3s.push([times, parseInt(data_last7.p3[0][i])]);
    p4s.push([times, parseInt(data_last7.p4[0][i])]);

    p2_pres.push([times, parseInt(data_last7_pre.ap1[i])]);
    p3_pres.push([times, parseInt(data_last7_pre.ap2[i])]);
    p4_pres.push([times, parseInt(data_last7_pre.ap3[i])]);
}

// Highcharts.chart('container_kwh_pre', {
//     chart: {
//         type: 'column'
//     },
//     title: {
//         text: 'Whole Energy Per Day'
//     },
//     subtitle: {
//         text: firstdate+' - '+moment().format('DD/MM/YYYY')
//     },
//     xAxis: {
//         categories: col,
//         max:6,
//         crosshair: true,
//     },
//     yAxis: {
//         min: 0,
//         title: {
//             text: 'Energy (kwh)'
//         }
//     },
//     credits: {
//         enabled: false
//     },
//     tooltip: {
//         headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
//         pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
//             '<td style="padding:0"><b>{point.y:.2f} kwh</b></td></tr>',
//         footerFormat: '</table>',
//         shared: true,
//         useHTML: true
//     },
//     plotOptions: {
//         column: {
//             pointPadding: 0.2,
//             borderWidth: 0
//         },
//         series: {
//             dataLabels: {
//                 enabled: true,
//                 align: 'center',
//                 format: '{y:.2f}',
//                 style: {
//                     fontSize: '9px',
//                 }
//             },
//             cursor: 'pointer',
//             point: {
//                 events: {
//                     click: function () {
//                         alert('Category: ' + this.category);
//                     }
//                 }
//             },
//         }
//     },
//     series: [{
//         id: 'ch1',
//         name: ch1_name,
//         data: p1_wh
//     },{
//         id: 'ch2',
//         name: ch2_name,
//         data: p2_wh
//     },{
//         id: 'ch3',
//         name: ch3_name,
//         data: p3_wh
//     },{
//         id: 'ch4',
//         name: ch4_name,
//         data: p4_wh
//     }]
// });
Highcharts.stockChart('main_select', {
    // title: {
    //     text: "Predict All "
    // },
    title: {
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
        data: (p1s)
    },{
        name: ch2_name ,
        data: (p2_pres)
    },{
        name: ch3_name ,
        data: (p3_pres)
    },{
        name: ch4_name ,
        data: (p4_pres)
    }]
});

Highcharts.stockChart('ap1_predict_select', {
    title: {
        text: ch2_name
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
        name: "Actual",
        data: (p2s)
    },{
        name: "Predict" ,
        data: (p2_pres)
    }]
});

Highcharts.stockChart('ap2_predict_select', {
    title: {
        text: ch3_name
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
        name: "Actual",
        data: (p3s)
    },{
        name: "Predict" ,
        data: (p3_pres)
    }]
});

Highcharts.stockChart('ap3_predict_select', {
    title: {
        text: ch4_name
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
        name: "Actual",
        data: (p4s)
    },{
        name: "Predict" ,
        data: (p4_pres)
    }]
});

$("#button").click(function() {

    var start_date = $("#datepickerka2").data('daterangepicker').startDate.format('YYYYMMDD');
    var end_date = $("#datepickerka2").data('daterangepicker').endDate.format('YYYYMMDD');
    console.log(end_date);
    var get_all_date = getDates(start_date, end_date);
    console.log(get_all_date)
    $.ajax({
        url: '/ajax/get_date_return_json/',
        data: {all_date : JSON.stringify(get_all_date)},
        dataType: 'json',
        success: function (data) {
            if (Object.keys(data).length > 1) {
                var p1s = [];
                var p2s = [];
                var p3s = [];
                var p4s = [];
                var p2_pres = [];
                var p3_pres = [];
                var p4_pres = [];
                // var p1_whs = data.p1_val;
                // var p2_whs = data.p2_val;
                // var p3_whs = data.p3_val;
                // var p4_whs = data.p4_val;
                var cols = data.d_col;
                console.log(cols)
                if(get_all_date.length != cols.length){
                    alert("No Data of Date " + diff(get_all_date, cols) +" in Database");
                }
                console.log(cols)
                $("#from_to_date").text("From "+moment(get_all_date[0]).format('DD/MM/YYYY')+" To "+ 
                    moment(get_all_date[get_all_date.length - 1]).format('DD/MM/YYYY'));
                // $("#sum_p1_val").text(data.sum_p1_val);
                // $("#sum_p2_val").text(data.sum_p2_val);
                // $("#sum_p3_val").text(data.sum_p3_val);
                // $("#sum_p4_val").text(data.sum_p4_val);
                // $("#cost_by_date").text("฿"+data.cost_by_date);
                for(var i=0;i< data.time[0].length ;i++){
                    var times = parseInt(data.time[0][i])*1000; 
                    p1s.push([times, parseInt(data.p1[0][i])]);
                    p2s.push([times, parseInt(data.p2[0][i])]);
                    p3s.push([times, parseInt(data.p3[0][i])]);
                    p4s.push([times, parseInt(data.p4[0][i])]);
                    p2_pres.push([times, parseInt(data.pre_ap1[i])]);
                    p3_pres.push([times, parseInt(data.pre_ap2[i])]);
                    p4_pres.push([times, parseInt(data.pre_ap3[i])]);
                }
                if(get_all_date.length <= 7){
                    var max_series = get_all_date.length-1;
                }else{
                    var max_series = 6;
                }
                
                Highcharts.stockChart('main_select', {
                    // title: {
                    //     text: "Predict All "
                    // },
                    title: {
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
                        data: (p1s)
                    },{
                        name: ch2_name ,
                        data: (p2_pres)
                    },{
                        name: ch3_name ,
                        data: (p3_pres)
                    },{
                        name: ch4_name ,
                        data: (p4_pres)
                    }]
                });

                Highcharts.stockChart('ap1_predict_select', {
                    title: {
                        text: ch2_name
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
                        name: "Actual",
                        data: (p2s)
                    },{
                        name: "Predict" ,
                        data: (p2_pres)
                    }]
                });

                Highcharts.stockChart('ap2_predict_select', {
                    title: {
                        text: ch3_name
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
                        name: "Actual",
                        data: (p3s)
                    },{
                        name: "Predict" ,
                        data: (p3_pres)
                    }]
                });

                Highcharts.stockChart('ap3_predict_select', {
                    title: {
                        text: ch4_name
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
                        name: "Actual",
                        data: (p4s)
                    },{
                        name: "Predict" ,
                        data: (p4_pres)
                    }]
                });
                
            }else{
                alert("No Data of Date "+ get_all_date + " in Database");
            }
        }
    });
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
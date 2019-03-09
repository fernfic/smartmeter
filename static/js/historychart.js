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
var chart_year = Highcharts.chart('container', {
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
var dateTo = moment().format('YYYYMMDD');
var dateFrom = moment().subtract(6,'d').format('YYYYMMDD');
var get_all_date = getDates(dateFrom,dateTo);
$.ajax({
    type:"POST",
    url: '/ajax/get_date_return_json/',
    data: {all_date : JSON.stringify(get_all_date)},
    dataType: 'json',
    success: function (data) {
        console.log(data);
        if (Object.keys(data).length > 1) {
            var p1 = [];
            var p2 = [];
            var p3 = [];
            var p4 = [];
            var p1_whs = data.p1_val;
            var p2_whs = data.p2_val;
            var p3_whs = data.p3_val;
            var p4_whs = data.p4_val;
            console.log(p1_whs);
            var cols = data.d_col;
            for(var i=0;i< data.time[0].length ;i++){
                var time = parseInt(data.time[0][i])*1000; 
                p1.push([time, parseInt(data.p1[0][i])]);
                p2.push([time, parseInt(data.p2[0][i])]);
                p3.push([time, parseInt(data.p3[0][i])]);
                p4.push([time, parseInt(data.p4[0][i])]);
            }
            Highcharts.stockChart('container2', {
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
    }}});


$("#container .highcharts-axis-labels:first text").click(function() {
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
                }
                if(get_all_date.length <= 7){
                    var max_series = get_all_date.length-1;
                }else{
                    var max_series = 6;
                }
                Highcharts.chart('container', {
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

                Highcharts.stockChart('container2', {
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
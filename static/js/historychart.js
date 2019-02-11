
var chart_year = Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Whole Energy Per Day'
    },
    xAxis: {
        categories: col,
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

$("#container .highcharts-axis-labels:first text").click(function() {
    alert($(this).text());
});
/*
* Author: Abdullah A Almsaeed
* Date: 4 Jan 2014
* Description:
*      This is a demo file used only for the main dashboard (default.aspx)
**/
"use strict";
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


//function sortJsonArrayByProp(objArray, prop) {
//    if (arguments.length < 2) {
//        throw new Error("sortJsonArrayByProp requires 2 arguments");
//    }
//    if (objArray && objArray.constructor === Array) {
//        var propPath = (prop.constructor === Array) ? prop : prop.split(".");
//        objArray.sort(function (a, b) {
//            for (var p in propPath) {
//                if (a[propPath[p]] && b[propPath[p]]) {
//                    a = a[propPath[p]];
//                    b = b[propPath[p]];
//                }
//            }
//            // convert numeric strings to integers
//            if (!isNaN(a)) a = parseInt(a);
//            if (!isNaN(b)) b = parseInt(b);
//            //            a = a.match(/^\d+$/) ? +a : a;
//            //            b = b.match(/^\d+$/) ? +b : b;
//            return ((a < b) ? -1 : ((a > b) ? 1 : 0));
//        });
//    }
//}


function main() {

}

$(function () {

    Highcharts.setOptions({
        lang: {
            decimalPoint: '.',
            thousandsSep: ','
        }
    });

    //Table Summary ROute
    $.ajax({
        type: "POST",
        url: "BangTinTuyenDuong.aspx/Table_Route_Top10",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{'size': 0}",

        success: function (response) {

            //clear table
            $("#tbl_Summary_Route").find("tr:gt(0)").remove();
            var stt = 1;
            //sortJsonArrayByProp(response.d, "totalSuccess");

            var totals = 0;
            var totalSum = 0;
            var totalSuccessSum = 0;
            var ticketSum = 0;
            var ticketSuccessSum = 0;

            $.each(response.d, function () {

                var per = this.totalSuccess / this.total * 100;
                if (isNaN(per)) per = 0;
                if (!isNaN(this.totalSuccess)) totals += this.totalSuccess;


                var row = "<tr> " +
                      "<td>" + stt + ".</td> " +
                      "<td>" + this.name + "</td> " +

                      "<td style='text-align:right'>" + numberWithCommas(this.total) + "</td> " +
                      "<td style='text-align:right'>" + numberWithCommas(this.totalSuccess) + "</td> " +
                      "<td style='text-align:right'>" + numberWithCommas(this.ticket) + "</td> " +
                      "<td style='text-align:right'>" + numberWithCommas(this.ticketSuccess) + "</td> ";

                row += "<td><div class='progress' style='background:rgba(0, 0, 0, 0.09); color:black; '> " +
                "<div class='progress-bar progress-bar-primary progress-bar-striped' style='width: " + per.toFixed(0) + "%'></div> " +
                "" + per.toFixed(2) + "%</div></td>";

                row += "</tr>";

                $("#tbl_Summary_Route").append(row);

                //calculat
                totalSum += this.total;
                totalSuccessSum += this.totalSuccess;
                ticketSum += this.ticket;
                ticketSuccessSum += this.ticketSuccess;
                stt++;

            });
            //total row
            var row = "<tr  class='row-total' > " +
                      "<td colspan='2'>Tổng cộng</td> " +


                      "<td style='text-align:right'>" + numberWithCommas(totalSum) + "</td> " +
                      "<td style='text-align:right'>" + numberWithCommas(totalSuccessSum) + "</td> " +
                      "<td style='text-align:right'>" + numberWithCommas(ticketSum) + "</td> " +
                      "<td style='text-align:right'>" + numberWithCommas(ticketSuccessSum) + "</td> " +
                      "<td colspan='1'></td> ";

            $("#tbl_Summary_Route").append(row);

            //pie chart
            var pieData = [];
            var perOthers = 0;
            $.each(response.d, function () {

                var per = this.totalSuccess / totals * 100;

                //pieDate
                if (per <= 1) {
                    perOthers += per;
                } else {
                    var json = { "name": this.name, "y": per };
                    pieData.push(json);

                }
            });

            var json = { "name": "Các tuyến khác", "y": perOthers };
            pieData.push(json);

            //PieChart Summary Route
            $('#PieChart_Summary_Route').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: 'Phân bố thu trên các tuyến đường'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Route',
                    data: pieData
                }]
            });

        },
        error: function (response) {
            console.log(response);
        }
    });



    //main: refhresh every 10seconds
    main();
    setInterval(function () {
        main();
    }, 30 * 1000); //30s

    //-----------------------------

});
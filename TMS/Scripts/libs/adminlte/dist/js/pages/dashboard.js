/*
* Author: Abdullah A Almsaeed
* Date: 4 Jan 2014
* Description:
*      This is a demo file used only for the main dashboard (default.aspx)
**/
"use strict";
function numberWithCommas(x) {
    if(isNaN(x)) return 0;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(function () {

    Highcharts.setOptions({
        lang: {
            decimalPoint: '.',
            thousandsSep: ','
        }
    });

   
    //main: refhresh every 10seconds
    main();
    setInterval(function () {
        main();
    }, 30 * 1000); //30s
//-------------------end -----------------------

});


function main() {

//box1
    $.ajax({
        type: "POST",
        url: "Dashboard.aspx/Total_CountOrder",

        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#boxTotal1").html(response.d);

        },
        error: function (response) {
            console.log(response);
        }
    });

    //box2
    $.ajax({
        type: "POST",
        url: "Dashboard.aspx/Total_SuccessPercent",

        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#boxTotal2").html(response.d);

        },
        error: function (response) {
            console.log(response);
        }
    });


    //box3
    $.ajax({
        type: "POST",
        url: "Dashboard.aspx/Total_CountByCardType",
        data: '{cardType: "NoiDia",title: "Thẻ nội địa" }',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#boxTotal3").html(response.d);

        },
        error: function (response) {
            console.log(response);
        }
    });
    //box4
    $.ajax({
        type: "POST",
        url: "Dashboard.aspx/Total_CountByCardType",
        data: '{cardType: "QuocTe",title: "Thẻ quốc tế" }',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#boxTotal4").html(response.d);

        },
        error: function (response) {
            console.log(response);
        }
    });
//--------------------------------------------------
    //box1
    $.ajax({
        type: "POST",
        url: "Dashboard.aspx/CountNewOrder",

        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#box1").html(response.d);

        },
        error: function (response) {
            console.log(response);
        }
    });

    //box2
    $.ajax({
        type: "POST",
        url: "Dashboard.aspx/NewOrder_SuccessPercent",

        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#box2").html(response.d);

        },
        error: function (response) {
            console.log(response);
        }
    });


    //box3
    $.ajax({
        type: "POST",
        url: "Dashboard.aspx/NewOrder_CountByCardType",
        data: '{cardType: "NoiDia",title: "Vé thẻ nội địa" }',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#box3").html(response.d);

        },
        error: function (response) {
            console.log(response);
        }
    });
    //box4
    $.ajax({
        type: "POST",
        url: "Dashboard.aspx/NewOrder_CountByCardType",
        data: '{cardType: "QuocTe",title: "Vé thẻ quốc tế" }',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#box4").html(response.d);

        },
        error: function (response) {
            console.log(response);
        }
    });

    //line chart
    $.ajax({
        type: "POST",
        url: "Dashboard.aspx/Chart_TotalMoney_Month",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            //Morris Line
            var line = new Morris.Line({
                element: 'line-chart',
                resize: true,
                data: response.d,
                xkey: 'name',
                ykeys: ['totalSuccess'],
                labels: ['Tổng cộng'],
                lineColors: ['#efefef'],
                lineWidth: 2,
                hideHover: 'auto',
                gridTextColor: "#fff",
                gridStrokeWidth: 0.4,
                pointSize: 4,
                pointStrokeColors: ["#efefef"],
                gridLineColor: "#efefef",
                gridTextFamily: "Open Sans",
                gridTextSize: 10
            });

            //Table description
            var maxTotal = 0;
            var maxTotalSuccess = 0;
            var maxTicket = 0;
            var maxTicketSuccess = 0;
            
            var maxTotalObject;
            var maxTotalSuccessObject;
            var maxTicketObject;
            var maxTicketSuccessObject;
             $.each(response.d, function () {
                if(maxTotal < this.total)
                {
                    maxTotal = this.total;
                    maxTotalObject = this;
                }
                if(maxTotalSuccess < this.totalSuccess)
                {
                    maxTotalSuccess = this.totalSuccess;
                    maxTotalSuccessObject = this;
                }
                if(maxTicket < this.ticket)
                {
                    maxTicket = this.ticket;
                    maxTicketObject = this;
                }
                if(maxTicketSuccess < this.ticketSuccess)
                {
                    maxTicketSuccess = this.ticketSuccess;
                    maxTicketSuccessObject = this;
                }
            });
            //clear table
            $("#Table_BookingSummary").html("");

            var maxTotalRow = "<ul class='nav nav-pills nav-stacked'> " +
                                
                                "<li>Ngày đặt vé nhiều nhất</li> " +
                                "<li> " +
                                 "<a href='#this'>" +maxTotalObject.name+ " <span class='pull-right text-red'>" +numberWithCommas(maxTotalObject.total)+ " VNĐ</span> </a> " +
                                "</li> " +
                                "<li></li> " +
                              "</ul>";
            $("#Table_BookingSummary").append(maxTotalRow);
            
            var maxTotalSuccessRow = "<ul class='nav nav-pills nav-stacked'> " +
                                
                                "<li>Ngày thanh toán nhiều nhất</li> " +
                                "<li> " +
                                 "<a href='#this'>" +maxTotalSuccessObject.name+ " <span class='pull-right text-red'>" +numberWithCommas(maxTotalSuccessObject.totalSuccess)+ " VNĐ</span> </a> " +
                                "</li> " +
                                "<li></li> " +
                              "</ul>";
            $("#Table_BookingSummary").append(maxTotalSuccessRow);


            var maxTicketRow = "<ul class='nav nav-pills nav-stacked'> " +
                                
                                "<li>Ngày đặt vé nhiều nhất</li> " +
                                "<li> " +
                                 "<a href='#this'>" +maxTicketObject.name+ " <span class='pull-right text-red'>" +numberWithCommas(maxTicketObject.ticket)+ " vé</span> </a> " +
                                "</li> " +
                                "<li></li> " +
                              "</ul>";
            $("#Table_BookingSummary").append(maxTicketRow);


            var maxTicketSuccessRow = "<ul class='nav nav-pills nav-stacked'> " +
                                
                                "<li>Ngày thanh toán vé nhiều nhất</li> " +
                                "<li> " +
                                 "<a href='#this'>" +maxTicketSuccessObject.name+ " <span class='pull-right text-red'>" +numberWithCommas(maxTicketSuccessObject.ticketSuccess)+ " vé</span> </a> " +
                                "</li> " +
                                "<li></li> " +
                              "</ul>";
            $("#Table_BookingSummary").append(maxTicketSuccessRow);



        },
        error: function (response) {
            console.log(response);
        }
    });


    //line chart: percent
    $.ajax({
        type: "POST",
        url: "Dashboard.aspx/Chart_PaymentType_Percent",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var quocte = response.d;
            var noidia = 100 - response.d;
            //pie chart
            var pieData = [];
            
            var json = { "name": "Quốc tế", "y": quocte };
            pieData.push(json);
            var json2 = { "name": "Nội địa", "y": noidia };
            pieData.push(json2);

            //PieChart Summary Route
            $('#PieChart_PaymentTypePercent').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: 'Phân bố thanh toán trên các loại thẻ'
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
                    name: 'Loại thẻ',
                    data: pieData
                }]
            });
            

        },
        error: function (response) {
            console.log(response);
        }
    });

    
    //Chart Last week
    $.ajax({
        type: "POST",
        url: "Dashboard.aspx/Chart_TotalMoney_LastWeek",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var categories = [];
            var totals = [];
            var totalSuccesses = [];
            $.each(response.d, function () {
                categories.push(this.name);
                totals.push(this.total);
                totalSuccesses.push(this.totalSuccess);
            });

            console.log(categories);
            $('#divMoneySeries').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Biểu đồ bán vé 7 ngày trước'
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: categories
                },
                yAxis: {
                    min: 0,
                    labels: {
                        format: '{value:,.0f} '
                    },
                    title: {
                        text: 'Tổng cộng (VNĐ)'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:,.0f} </b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.1,
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true
                        }
                    },
                },
                series: [{
                    name: 'Vé đặt',
                    data: totals

                }, {
                    name: 'Vé đã thanh toán',
                    data: totalSuccesses

                }]
            });



        },
        error: function (response) {
            console.log(response);
        }
    });

     //Table Summary LastWeek
    $.ajax({
        type: "POST",
        url: "Dashboard.aspx/Table_Summary_LastWeek",

        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {

            //console.log(response.d);
            //clear table
            $("#tbl_Summary_LastWeek").find("tr:gt(0)").remove();
            var stt = 1;
            var totalSum = 0;
            var totalSuccessSum = 0;
            var ticketSum = 0;
            var ticketSuccessSum = 0;

            $.each(response.d, function () {
                var p_LastDay   = (isNaN(this.ticketSuccess) || isNaN(this.ticketLastDay) || this.ticketLastDay == 0)? 0 : (this.ticketSuccess-this.ticketLastDay)/this.ticketLastDay * 100;
                var p_LastWeek  = (isNaN(this.ticketSuccess) || isNaN(this.ticketLastWeek) || this.ticketLastWeek == 0)? 0 : (this.ticketSuccess-this.ticketLastWeek)/this.ticketLastWeek * 100;
                var p_LastMonth = (isNaN(this.ticketSuccess) || isNaN(this.ticketLastMonth) || this.ticketLastMonth == 0)? 0 : (this.ticketSuccess-this.ticketLastMonth)/this.ticketLastMonth * 100;
                var p_LastYear  = (isNaN(this.ticketSuccess) || isNaN(this.ticketLastYear) || this.ticketLastYear == 0)? 0 : (this.ticketSuccess-this.ticketLastYear)/this.ticketLastYear * 100;
                      
                      if(isNaN(this.ticketLastDay) || this.ticketLastDay == 0) p_LastDay = 100;
                      if(isNaN(this.ticketLastWeek) || this.ticketLastWeek == 0) p_LastWeek = 100;
                      if(isNaN(this.ticketLastMonth) || this.ticketLastMonth == 0) p_LastMonth = 100;
                      if(isNaN(this.ticketLastYear) || this.ticketLastYear == 0) p_LastYear = 100;

                var row = "<tr> "+
                      "<td>" +stt+ ".</td> "+
                      "<td>" +this.name+ "</td> "+
                      
                      "<td style='text-align:right'>" +numberWithCommas(this.total)+ "</td> "+
                      "<td style='text-align:right'>" +numberWithCommas(this.totalSuccess)+ "</td> "+
                      "<td style='text-align:right'>" +numberWithCommas(this.ticket)+ "</td> "+
                      "<td style='text-align:right'>" +numberWithCommas(this.ticketSuccess)+ "</td> ";

                      //percent
                      //last day
                      if(p_LastDay > 0){
                          row +=
                          "<td>" + 
                          "<span class='badge bg-green'><i class='fa fa-caret-up'></i> "+p_LastDay.toFixed(2)+ " %</span>" +                       
                          "</td> ";
                      }else if( p_LastDay < 0){
                          row +=
                          "<td>" + 
                          "<span class='badge bg-red'><i class='fa fa-caret-down'></i> "+p_LastDay.toFixed(2)+ " %</span>" +                       
                          "</td> ";
                      }else{
                        row +=
                          "<td>" + 
                          "<span class='badge bg-yellow'><i class='fa fa-caret-left'></i> "+p_LastDay.toFixed(2)+ " %</span>" +                       
                          "</td> ";
                      }
                      //last month                      
                      if(p_LastMonth > 0){
                          row +=
                          "<td>" + 
                          "<span class='badge bg-green'><i class='fa fa-caret-up'></i> "+p_LastMonth.toFixed(2)+ " %</span>" +                       
                          "</td> ";
                      }else if( p_LastMonth < 0){
                          row +=
                          "<td>" + 
                          "<span class='badge bg-red'><i class='fa fa-caret-down'></i> "+p_LastMonth.toFixed(2)+ " %</span>" +                       
                          "</td> ";
                      }else{
                        row +=
                          "<td>" + 
                          "<span class='badge bg-yellow'><i class='fa fa-caret-left'></i> "+p_LastMonth.toFixed(2)+ " %</span>" +                       
                          "</td> ";
                      }
                      //last year                      
                      if(p_LastYear > 0){
                          row +=
                          "<td>" + 
                          "<span class='badge bg-green'><i class='fa fa-caret-up'></i> "+p_LastYear.toFixed(2)+ " %</span>" +                       
                          "</td> ";
                      }else if( p_LastYear < 0){
                          row +=
                          "<td>" + 
                          "<span class='badge bg-red'><i class='fa fa-caret-down'></i> "+p_LastYear.toFixed(2)+ " %</span>" +                       
                          "</td> ";
                      }else{
                        row +=
                          "<td>" + 
                          "<span class='badge bg-yellow'><i class='fa fa-caret-left'></i> "+p_LastYear.toFixed(2)+ " %</span>" +                       
                          "</td> ";
                      }

                      row += "</tr>";
                
                $("#tbl_Summary_LastWeek").append(row);

                //calculat
                totalSum += this.total;
                totalSuccessSum += this.totalSuccess;
                ticketSum += this.ticket;
                ticketSuccessSum += this.ticketSuccess;
                stt++;
            });

            //total row
            var row = "<tr  class='row-total' > "+
                      "<td colspan='2'>Tổng cộng</td> "+

                      
                      "<td style='text-align:right'>" +numberWithCommas(totalSum)+ "</td> "+
                      "<td style='text-align:right'>" +numberWithCommas(totalSuccessSum)+ "</td> "+
                      "<td style='text-align:right'>" +numberWithCommas(ticketSum)+ "</td> "+
                      "<td style='text-align:right'>" +numberWithCommas(ticketSuccessSum)+ "</td> " +
                      "<td colspan='3'></td> " ;
                      
            $("#tbl_Summary_LastWeek").append(row);

        },
        error: function (response) {
            console.log(response);
        }
    });


    
   //---Table Route Top 10
    $.ajax({
        type: "POST",
        url: "Dashboard.aspx/Table_Route_Top10",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{'size': 10}",

        success: function (response) {
            //reset table
            $("#divRouteTop10").html("");

            var maxTotal = 0;
            var sumTotal = 0;
            var stt = 1;
            //calculate sum total
            $.each(response.d, function () {
               sumTotal += this.mTotal;
            });

            $.each(response.d, function () {

                if(maxTotal < this.mTotal) maxTotal = this.mTotal;

                var per = this.mTotal/maxTotal * 100;
                var perTotal = this.mTotal/sumTotal * 100;

                var html = "<div class='progress-group'> "+
                        "<span class='progress-text'>" + stt + "." +this.mTuyenDuongName+ "</span> "+
                        "<span class='progress-number'><b>" +numberWithCommas(this.mTotal)+ " (VNĐ)/<span style='color:red'>" +numberWithCommas(this.mNumberOfTicket)+ "</span> vé/" +perTotal.toFixed(2)+ "%</span> "+
                        "<div class='progress sm'> "+
                          "<div class='progress-bar progress-bar-aqua' style='width: " +perTotal+ "%'></div> "+
                        "</div> "+
                      "</div> "+
                      ""; 
                $("#divRouteTop10").append(html);

                stt = stt+ 1;
            });

            

        },
        error: function (response) {
            console.log(response);
        }
    });

}

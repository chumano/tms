CHUNOApp.controller('CommonController', ['$scope', '$interpolate', '$filter', '$timeout',
    function ($scope, $interpolate, $filter, $timeout) {
        //START : init-auto-complete =====================================================
        $scope.initAutoComplete = function (autocompleteId) {
            var element = $('input[autocomplete-id="' + autocompleteId + '"]');
            element.autocomplete({
                minLength: 0,
                source: function (request, response) {
                    //element.redraw();
                    //element.addClass("ui-autocomplete-loading");
                    var dataService = new DataService({});
                    dataService.config = {};
                    dataService.config.dataobject = element.attr("autocomplete-table");
                    dataService.config.columns = element.attr("autocomplete-column-value") + ";" + element.attr("autocomplete-column-name");
                    dataService.config.action = "get";
                    dataService.config.sort = "";
                    dataService.config.condition = "";
                    dataService.config.numdata = 5;
                    dataService.config.startrow = 1;
                    dataService.config.endrow = 5;

                    if (element.attr("autocomplete-column-filters")) {
                        var str_filters = element.attr("autocomplete-column-filters");
                        var arr_filters = str_filters.split(",");
                        for (var i = 0; i < arr_filters.length ; i++) {
                            if (i > 0) dataService.config.condition += " OR ";
                            dataService.config.condition += arr_filters[i] + " like N''%" + request.term + "%''";
                        }
                    }

                    var process_reponse = function (listData) {
                        if (listData.length > 0) {
                            response(listData);
                        }
                        else {
                            response(["Không tìm thấy kết quả"]);
                        }
                    }
                    //===============================

                    setTimeout(function () {//must to use timeout to element redraw for loading
                        var isAsync = true;
                        if (!isAsync) {
                            var listData = dataService.GetListData();
                            process_reponse(listData);
                        } else {
                            dataService.GetListDataAsync(function (listData) {
                                process_reponse(listData);
                            });
                        }
                    }, 100);
                    //element.removeClass("ui-autocomplete-loading");
                },
                focus: function (event, ui) {
                    if (ui.item[element.attr("autocomplete-column-value")]) {
                        $(element).val(ui.item[element.attr("autocomplete-column-name")])
                            .change();

                    }
                    return false;
                },
                select: function (event, ui) {
                    if (ui.item[element.attr("autocomplete-column-value")]) {
                        $(element).val(ui.item[element.attr("autocomplete-column-name")]);

                        if (element.attr("autocomplete-model-id")) {
                            $(element.attr("autocomplete-model-id")).val(ui.item[element.attr("autocomplete-column-value")])
                                  .change();//must to call change function
                        }
                    }
                    return false;
                },
                change: function (event, ui) {
                    if (ui.item == null) {
                        //empty textfield if no item is selected
                        element.val("");
                        //$('#empty-message').show();

                        //clear model-value
                        if (element.attr("autocomplete-model-id")) {
                            $(element.attr("autocomplete-model-id")).val("")
                                .change();//must to call change function
                        }
                    }
                },
                // optional (if other layers overlap autocomplete list)
                open: function (event, ui) {
                    $(".ui-autocomplete").css("z-index", 2000);
                }
            })
            .autocomplete("instance")._renderItem = function (ul, item) {
                var content;
                if (item[element.attr("autocomplete-column-name")]) {
                    content = "<a>" + item[element.attr("autocomplete-column-name")] + "</a>";
                }
                else {
                    content = "<a>" + item.label + "</a>";
                }

                return $("<li>")
                        .append(content)
                        .appendTo(ul);
            };

            //----------
            //search on focus textfield
            element.bind('focus', function () {
                if ($(this).val() == "") {
                    $(this).autocomplete("search");
                }
            });
        }
        //END : init-auto-complete =======================================================

        //START : dropdown =======================================================
        $scope.InitVisibleDropdown = function (dropdownId) {
            var element = $('select[dropdown-id="' + dropdownId + '"]');
            //if ($('select[dropdown-id="' + dropdownId + '"]').is(":visible")) {

            //if ($scope['dropdown_'+dropdownId]) 
            {
                $scope.ReloadDropdown(dropdownId);
            }
        }

        $scope.ReloadDropdown = function (dropdownId) {
            var element = $('select[dropdown-id="' + dropdownId + '"]');
            if (element.length == 0) {
                ShowErrorMessage("Không có DropdownId :" + dropdownId);
                return;
            }
            //Evaluate condition before send to execute in DB
            var dataService = new DataService({});
            dataService.config = {};
            dataService.config.dataobject = element.attr("dropdown-table");
            dataService.config.columns = element.attr("dropdown-column-value") + ";" + element.attr("dropdown-column-name");
            dataService.config.action = "getall";
            dataService.config.sort = "";
            dataService.config.condition = element.attr("dropdown-condition");
            dataService.config.numdata = 5;
            dataService.config.startrow = 1;
            dataService.config.endrow = 50;

            //dataService.GetListDataAsync(function (result) {
            //    $scope.$apply(function () {//Async
            //        $scope['dropdown_' + dropdownId] = result;

            //        if ($scope.DropdownIdByObject == undefined) $scope.DropdownIdByObject = {};
            //        $scope.DropdownIdByObject[dataService.config.dataobject] = dropdownId;
            //    });
            //});
            $timeout(function () {
                var result = dataService.GetListData();
                $scope.$apply(function () {//Async
                    $scope['dropdown_' + dropdownId] = result;

                    if ($scope.DropdownIdByObject == undefined) $scope.DropdownIdByObject = {};
                    $scope.DropdownIdByObject[dataService.config.dataobject] = dropdownId;
                });
            }, 100);
        }

        $scope.ReloadMasterDrodowns = function (tableName) {
            var dropdownid = $scope.DropdownIdByObject[tableName];
            if (dropdownid) {
                $scope.ReloadDropdown(dropdownid);
            }
        }
        //END   : dropdown =======================================================

        //START : yearpicker ======================================================= 
        $scope.initYearPicker = function (pickerid) {
            var element = $('input[year-picker-id="' + pickerid + '"]');
            var curDate = new Date();
            curDate.getYear();
            var yearstart = curDate.getYear() - 10; 
            var yearend = curDate.getYear() + 10; 
            if (element.attr("year-start")) {
                yearstart = parseInt(element.attr("year-start"));
            }

            if (element.attr("year-end")) {
                yearend = parseInt(element.attr("year-end"));
            }
            var yearrange = _.range(yearstart, yearend + 1, 1); 
            yearrange = yearrange.map(String);//["2000","2001"]

            //======================================
            element.autocomplete({
                minLength: 0,
                autoFocus :true,
                source: yearrange//["2012", "2013", "2014"]
                ,
                focus: function (event, ui) {
                    //if (ui.item.value) {
                    //    $(element).val(ui.item.value);
                    //}
                    //return false;

                    event.preventDefault();
                },
                select: function (event, ui) {
                    if (ui.item.value) {
                        $(element).val(ui.item.value).change();
                    }
                    return false;
                },
                change: function (event, ui) {
                   
                },
                // optional (if other layers overlap autocomplete list)
                open: function (event, ui) {
                    $(".ui-autocomplete").css("z-index", 1000);
                }
            })
            .autocomplete("instance")._renderItem = function (ul, item) {
                var content;
                if (item.value) {
                    content = "<a>" + item.value + "</a>";
                }
                else {
                    content = "<a>" + item.label + "</a>";
                }

                return $("<li>")
                        .append(content)
                        .appendTo(ul);
            };

            //focus -> dropdown now
            element.bind('focus', function () { $(this).autocomplete("search"); })
        }
        //END   : yearpicker ======================================================= 

        //datetimepicker

        //colorpicker

        //START : input-mask =======================================================
        $scope.initInputMask = function () {
            //=====================================
            $(":input").inputmask();

            $("input[data-inputmask-regex]").inputmask("Regex"); //data-inputmask-regex="(01\d{9})|(09\d{8})"
            $("input.mask-phone").inputmask("Regex", {
                regex: '(01\\d{9})|(09\\d{8})', //must have \\
                isComplete: function (buffer, opts) {
                    return new RegExp(opts.regex).test(buffer.join(''));
                }
            });

            var validatePhone = function (txt) {

                //var filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
                var filter = /^(01\d{9})|(09\d{8})$/;
                //var filter = /^(\d{7}\d*)$/;

                if (filter.test(txt)) {
                    return true;
                }
                else {
                    return false;
                }
            }

            //=====================================
            $("input.mask-currency").each(function () {
                var value = $(this).val();
                if (value) {
                    $(this).val($filter('currency')(value, "", 0)).change();
                }
                $(this).inputmask("numeric", {
                    radixPoint: ".",
                    groupSeparator: ",",
                    digits: 2,
                    autoGroup: true,
                    prefix: '', //Space after $, this will not truncate the first character.
                    rightAlign: false,
                    oncleared: function () { self.Value(''); }
                });
            });
        }
        $scope.initInputMask();  //call it  now
        //END   : input-mask =======================================================

        //fileupload

        //imgupload
        $scope.GetImageSrc = function (imgid) {
            return CommonHelper.GetImageSrc(imgid);
        }

        //START : initInputEvent =======================================================
        $scope.initInputEvent = function(){
            $('input').bind('keydown', function (e) {
                var code = e.keyCode || e.which;
                if (code === 9) {

                    e.preventDefault();
                    //var next = $(this).nextAll('input').first();
                    var $x = $('input');
                    var $next = $x.eq($x.index(this) + 1);
                    $next.focus();
                }
            });

            $('.focusable').bind('keydown', function (e) {
                var code = e.keyCode || e.which;
                if (code === 9) {

                    e.preventDefault();
                    //var next = $(this).nextAll('input').first();
                    var $x = $('.focusable');
                    var $next = $x.eq($x.index(this) + 1);
                    $next.focus();
                }
            });
        }
        $scope.initInputEvent()
        //END   : initInputEvent =======================================================
    }
]);
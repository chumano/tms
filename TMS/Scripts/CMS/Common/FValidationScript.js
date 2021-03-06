var FValidation = (function () {

    var classError = "onerr";
    var classParentError = "has-error";
    var classWarning = "onwarn";
    var classParentWarning = "has-warning";

    //"tooltip": display error meesage as tooltip
    //"following": display error meesage after each control
    var displayMode = "tooltip";

    function MarkupContainer() {
        return "<div class='FValidationToolTip'> </div>";
    }

    function MarkupMessage(message) {
        return "● " + message + "<br>";
    }

    //Call function by Name
    function ExecuteFunctionByName(functionName, args) {
        try {
            var args = Array.prototype.slice.call(arguments, 1);
            var namespaces = functionName.split(".");
            var func = namespaces.pop();
            var context = window;
            for (var i = 0; i < namespaces.length; i++) {
                context = context[namespaces[i]];
            }
            return context[func].apply(this, args);
        }
        catch (err) {
            return false;
        }
    }

    function AddErrorClass(controlPointer, errorMessage) {
        var oldMessage = $(controlPointer).attr("error-message");
        $(controlPointer).addClass(classError);
        $(controlPointer).parent().addClass(classParentError);
        var newMessage = MarkupMessage(errorMessage);
        if (oldMessage) {
            if (oldMessage.indexOf(newMessage) < 0) {
                oldMessage = oldMessage + newMessage;
            }
        }
        else {
            oldMessage = newMessage;
        }
        $(controlPointer).attr("error-message", oldMessage);
        $('.FNotifications').notify({
            message: { text: errorMessage }, type: 'danger'
        }).show();
        InitTooltip(controlPointer);
    }

    //remove all error in control
    function RemoveErrorClass(controlPointer) {
        $(controlPointer).removeClass(classError).removeAttr("error-message");
        $(controlPointer).parent().removeClass(classParentError);
        InitTooltip(controlPointer);
    }

    //remove one error
    function RemoveError(controlPointer, errorMessage) {
        var message = $(controlPointer).attr("error-message");
        if (message) {
            message = message.replace(MarkupMessage(errorMessage), "");
        }
        if (!message) {
            $(controlPointer).removeClass(classError).removeAttr("error-message");
            $(controlPointer).parent().removeClass(classParentError);
        }
        else {
            $(controlPointer).attr("error-message", message);
        }
        InitTooltip(controlPointer);
    }

    function AddWarnClass(controlPointer, warnMessage) {
        var oldMessage = $(controlPointer).attr("warn-message");
        var newMessage = MarkupMessage(warnMessage);
        $(controlPointer).addClass(classWarning);
        $(controlPointer).parent().addClass(classParentWarning);
        if (oldMessage) {
            if (oldMessage.indexOf(newMessage) < 0) {
                oldMessage = oldMessage + newMessage;
            }
        }
        else {
            oldMessage = newMessage;
        }
        $(controlPointer).attr("warn-message", oldMessage);
        InitTooltip(controlPointer);
    }

    function RemoveWarnClass(controlPointer) {
        $(controlPointer).removeClass(classWarning).removeAttr("warn-message");
        $(controlPointer).parent().removeClass(classParentWarning);
        InitTooltip(controlPointer);
    }

    //remove one warn
    function RemoveWarn(controlPointer, warnMessage) {
        var message = $(controlPointer).attr("warn-message");
        if (message) {
            message = message.replace(MarkupMessage(warnMessage), "");
        }
        if (!message) {
            $(controlPointer).removeClass(classWarning).removeAttr("warn-message");
            $(controlPointer).parent().removeClass(classParentWarning);
        }
        else {
            $(controlPointer).attr("warn-message", message);
        }
        InitTooltip(controlPointer);
    }

    //maxFileSize in bytes
    function CheckSize(inputPointer, maxFileSize) {
        if (inputPointer.value == "") return true;
        if (!inputPointer.id) $(inputPointer).attr("id", "file" + Math.random());
        if (navigator.appName == "Microsoft Internet Explorer") {
            var myFSO = new ActiveXObject("Scripting.FileSystemObject");
            var filepath = inputPointer.value;
            var thefile = myFSO.getFile(filepath);
            return (thefile.size < maxFileSize);
        }
        else {
            var fi = document.forms[0].elements[inputPointer.id];
            if (fi != null && typeof (fi) != "undefined" && fi.files[0] != "undefined") {
                return (fi.files[0].size < maxFileSize);
            }
            return true;
        }
    }

    function CheckFileType(inputPointer, fileTypes) {
        var filename = inputPointer.value;
        if (filename) {
            var ext = "";
            for (var i = filename.length - 1; i >= 0; i--) {
                if (filename[i] == '.') break;
                ext = filename[i] + ext;
            }
            ext = ext.toLowerCase();
            fileTypes = fileTypes.toLowerCase();
            return fileTypes.indexOf(ext) >= 0;
        }
        return true; //empty is ok
    }

    function CheckRegExp(str, regExp) {
        if (!str) return false;
        try {
            var patt = new RegExp(regExp, "g");
            var listMatch = str.match(patt);
            if (listMatch) {
                for (var i = 0; i < listMatch.length; i++) {
                    if (listMatch[i].length == str.length) {
                        return true;
                    }
                }
            }
            return false;
        }
        catch (ex) {
            //alert(ex);
            return false;
        }
    }

    function HasCheckedInGroupBox(groupId) {
        var hasChecked = false;
        $("input[group-checkbox=" + groupId + "]").each(function () {
            if ($(this).is(':checked')) hasChecked = true;
        });
        return hasChecked;
    }

    function IsEmptyControl(inputPointer) {
        return !$(inputPointer).val() || (($(inputPointer).is(':checkbox') || $(inputPointer).is(':radio')) && !$(inputPointer).is(':checked'));
    }

    function CheckAllControlInGroup(groupId) {
        var totalControls = 0;
        var emptyControls = 0;
        $("*[check-group=" + groupId + "]").each(function () {
            if (IsEmptyControl(this)) {
                emptyControls++;
            }
            totalControls++;
        });
        return (emptyControls == 0) || (emptyControls == totalControls);
    }

    function AtLeastOneControlInGroup(groupId) {
        var inputtedControls = 0;
        $("*[check-atleast-group=" + groupId + "]").each(function () {
            if (!IsEmptyControl(this)) {
                inputtedControls++;
            }
        });
        return (inputtedControls >= 1);
    }
    //Init tooltip
    var tooltip = null;
    function InitTooltip(inputPointer) {
        if (displayMode == "tooltip") {
            var delta = 10;
            if (!tooltip) {
                $("body").append(MarkupContainer());
                tooltip = $("body").children(":last-child");
            }

            var hasTooltip = "has-tooltip";
            $(inputPointer).each(function () {
                if (!$(this).attr(hasTooltip)) {
                    $(this).attr(hasTooltip, "true");
                    $(this).hover(
						function (e) {
						    var errorMessage = $(this).attr("error-message");
						    var warnMessage = $(this).attr("warn-message");
						    var message = "";
						    if (errorMessage) message = errorMessage;
						    if (warnMessage && !message) message = warnMessage;
						    if (message) {
						        tooltip.css({
						            top: (e.pageY + delta) + "px",
						            left: (e.pageX + delta) + "px"
						        }).show().html(message);
						    }
						},
						function () {
						    tooltip.hide();
						}
					).mousemove(function (e) {
					    tooltip.css({
					        top: (e.pageY + delta) + "px",
					        left: (e.pageX + delta) + "px"
					    });
					}).click(function () {
					    tooltip.hide();
					});
                }
            });
        }
        else if (displayMode == "following") {
            var hasContainer = "has-container";
            $(inputPointer).each(function () {
                if (!$(this).attr(hasContainer)) {
                    $(this).attr(hasContainer, "true").after(MarkupContainer());
                }
                var errorMessage = $(this).attr("error-message");
                var warnMessage = $(this).attr("warn-message");
                var message = "";
                if (errorMessage) message = errorMessage;
                if (warnMessage && !message) message = warnMessage;
                if (message) {
                    $(this).next().show().html(message);
                }
                else {
                    $(this).next().hide();
                }
            });
        }
    }

    function StrimControlValue(control) {
        if ($(control).is('input:text') || $(control).is('textarea')) {
            $(control).val($.trim($(control).val()));
        }
    }

    var _actionId = "";
    function CheckUnderControl(controlActionList) {
        if (!_actionId) return true;
        if (!controlActionList) return false;
        controlActionList = controlActionList.split(";;");
        if (controlActionList) {
            for (var i = 0; i < controlActionList.length; i++) {
                if (controlActionList[i] == _actionId) {
                    return true;
                }
            }
        }
        return false;
    }

    function PostValidateFile() {
        var hasPostCheckSize = "post-check-file-size";
        var ReCheckSize = function () {
            var attrSize = $(this).attr("check-file-size");
            var message = $(this).attr("check-file-size-message");
            if (attrSize && CheckUnderControl($(this).attr("check-under"))) {
                var maxsize = parseInt(attrSize);
                if (CheckSize(this, maxsize)) {
                    RemoveError(this, message);
                }
                else {
                    AddErrorClass(this, message);
                }
            }
            else {
                $(this).unbind("change", ReCheckSize)
				.removeAttr(hasPostCheckSize);
                RemoveError(this, message);
            }
        }
        $("input[check-file-size]").each(function () {
            if (!$(this).attr(hasPostCheckSize)) {
                $(this).bind("change", ReCheckSize);
                $(this).attr(hasPostCheckSize, "true");
            }
        });

        var hasPostCheckType = "post-check-file-type";
        var ReCheckType = function () {
            var types = $(this).attr("check-file-type");
            var message = $(this).attr("check-file-type-message");
            if (types && CheckUnderControl($(this).attr("check-under"))) {
                if (CheckFileType(this, types)) {
                    RemoveError(this, message);
                }
                else {
                    AddErrorClass(this, message);
                }
            }
            else {
                $(this).unbind("change", ReCheckType)
				.removeAttr(hasPostCheckType);
                RemoveError(this, message);
            }
        }
        $("input[check-file-type]").each(function () {
            if (!$(this).attr(hasPostCheckType)) {
                $(this).bind("change", ReCheckType);
                $(this).attr(hasPostCheckType, "true");
            }
        });
    }

    // After validate, it will auto re-check empty and remove error class
    function PostValidateEmpty() {
        var hasPostCheck = "post-check-empty";
        var ReCheck = function () {
            StrimControlValue(this);
            var message = $(this).attr("check-empty-message");
            var holderText = $(this).attr("check-empty");
            if ((holderText || holderText == "") && CheckUnderControl($(this).attr("check-under"))) {
                if (IsEmptyControl(this) || $(this).val() == holderText) {
                    AddErrorClass(this, message);
                }
                else {
                    RemoveError(this, message);
                }
            }
            else {
                $(this).unbind("change", ReCheck)
				.removeAttr(hasPostCheck);
                RemoveError(this, message);
            }
        }
        $("*[check-empty]").each(function () {
            if (!$(this).attr(hasPostCheck)) {
                $(this).bind("change", ReCheck);
                $(this).attr(hasPostCheck, "true");
            }
        });
    }

    // After validate, it will auto re-check maxlength and remove error class
    function PostValidateMaxlength() {
        var hasPostCheck = "post_check_maxlength";
        var ReCheck = function () {
            StrimControlValue(this);
            var length = $(this).attr("check-length");
            var message = $(this).attr("check-length-message");
            if (length && CheckUnderControl($(this).attr("check-under"))) {
                var maxlength = parseInt(length);
                if ($(this).val().length <= maxlength) {
                    RemoveError(this, message);
                }
                else {
                    AddErrorClass(this, message);
                }
            }
            else {
                $(this).unbind("change", ReCheck)
				.removeAttr(hasPostCheck);
                RemoveError(this, message);
            }
        }
        $("*[check-length]").each(function () {
            if (!$(this).attr(hasPostCheck)) {
                $(this).bind("change", ReCheck);
                $(this).attr(hasPostCheck, "true");
            }
        });
    }

    // After validate, it will auto re-check float value and remove error class
    function PostValidateRange() {
        var hasPostCheck = "post-check-range";
        var ReCheck = function () {
            StrimControlValue(this);
            var range = $(this).attr("check-range");
            var message = $(this).attr("check-range-message");
            if (range && CheckUnderControl($(this).attr("check-under"))) {
                range = range.split(";");
                var value = parseFloat($(this).val().replace(/,/g, ''));
                var minValue = parseFloat(range[0]);
                var maxValue = parseFloat(range[1]);
                /*if (value || value == 0) {
                    $(this).val(value);
                }*/
                if (value < minValue || value > maxValue) {
                    AddErrorClass(this, message);
                }
                else {
                    RemoveError(this, message);
                }
            }
            else {
                $(this).unbind("change", ReCheck)
				.removeAttr(hasPostCheck);
                RemoveError(this, message);
            }
        }
        $("*[check-range]").each(function () {
            if (!$(this).attr(hasPostCheck)) {
                $(this).bind("change", ReCheck);
                $(this).attr(hasPostCheck, "true");
            }
        });
    }

    function PostValidateCustom() {
        var hasPostCheck = "post-check-custom";
        var ReCheck = function () {
            StrimControlValue(this);
            var functionName = $(this).attr("check-custom");
            var listMessage = $(this).attr("check-custom-message");
            if (listMessage) {
                listMessage = listMessage.split(";;");
            }
            else {
                listMessage = [];
            }

            if (functionName && CheckUnderControl($(this).attr("check-under"))) {
                functionName = functionName.split(";;");
                for (var i = 0; i < functionName.length; i++) {
                    if (ExecuteFunctionByName(functionName[i], $(this).val())) {
                        RemoveError(this, listMessage[i]);
                    }
                    else {
                        AddErrorClass(this, listMessage[i]);
                    }
                }
            }
            else {
                $(this).unbind("change", ReCheck)
				.removeAttr(hasPostCheck);
                for (var i = 0; i < listMessage.length; i++) {
                    RemoveError(this, listMessage[i]);
                }
            }
        }
        $("*[check-custom]").each(function () {
            if (!$(this).attr(hasPostCheck)) {
                $(this).bind("change", ReCheck);
                $(this).attr(hasPostCheck, "true");
            }
        });
    }

    function PostValidateGroupCheckBox() {
        var hasPostCheck = "post-check-checkbox";
        var ReCheck = function () {
            var groupId = $(this).attr("group-checkbox");
            var message = $(this).attr("group-checkbox-message");
            if (groupId && CheckUnderControl($(this).attr("check-under"))) {
                if (HasCheckedInGroupBox(groupId)) {
                    $("input[group-checkbox=" + groupId + "]").each(function () {
                        RemoveError(this, message);
                    });
                }
                else {
                    $("input[group-checkbox=" + groupId + "]").each(function () {
                        AddErrorClass(this, message);
                    });
                }
            }
            else {
                $(this).unbind("change", ReCheck)
				.removeAttr(hasPostCheck);
                RemoveError(this, message);
            }
        }
        $("input[group-checkbox]").each(function () {
            if (!$(this).attr(hasPostCheck)) {
                $(this).bind("change", ReCheck);
                $(this).attr(hasPostCheck, "true");
            }
        });
    }

    // After validate, it will auto check and remove error class
    function PostValidateGroup() {
        var hasPostCheck = "post-check-group";
        var ReCheck = function () {
            StrimControlValue(this);
            var groupId = $(this).attr("check-group");
            var message = $(this).attr("check-group-message");
            if (groupId && CheckUnderControl($(this).attr("check-under"))) {
                if (CheckAllControlInGroup(groupId)) {
                    $("*[check-group=" + groupId + "]").each(function () {
                        RemoveError(this, message);
                    });
                }
                else {
                    $("*[check-group=" + groupId + "]").each(function () {
                        if (IsEmptyControl(this)) {
                            AddErrorClass(this, message);
                        }
                        else {
                            RemoveError(this, message);
                        }
                    });
                }
            }
            else {
                $(this).unbind("change", ReCheck)
				.removeAttr(hasPostCheck);
                RemoveError(this, message);
            }
        }

        $("*[check-group]").each(function () {
            if (!$(this).attr(hasPostCheck)) {
                $(this).bind("change", ReCheck);
                $(this).attr(hasPostCheck, "true");
            }
        });
    }

    // After validate, it will auto check and remove error class
    function PostValidateAtleastGroup() {
        var hasPostCheck = "post-check-atleast-group";
        var ReCheck = function () {
            StrimControlValue(this);
            var groupId = $(this).attr("check-atleast-group");
            var message = $(this).attr("check-atleast-group-message");
            if (groupId && CheckUnderControl($(this).attr("check-under"))) {
                if (AtLeastOneControlInGroup(groupId)) {
                    $("*[check-atleast-group=" + groupId + "]").each(function () {
                        RemoveError(this, message);
                    });
                }
                else {
                    AddErrorClass(this, message);
                }
            }
            else {
                $(this).unbind("change", ReCheck)
				.removeAttr(hasPostCheck);
                RemoveError(this, message);
            }
        }

        $("*[check-atleast-group]").each(function () {
            if (!$(this).attr(hasPostCheck)) {
                $(this).bind("change", ReCheck);
                $(this).attr(hasPostCheck, "true");
            }
        });
    }

    // After validate, it will auto check and remove error class
    function PostValidateRegExp() {
        var hasPostCheck = "post-check-regexp";
        var ReCheck = function () {
            StrimControlValue(this);
            var regexp = $(this).attr("check-regexp");
            var message = $(this).attr("check-regexp-message");
            if (regexp && CheckUnderControl($(this).attr("check-under"))) {
                if (CheckRegExp($(this).val(), regexp)) {
                    RemoveError(this, message);
                }
                else {
                    AddErrorClass(this, message);
                }
            }
            else {
                $(this).unbind("change", ReCheck)
				.removeAttr(hasPostCheck);
                RemoveError(this, message);
            }
        }

        $("*[check-regexp]").each(function () {
            if (!$(this).attr(hasPostCheck)) {
                $(this).bind("change", ReCheck);
                $(this).attr(hasPostCheck, "true");
            }
        });
    }

    // After validate, it will auto check and remove error class
    function PostValidate() {
        //Check Empty
        PostValidateEmpty();

        //Check Max length
        PostValidateMaxlength();

        //Check min
        PostValidateRange();

        //Check File
        PostValidateFile();

        //Check Custom function
        PostValidateCustom();

        //Check Group check box
        PostValidateGroupCheckBox();

        //Check Group
        PostValidateGroup();

        //
        PostValidateAtleastGroup();

        //Check Reg Exp
        PostValidateRegExp();
    }

    return {
        CommonWarning: function () {
            var ReCheck = function () {
                var functionName = $(this).attr("check-warning");
                if (functionName) {
                    var message = $(this).attr("check-warning-message");
                    if (ExecuteFunctionByName(functionName, $(this).val())) {
                        RemoveWarn(this, message);
                    }
                    else {
                        AddWarnClass(this, message);
                    }
                }
            }
            var hasPostCheck = "post-check-warning";
            $("*[check-warning]").each(function () {
                if (!$(this).attr(hasPostCheck)) {
                    $(this).bind("change", ReCheck);
                    $(this).attr(hasPostCheck, "true");
                }
            });
            return false;
        },

        CheckControls: function (actionId) {

            // After validate, it will auto check and remove error class
            PostValidate();

            //Set new action
            _actionId = actionId;

            var res = true;
            //Reset Error class
            $("." + classError).each(function () {
                RemoveErrorClass(this);
            });

            //Check Empty
            $("*[check-empty]:enabled:visible").each(function () {
                if (CheckUnderControl($(this).attr("check-under"))) {
                    StrimControlValue(this);
                    if (IsEmptyControl(this) || $(this).val() == $(this).attr("check-empty")) {//use for check box and radio
                        res = false;
                        AddErrorClass(this, $(this).attr("check-empty-message"));
                    }
                }
            });

            //Check Max length
            $("*[check-length]:enabled:visible").each(function () {
                if (CheckUnderControl($(this).attr("check-under"))) {
                    StrimControlValue(this);
                    var maxlength = parseInt($(this).attr("check-length"));
                    var message = $(this).attr("check-length-message");
                    if (message) {
                        message = message.replace("{0}", maxlength);
                    }
                    $(this).attr("check-length-message", message);
                    if ($(this).val().length > maxlength) {
                        res = false;
                        AddErrorClass(this, message);
                    }
                }
            });

            //Check min
            $("*[check-range]:enabled:visible").each(function () {
                if (CheckUnderControl($(this).attr("check-under"))) {
                    StrimControlValue(this);
                    var value = parseFloat($(this).val().replace(/,/g, ''));
                    var range = $(this).attr("check-range").split(";");
                    var minValue = parseFloat(range[0]);
                    var maxValue = parseFloat(range[1]);
                    var message = $(this).attr("check-range-message");
                    if (message) {
                        message = message.replace("{0}", $(this).attr("check-range"));
                    }
                    /*if (value || value == 0) {
                        $(this).val(value);
                    }*/
                    if (value < minValue || value > maxValue) {
                        res = false;
                        AddErrorClass(this, message);
                    }
                }
            });

            //Check File size
            $("input[check-file-size]:enabled:visible").each(function () {
                if (CheckUnderControl($(this).attr("check-under"))) {
                    var maxsize = parseInt($(this).attr("check-file-size"));
                    var message = $(this).attr("check-file-size-message");
                    if (message) {
                        message = message.replace("{0}", maxsize);
                    }
                    $(this).attr("check-file-size-message", message);
                    if (!CheckSize(this, maxsize)) {
                        res = false;
                        AddErrorClass(this, message);
                    }
                }
            });

            //Check File size
            $("input[check-file-type]:enabled:visible").each(function () {
                if (CheckUnderControl($(this).attr("check-under"))) {
                    var types = $(this).attr("check-file-type");
                    var message = $(this).attr("check-file-type-message");
                    if (message) {
                        message = message.replace("{0}", types);
                    }
                    $(this).attr("check-file-type-message", message);
                    if (!CheckFileType(this, types)) {
                        res = false;
                        AddErrorClass(this, message);
                    }
                }
            });

            //Check custom function
            $("*[check-custom]:enabled:visible").each(function () {
                if (CheckUnderControl($(this).attr("check-under"))) {
                    StrimControlValue(this);
                    var functionName = $(this).attr("check-custom").split(";;");
                    var listMessage = $(this).attr("check-custom-message");
                    if (listMessage) {
                        listMessage = listMessage.split(";;");
                    }
                    else {
                        listMessage = [];
                    }
                    for (var i = 0; i < functionName.length; i++) {
                        if (!ExecuteFunctionByName(functionName[i], $(this).val())) {
                            res = false;
                            AddErrorClass(this, listMessage[i]);
                        }
                    }
                }
            });

            //Check Group Checkbox
            $("input[group-checkbox]:enabled:visible").each(function () {
                if (CheckUnderControl($(this).attr("check-under"))) {
                    var groupId = $(this).attr("group-checkbox");
                    if (!HasCheckedInGroupBox(groupId)) {
                        res = false;
                        AddErrorClass(this, $(this).attr("group-checkbox-message"));
                    }
                }
            });

            //Check Group
            //Once anyone has value, all of them in group must have value
            //i.e: all control in a row must have value, or all of them don't have value
            $("*[check-group]:enabled:visible").each(function () {
                if (CheckUnderControl($(this).attr("check-under"))) {
                    StrimControlValue(this);
                    var groupId = $(this).attr("check-group");
                    //alert(CheckAllControlInGroup(groupId));
                    if (!CheckAllControlInGroup(groupId) && IsEmptyControl(this)) {
                        res = false;
                        AddErrorClass(this, $(this).attr("check-group-message"));
                    }
                }
            });

            $("*[check-atleast-group]:enabled:visible").each(function () {
                if (CheckUnderControl($(this).attr("check-under"))) {
                    StrimControlValue(this);
                    var groupId = $(this).attr("check-atleast-group");
                    //alert(CheckAllControlInGroup(groupId));
                    if (!AtLeastOneControlInGroup(groupId)) {
                        res = false;
                        AddErrorClass(this, $(this).attr("check-atleast-group-message"));
                    }
                }
            });


            //Check RegExp
            $("*[check-regexp]:enabled:visible").each(function () {
                if (CheckUnderControl($(this).attr("check-under"))) {
                    StrimControlValue(this);
                    var regexp = $(this).attr("check-regexp");
                    if (!CheckRegExp($(this).val(), regexp)) {
                        res = false;
                        AddErrorClass(this, $(this).attr("check-regexp-message"));
                    }
                }
            });

            return res;
        },

        ClearAllError: function () {
            //Remove Error Class
            $("." + classError).each(function () { RemoveErrorClass(this); });
            $("." + classWarning).each(function () { RemoveWarnClass(this); });
            return false;
        }
    };
})();


$(window).load(function () {
    //Init for warning
    FValidation.CommonWarning();
    $("body").append("<div class='FNotifications notifications top-right'></div>");
});
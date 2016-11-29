function ShowErrorMessage(message) {
    $.notify(message, "error");
   
}

function ShowSuccessMessage(message) {
    $.notify(message, "success");
}

jQuery.fn.redraw = function () {
    return this.hide(0, function () {
        $(this).show();
    });
};

function ShowLoading() {
    //$("div#main").showLoading();
    return;
    if ($('button.search i.fa.loading').length == 0) {
        
        $('button.search i.fa').hide().after('<i class="fa fa-spinner white loading"></i>');
        $('button.search').redraw();
    }
}

function HideLoading() {
    //$("div#main").hideLoading();
    return;
    var loading = $('button i.fa.loading');
    loading.prev().show();
    loading.remove();
}

function ShowConfirmModal(msg, okfunc) {
    $("#confirmModal .modal-message").html(msg);
    $("#confirmModal button.modal-ok").unbind('click'); //must have to unbind, otherwise duplicate event is called
    $("#confirmModal button.modal-ok").click(function () {
        okfunc();
        $("#confirmModal").modal('hide');
    });
    //==================================
    $("#confirmModal").modal('show');
    $('#confirmModal').on('shown.bs.modal', function () {
        $("#confirmModal button.modal-ok").focus();
    });
}
//===================================================================================
function AjaxSync(service, para) {
    var result = null;
    $.ajax({
        type: "POST",
        url: service,
        data: para,
        contentType: "application/json",
        async: false,
        beforeSend: ShowLoading,
        complete: HideLoading,
        success: function (data) {
            if (typeof (data) == 'string' && data.startsWith("#error")) {
                ShowErrorMessage(data);
                result = null;
            }
            else {
                result = data;
            }
        },
        error: function (jqXHR, exception) {
            result = [];
            var msg = getAjaxErrorMessage(jqXHR, exception);
            ShowErrorMessage("#error: " + msg);
        }
    });
    return result;
}

function AjaxAsync(service, para, _func) {
    var result = null;
    $.ajax({
        type: "POST",
        url: service,
        data: para,
        contentType: "application/json",
        beforeSend: ShowLoading,
        complete: HideLoading,
        success: function (data) {
            if (typeof (data) == 'string' && data.startsWith("#error")) {
                ShowErrorMessage(data);
                result = null;
            }
            else {
                result = data;
            }

            //===============
            _func(result);
        },
        error: function (e) {
            result = [];
            var msg = getAjaxErrorMessage(jqXHR, exception);
            ShowErrorMessage("#error: " + msg);

            //===============
            _func(result);
        }
    });
}

function getAjaxErrorMessage(jqXHR, exception) {
    var msg = '';
    if (jqXHR.status === 0) {
        msg = 'Not connect.\n Verify Network.';
    } else if (jqXHR.status == 404) {
        msg = 'Requested page not found. [404]';
    } else if (jqXHR.status == 500) {
        msg = 'Internal Server Error [500].';
    } else if (exception === 'parsererror') {
        msg = 'Requested JSON parse failed.';
    } else if (exception === 'timeout') {
        msg = 'Time out error.';
    } else if (exception === 'abort') {
        msg = 'Ajax request aborted.';
    } else {
        msg = 'Uncaught Error.\n' + jqXHR.responseText;
    }

    return msg;
}
//===================================================================================
var CommonHelper = {};
CommonHelper.CopyNeedFields= function (fromObject, toObject) {
    //// Merge object2 into object1
    //$.extend( object1, object2 );

    if (toObject == undefined)
        toObject = {};

    //===================
    //copy chỉ những cái toObject cần (nghĩa là nó đang có thuộc tính đó)
    for (var key in fromObject) {
        var value = fromObject[key];
        if (toObject[key] != undefined) {
            if (value != null && value != undefined) {
                toObject[key] = value + "";
            }
            else {
                toObject[key] = "";
            }
        }
    }
}

CommonHelper.IsNullOrEmpty = function (str) {
    if (str != "" && str != undefined || typeof (str) === "boolean")
        return false;
    return true;
}

CommonHelper.IsSearchableValue = function (val) {
    if (val != undefined && val != '' && val != 0 && !isNaN(val))
        return true;
    return false;
}

CommonHelper.GetImageSrc = function (imgid) {
    return _data_service_getimage + "/" + imgid;
}

CommonHelper.CreateCondition = function (key,data) {
    var type = typeof (data);
    var cond = '1=1';
    switch (type) {
        case 'number':
            cond = key + ' = ' + data;
            break;
        case 'string':
            cond = key + ' like N\'\'%' + data + '%\'\'';
            break;
        case 'boolean':
            cond = key + ' = ' + (data?1:0);
            break;
    }
    return cond;
}

CommonHelper.CopyFields = function (fromObject, toObject) {
    //// Merge object2 into object1
    //$.extend( object1, object2 );

    if (toObject == undefined)
        toObject = {};

    //===================
    //copy chỉ những cái toObject cần (nghĩa là nó đang có thuộc tính đó)
    for (var key in fromObject) {
        var value = fromObject[key];
        if (toObject[key] != undefined) {
            if (value != null && value != undefined) {
                toObject[key] = value;// + "";
            }
            else {
                toObject[key] = "";
            }
        }
    }
}

CommonHelper.OpenInNewTab = function(url) {
    var win = window.open(url, '_blank');
    win.focus();
}

//===================================================================================

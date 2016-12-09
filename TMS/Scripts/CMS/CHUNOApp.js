var CHUNOApp = angular.module('CHUNOApp', ['ngSanitize', 'ngTable', 'ui.bootstrap', 'pascalprecht.translate', 'ngCookies', 'LocalStorageModule']);
//CHUNOApp.requires.push('openlayers-directive');
CHUNOApp.config(function ($translateProvider, localStorageServiceProvider) {
    $translateProvider.translations('en', {
        TITLE: 'Hello',
        FOO: 'This is a paragraph.',
        BUTTON_LANG_EN: 'english',
        BUTTON_LANG_DE: 'german',
        FORM: {
            TITLE : 'Title'
        }
    });
    $translateProvider.translations('vn', {
        TITLE: 'Xin chào',
        FOO: 'Dies ist ein Paragraph.',
        BUTTON_LANG_EN: 'englisch',
        BUTTON_LANG_DE: 'deutsch' ,
        FORM: {
            TITLE : 'Tiêu đề'
        }
    });

    
    $translateProvider.useStaticFilesLoader({
        prefix: 'data/locale-',
        suffix: '.json'
    });
   
    $translateProvider.preferredLanguage('en');
    //$translateProvider.determinePreferredLanguage();

    // remember language
    $translateProvider.useLocalStorage();

    //=====================================
    //localstorage
    localStorageServiceProvider
    .setPrefix('CHUNOAPP')
    //.setStorageType('sessionStorage') //default localStorage , other :sessionStorage
    .setNotify(true, true);
});
/*
var configFunction = function ( $httpProvider, $locationProvider) {


    $httpProvider.interceptors.push('AuthHttpResponseInterceptor');
}
configFunction.$inject = ['$httpProvider', '$locationProvider'];

CHUNOApp.config(configFunction);
*/

$(document).ready(function () {
    

    
});
/*
--KeyCode Tables
Key	Code
tab	    9
enter	13
shift	16
ctrl	17
*/
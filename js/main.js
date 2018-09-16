$(function () {
    $.ajax({
        type: "GET",
        url: "http://codeit.pro/codeitCandidates/serverFrontendTest/company/getList",
        success: function(msg){
            console.log(msg);
            $('.loader').hide();
        }
    });
    $.ajax({
        type: "GET",
        url: "http://codeit.pro/codeitCandidates/serverFrontendTest/news/getList",
        success: function(msg){
            console.log(msg);
            $('.loader').hide();
        }
    });
});
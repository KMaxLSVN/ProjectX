$(function() {
//-----Initializing Variables-----
    let elem = $('.form'),
        f_name = $('#form-f_name'),
        l_name = $('#form-l_name'),
        email = $('#form-email'),
        pass = $('#form-pass'),
        re_name = /^[а-яА-ЯёЁa-zA-Z]{2,}$/,
        re_email = /^\w+([\.-]?\w+)*@(((([a-z0-9]{2,})|([a-z0-9][-][a-z0-9]+))[\.][a-z0-9])|([a-z0-9]+[-]?))+[a-z0-9]+\.([a-z]{2}|(com|net|org|edu|int|mil|gov|arpa|biz|aero|name|coop|info|pro|museum))$/i,
        re_pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
//-----Validation Inputs-----
    f_name.on('keyup change', function () {
        if(!re_name.test(f_name.val())){
            f_name.addClass('is-invalid').removeClass('is-valid');
        }
        else {
            f_name.addClass('is-valid').removeClass('is-invalid');
        }
    });
    l_name.on('keyup change', function () {
        if(!re_name.test(l_name.val())){
            l_name.addClass('is-invalid').removeClass('is-valid');
        }
        else {
            l_name.addClass('is-valid').removeClass('is-invalid');
        }
    });
    email.on('keyup change', function () {
        if(!re_email.test(email.val())){
            email.addClass('is-invalid').removeClass('is-valid');
        }
        else {
            email.addClass('is-valid').removeClass('is-invalid');
        }
    });
    pass.on('keyup change', function () {
       if(!re_pass.test(pass.val())){
           pass.addClass('is-invalid').removeClass('is-valid');
       }
       else {
           pass.addClass('is-valid').removeClass('is-invalid');
       }
    });
//-----Assembly and submission of the form-----
    elem.submit(function () {
        console.log($('.is-invalid'));
        if ($('.is-invalid').length) return false;
        send($(this));
    });
});
function send(form) {
    let data = $(form).serialize();
    let current = $(form);
    $.ajax({
        type: "POST",
        headers: {"Access-Control-Allow-Origin":"*"},
        url: "http://codeit.pro/codeitCandidates/serverFrontendTest/user/registration",//
        data: data,
        success: function(msg){
            //alert('Form send');
            console.log(msg);
            if (msg.status === "Form Error" && msg.status === "Error"){
                $('.serverMes').text(msg.message);
                $('.serverMes').show();
                return false;
            }
            current[0].reset();
            $('.is-valid, .is-invalid', current).removeClass('is-valid').removeClass('is-invalid');
            window.location.replace("step1-2.html");
        }
    })
}
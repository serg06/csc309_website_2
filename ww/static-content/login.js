// login using fields/values from login view
function login() {
    let login_section = $('#login');

    let user = login_section.find('input[name="id"]').val();
    let password = login_section.find('input[name="password"]').val();

    $.ajax({
        method: "POST",
        url: "/api/login/",
        data: {'id': user, 'password': password}
    }).done(function (data, text_status, jqXHR) {
        // success
        successfulLogin();

    }).fail(function (err) {
        let errorField = $('#errorField');

        errorField.text(err.responseJSON.error);
        errorField.show();
    });
}

// this runs on successful login
function successfulLogin() {
    setupGame();
    startGame();

    $('#errorField').hide();
    $('#login').hide();
    $("#high_scores").hide();
    $('#game').show();
    $('nav').show();
}

// log a user in if they're already authenticated, else return to login screen
function authenticate() {
    $.ajax({
        method: "GET",
        url: "/api/auth/"
    }).done(function (data, text_status, jqXHR) {
        // success
        successfulLogin();

    }).fail(function (err) {
        if (window.location.pathname !== '/') {
            window.location.href = '/';
        }
    });
}

// make form ajax-y
$(function () {
    $("#loginForm").on('submit', function (e) {
        login();
        e.preventDefault();
        return false;
    });
});

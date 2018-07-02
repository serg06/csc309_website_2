// Navigation bar

// Navigate to game
function navToGame() {
    // Reset errors
    let errorField = $('#errorField');
    errorField.val('');
    errorField.hide();

    // Show only game section
    $('nav button.selected').removeClass('selected');
    $('nav button[name="game"]').addClass('selected');
    $('.section').hide();
    $('#game').show();
}

// Navigate to user profile
function navToUserProfile() {
    // Reset errors
    let errorField = $('#errorField');
    errorField.val('');
    errorField.hide();

    // Reload the user profile
    reload_user_profile();

    // Show only user profile section
    $('nav button.selected').removeClass('selected');
    $('nav button[name="user_profile"]').addClass('selected');
    $('.section').hide();
    $('#user_profile').show();
}

// Navigate to high scores
function navToHighScores() {
    // Reset errors
    let errorField = $('#errorField');
    errorField.val('');
    errorField.hide();

    // Reload high scores
    populate_high_scores();

    // Show only high scores section
    $('nav button.selected').removeClass('selected');
    $('nav button[name="high_scores"]').addClass('selected');
    $('.section').hide();
    $('#high_scores').show();
}

// logout (this is an ajax request so that our cookie is unset)
function logout() {
    $.ajax({
        method: "POST",
        url: "/api/logout/"
    }).done(function (data, text_status, jqXHR) {
        window.location.href = '/';
    }).fail(function (err) {
        window.location.href = '/';
    });
}

// set up navigation onclicks
$(function () {
    $('nav button[name="game"]').on('click', navToGame);
    $('nav button[name="user_profile"]').on('click', navToUserProfile);
    $('nav button[name="high_scores"]').on('click', navToHighScores);
    $('nav button[name="logout"]').on('click', logout);
});


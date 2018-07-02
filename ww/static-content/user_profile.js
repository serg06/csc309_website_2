// Reload user profile section (asynchronously)
function reload_user_profile() {
    $.ajax({
        method: "GET",
        url: "/api/user/"
    }).done(function (data, text_status, jqXHR) {
        // success
        let user = data.user;
        let user_profile = $('#user_profile');

        user_profile.find('input[name="id"]').val(user.id);
        user_profile.find('input[name="score"]').val(user.score);
        user_profile.find('input[name="name"]').val(user.name);

        $('#errorField').hide();

    }).fail(function (err) {
        let errorField = $('#errorField');

        errorField.text(err.responseJSON.error);
        errorField.show();
    });
}

// update user from values filled in on user_profile page
function update_user() {
    let user_section = $('#user_profile');

    // get passwd/name
    let password = user_section.find('input[name="password"]').val();
    let name = user_section.find('input[name="name"]').val();

    let loading = user_section.find('img[name="loading"]');
    loading.show();

    // send it off
    $.ajax({
        method: "POST",
        url: "/api/update_user/",
        data: {user: {password: password, name: name}}
    }).always(() => {
        // success
        loading.hide();

    }).fail(function (err) {
        let errorField = $('#errorField');

        errorField.text(err.responseJSON.error);
        errorField.show();
    });
}

// delete user! Permanently!!
function delete_user() {
    // send it off
    $.ajax({
        method: "DELETE",
        url: "/api/delete_user/"
    }).done(() => {
        // success
        window.location.href = '/';
    });
}

// make form ajax-y
$(function () {
    $('#user_profile_form').on('submit', function (e) {
        update_user();
        e.preventDefault();
        return false;
    });
});


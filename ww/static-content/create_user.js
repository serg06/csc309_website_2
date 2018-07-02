// create user from values filled in on create_user page
function create_user() {
    let create_user_section = $('#create_user');

    // get user, pw, name
    let user = create_user_section.find('input[name="id"]').val();
    let password = create_user_section.find('input[name="password"]').val();
    let name = create_user_section.find('input[name="name"]').val();

    let submitBtn = create_user_section.find('input[type="submit"]');

    // create through backend
    $.ajax({
        method: "POST",
        url: "/api/create_user/",
        data: {id: user, password: password, name: name}
    }).done(function (data, text_status, jqXHR) {
        // success
        submitBtn.val('User created successfully!');
        submitBtn.attr('disabled', true);
        setTimeout(function () {
            submitBtn.val('Create user');
            submitBtn.attr('disabled', false);
        }, 1000);

    }).fail(function (err) {
        let errorField = $('#errorField');

        errorField.text(err.responseJSON.error);
        errorField.show();
    });
}

// change create-user form to be ajax-y
$(function () {
    $("#createUserForm").on('submit', function (e) {
        create_user();
        e.preventDefault();
        return false;
    });
});

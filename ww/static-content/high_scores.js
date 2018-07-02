// populate high scores on high scores page
function populate_high_scores() {
    $.ajax({
        method: "GET",
        url: "/api/high_scores/"
    }).done(function (data, text_status, jqXHR) {
        // success
        let s = '<table><tr><th></th><th>Name</th><th>Score</th></tr>';

        for (let i = 0; i < 10; i++) {
            s += `<tr><th>${i + 1}</th>`;
            if (i < data.scores.length) {
                s += `<td>${data.scores[i].id}</td><td>${data.scores[i].score}`;
            } else {
                s += '<td></td><td></td>';
            }
            s += '</tr>';
        }

        s += '</table>';

        $('#high_scores_section').html(s);

    }).fail(function (err) {
        let errorField = $('#errorField');

        errorField.text(err.responseJSON.error);
        errorField.show();
    });
}

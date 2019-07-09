"Use strict";
var $ = window.$;
var ko = window.ko;

const updateMemberForm = {
    first_name: ko.observable($('#update-member-form input.first_name').data('init')),
    last_name: ko.observable($('#update-member-form input.last_name').data('init')),
    gender: ko.observable($('#update-member-form select.gender').data('init')),
    email:ko.observable($('#update-member-form input.email').data('init'))
};

updateMemberForm.submit = async function(formBody) {
    var input = {...updateMemberForm};
    delete input.submit;
    try {
        var response = await $.ajax( '/api/members/'+$(formBody).data('id'), { data:input, method:'PUT'});
        if ( response ) {
            alert( response.msg );
        }
        console.log(response);
    } catch (err) {
        alert('Failed to update member');
        console.error(err);
    }
    
}

ko.applyBindings(updateMemberForm, document.getElementById('update-member-form'));
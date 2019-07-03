"Use strict";
var $ = window.$;
var ko = window.ko;

const addMemberForm = {
    first_name: '',
    last_name: '',
    gender: '',
    email:''
};

addMemberForm.submit = function(formBody) {
    var input = {...addMemberForm};
    delete input.submit;
    var response = $.ajax( '/api/members', { data:input, method:'POST'});
    console.log(response);
    alert(response.status + ': ' + response.responseJSON);
}

ko.applyBindings(addMemberForm, document.getElementById('create-members-form'));
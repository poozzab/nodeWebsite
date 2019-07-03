"Use strict";
var $ = window.$;
var ko = window.ko;
var _ = window._;

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

_.forEach(document.getElementsByClassName('delete-member-button'), (form)=> {
    var buttonModel = {};
    buttonModel.submit = function(formBody) {
        var response = $.ajax( '/api/members/' + $(formBody).data('id'), {method:'DELETE'});
        console.log(response);
    };
    ko.applyBindings( buttonModel, form );
});
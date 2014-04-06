var formValidation = function(name, email, password, verifyPassword) {
  //Email Validation in JavaScript http://www.marketingtechblog.com/javascript-regex-emailaddress/#ixzz2y7xv1RHq
  console.log(arguments);
  function checkEmail(email){
    var pattern=/^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
    if(pattern.test(email)){
      return true;
    }else{
      $('#errors').html('Please provide a valid Email');
//      alert('Please provide a valid Email');
      return false;
    }
  }
  if(name===''|| email==='' || password===''|| verifyPassword===''){
    $('#errors').html('One of your fields have not been filled');
    return false;
  }
  if(password!==verifyPassword){
    $('#errors').html('Your passwords don\'t match');
    return false;
  }
  if(checkEmail(email)===false) return false;

  return true;
};

module.exports = formValidation;
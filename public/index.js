setInterval(() => {
  if(document.getElementsByClassName("3checkboxes")){
    limitCheckBoxes()
  }
}, 500);

const checkPassword = () => {
    if (document.getElementById('password').value !=
      document.getElementById('retypePassword').value) {
      document.getElementById('matchingPassword').style.color = 'red';
      document.getElementById('matchingPassword').innerHTML = 'Passwords Do Not Match';
      return false;
    } else {
      return true;
    }
}

const limitCheckBoxes = () => {
  let checkboxes = document.getElementsByClassName("3checkboxes")
  let max = 3;
  for (let i = 0; i < checkboxes.length; i++){
    checkboxes[i].addEventListener('click',() => {
      let checkedcount=0;
      for (let i = 0; i < checkboxes.length; i++)
      {
        checkedcount += (checkboxes[i].checked) ? 1 : 0;
        if (checkedcount > max)
        {
          checkboxes[i].checked = false;
        }
      }
    });
  }
}

const checkCheckBoxes = () => {
  let checkboxes = document.getElementsByClassName("3checkboxes")
  let max = 3;
  let checkedcount = 0;
  for (let i = 0; i < checkboxes.length; i++){
      checkedcount += (checkboxes[i].checked) ? 1 : 0;
  }
  if (checkedcount == max){
    return true;
  } else {
    document.getElementById('validChecks').style.color = 'red';
    document.getElementById('validChecks').innerHTML = 'Please select 3 checkboxes';
    return false;
  }
}
var cfg = new Config();

function ConfigCallback(){
  this.instance;
  this.showConfigPopup = function(){
    var elem = document.querySelector('#configModal');
    instance = M.Modal.init(elem, {dismissible: false});
    instance.open();
  }

  this.createConnection = function(){

  }

  this.updateStatus = function(text){
    if(text==='Connected to database'){
      document.getElementById('status').style.color='green';
      setTimeout(function(){
        instance.close();
      }, 500);

      var elem = document.querySelector('.loader');
      elem.parentNode.removeChild(elem);
      document.querySelector('#selection').style.display="block";
    }
    document.getElementById('status').innerText = text;


  }
}

window.addEventListener('load', function() {
    console.log('All contents are loaded');
    init();
});

function init(){
  document.getElementById('restoreBtn').onclick = function(){
    window.location = 'restore.html';
  }


}

cfg.setObject(new ConfigCallback());
var localStorage = window.localStorage;
if(localStorage.getItem('user_name')){
  document.addEventListener('DOMContentLoaded', (event) => {
    var elem = document.querySelector('.loader');
    elem.parentNode.removeChild(elem);
    document.querySelector('#selection').style.display="block";
    //the event occurred
  });

  //nothing to do. backup.js will handle connection from localStorage
}else{
  cfg.checkConfig();
}




function onKeyPress(evt){
  if(evt.keyCode==13){
    saveConfig();
    return true;
  }
}

function loadBackup(){
  window.location = 'backup.html';
}

function saveConfig(){
  var user_name = document.getElementById('username').value;
  if(!user_name)
    user_name = document.getElementById('username').placeholder;
  var password = document.getElementById('password').value;
  if(!password)
    password = document.getElementById('password').placeholder;
  var database = document.getElementById('database').value;
  if(!database)
    database = document.getElementById('database').placeholder;
  var remember = document.getElementById('remember').checked;

  var host_port = document.getElementById('host_port').value;
  if(!host_port)
    host_port = document.getElementById('host_port').placeholder;
  cfg.saveConnection(user_name, password, host_port, database, remember);
  var localStorage = window.localStorage;
  localStorage.setItem('user_name', user_name);
  localStorage.setItem('password', password);
  localStorage.setItem('database', database);
  localStorage.setItem('host_port', host_port);
  localStorage.setItem('remember', remember);
}

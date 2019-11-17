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
      }, 3000);

      var elem = document.querySelector('.loader');
      elem.parentNode.removeChild(elem);

    }
    document.getElementById('status').innerText = text;


  }
}

cfg.setObject(new ConfigCallback());
cfg.checkConfig();


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
  var remember = document.getElementById('remember').Value;

  var host_port = document.getElementById('host_port').value;
  if(!host_port)
    host_port = document.getElementById('host_port').placeholder;
  cfg.saveConnection(user_name, password, database, remember);
}

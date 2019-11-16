var cfg = new Config();
function ConfigCallback(){
  this.showConfigPopup = function(){
    var elem = document.querySelector('#configModal');
    var instance = M.Modal.init(elem, {dismissible: false});
    instance.open();
  }

  this.createConnection = function(){

  }
}

cfg.setObject(new ConfigCallback());
cfg.checkConfig();

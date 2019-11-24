var dbListElm = document.getElementById('databaseList');
var dbMan = new DbManager();
var selectedDbNames = new Array();


function onConnectionSuccess(){
  dbMan.getAllDatabases((obj)=>populateDatabases(obj));
}


function populateDatabases(obj){
  obj.databases.forEach((item) => {
    console.log('item ', item);
    var elm = document.getElementById('databaseList');
    var liElm = document.createElement('li');
    liElm.setAttribute('class', 'collection-item');
    liElm.setAttribute('onclick', 'onDbSelect(this)')
    liElm.innerText = item;
    elm.appendChild(liElm);

  });
}

function onDbSelect(elm){
  if(elm.getAttribute('class').indexOf('selected')>-1){
    elm.setAttribute('class', 'collection-item');
  }else{
    elm.setAttribute('class', 'collection-item selected');
  }

  console.log('clicked db ', elm.innerText);
}

function onConnectionFailure(){

}

function onDbSelectNext(){
  var elm = document.getElementById('databaseList');
  var selectedList = elm.querySelectorAll('.collection-item.selected');

  for(var i=0; i < selectedList.length; i++){
    console.log(selectedList[i]);
    selectedDbNames.push(selectedList[i]);
  }

  elm.style.display = 'none';
  document.getElementById('saveProgress').style.display='block';
  document.getElementById('nextBtn').style.display='none';
  document.getElementById('saveBtn').style.display='inline-block';
}

function onSaveClick(){
  var filePath = document.getElementById('filePath').value;
  if(!filePath){
    var toastHTML = '<span>File path is invalid</span>';
    //M.toast({html: toastHTML});
  }
}

function updateFolder(elm){
  var path = elm.files[0].path;
  document.getElementById('filePath').value = path;
}

dbMan.setConnectionCallback(onConnectionSuccess, onConnectionFailure);

var localStorage = window.localStorage;
console.log('localStorage ', localStorage.getItem('remember'));
if(localStorage.getItem('remember')==='false'){
  console.log('config not saved');
  var uname = localStorage.getItem('user_name');
  var password = localStorage.getItem('password');
  var database = localStorage.getItem('database');
  dbMan.createConnection(uname, password, database);
}
//dbMan.parseConfig();

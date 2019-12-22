var dbMan = new DbManager();
var connectionSucceeded = false;
var mysqlDir;

const FOLDER_SECTION = 1;
const DB_SELECTION = 2;
const PROGRESS = 3;


window.addEventListener('load', function() {
    console.log('All contents are loaded');
    init();
});

function init(){
  document.getElementById('nextBtn').addEventListener('click', function(){
    showDatabases();
  });

  dbMan.setConnectionCallback(onConnectionSuccess, null);

  var localStorage = window.localStorage;
  console.log('localStorage ', localStorage.getItem('remember'));
  if(localStorage.getItem('remember')==='false'){
    console.log('config not saved');
    var uname = localStorage.getItem('user_name');
    var password = localStorage.getItem('password');
    var database = localStorage.getItem('database');
    dbMan.createConnection(uname, password, database);
  }

  var addBtn = document.getElementById('addBtn');
  addBtn.addEventListener('click', function(){
    document.getElementById('addList').style.display="block";
  });

  document.getElementById('saveDb').addEventListener('click', function(){
    var dbName = document.getElementById('dbName').value;
    dbMan.createDatabase(dbName, function(msg){
      addDbToList(dbName);
      document.getElementById('addList').style.display="none";
    });
  });
}

function onConnectionFailure(){
  connectionSucceeded = false;
}

function onConnectionSuccess(){
  connectionSucceeded = true;
}



function showDatabases(){
  if(connectionSucceeded){

    showPage(DB_SELECTION);
    dbMan.getAllDatabases((obj)=>populateDatabases(obj));
    dbMan.getDirectory((path)=> mysqlDir = path);
  }else{
    //TODO Show db connection popup
  }

}

function showPage(pageNum){
  if(pageNum == DB_SELECTION){
    document.getElementById('databaseSelection').style.display = 'block';
    document.getElementById('progressContainer').style.display = 'none';
    document.getElementById('folderSelection').style.display = 'none';
  }else if(pageNum == PROGRESS){
    document.getElementById('databaseSelection').style.display = 'none';
    document.getElementById('progressContainer').style.display = 'block';
    document.getElementById('folderSelection').style.display = 'none';
  }else{
    document.getElementById('databaseSelection').style.display = 'none';
    document.getElementById('progressContainer').style.display = 'none';
    document.getElementById('folderSelection').style.display = 'block';
  }
}


function populateDatabases(obj){
  obj.databases.forEach((item) => {
    console.log('item ', item);
    addDbToList(item);

  });
}

function addDbToList(item){
  var elm = document.getElementById('databaseList');
  var liElm = document.createElement('li');
  liElm.setAttribute('class', 'collection-item');
  liElm.setAttribute('onclick', 'onDbSelect(this)')
  liElm.innerText = item;
  elm.appendChild(liElm);
}


function updateFolder(elm){
  var path = elm.files[0].path;
  document.getElementById('filePath').value = path;
}

var dbMan = new DbManager();
var connectionSucceeded = false;
var mysqlDir;
var selectedDbNames = new Array();
var sourceDir;

const FOLDER_SELECTION = 1;
const DB_SELECTION = 2;
const PROGRESS = 3;

var currentPage = FOLDER_SELECTION;


window.addEventListener('load', function() {
    console.log('All contents are loaded');
    init();
});

function init(){
  document.getElementById('nextBtn').addEventListener('click', function(){
    if(document.getElementById('nextBtn').text==='Next')
      onNextClick();
    else
      window.location = "index.html";
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
    currentPage = DB_SELECTION;
    document.getElementById('databaseSelection').style.display = 'block';
    document.getElementById('progressContainer').style.display = 'none';
    document.getElementById('folderSelection').style.display = 'none';
  }else if(pageNum == PROGRESS){
    currentPage = PROGRESS;
    document.getElementById('databaseSelection').style.display = 'none';
    document.getElementById('progressContainer').style.display = 'block';
    document.getElementById('folderSelection').style.display = 'none';
  }else{
    currentPage = FOLDER_SELECTION;
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

function onDbSelect(elm){
  var selectedElm = document.querySelector('.collection-item.selected');
  if(selectedElm){
    selectedElm.setAttribute('class', 'collection-item');
  }
  if(elm.getAttribute('class').indexOf('selected')>-1){
    elm.setAttribute('class', 'collection-item');
  }else{
    elm.setAttribute('class', 'collection-item selected');
  }

  console.log('clicked db ', elm.innerText);
}

function onNextClick(){
  if(currentPage==FOLDER_SELECTION){
    sourceDir = document.getElementById('filePath').value;
    showPage(DB_SELECTION);
    showDatabases();
  }
  else if(currentPage == DB_SELECTION){
    var selectedElm = document.querySelector('.collection-item.selected');
    selectedDbNames.push(selectedElm.innerText);
    showPage(PROGRESS);
    var startTime = new Date().getTime();
    dbMan.restoreDatabase(sourceDir, mysqlDir, selectedDbNames[0], function(percent, text){
      var progress = document.getElementById('progress');
      percent = Math.round(percent);
      progress.setAttribute('class', 'c100 p'+percent);
      progress.firstElementChild.innerText=percent;
      document.getElementById('statusText').innerText = text;
      if(percent==100){
        var endTime  = new Date().getTime();
        var timeTaken = endTime - startTime;
        timeTaken = timeTaken/1000;
        console.log('time taken ', timeTaken);
        document.getElementById('statusText').innerText = text+" in "+timeTaken.toFixed(3)+" seconds";
        document.getElementById('nextBtn').text = 'Home';
      }
    });
  }
}

function updateFolder(elm){
  var path = elm.files[0].path;
  document.getElementById('filePath').value = path;
}

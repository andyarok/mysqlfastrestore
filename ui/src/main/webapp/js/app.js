var Config = function(){
	var obj = null;
	var fs = require('fs');
	var mysql = require('mysql');	
	
	this.checkConfig = function(){
		var self = this;
		console.log('Checking config');
		fs.access('config.json', fs.constants.F_OK, function(err) {
  			if(err){
  				self.createConfig();
  			}else{
  				console.log('debug 1 ',obj);
  				obj.createConnection();
  				console.log('debug 2');
			}
		});
		
	}
	
	this.setObject = function(gwtObj){
		obj = gwtObj;
	}
	
	this.createConfig = function(){
		console.log('Config File does not exist ', obj);
		var msg = 'Configuring your application';
		var self = this;
		obj.updateStatus(msg);
		obj.setProgress(0.15);
		var connection = mysql.createConnection({
		  host     : 'localhost',
		  user     : 'root',
		  password : 'andyflow',
		  database : 'privatecloud'
		});
		
		connection.connect(function(err){
			if(err){
				console.log('error connecting to database');
			}else{
				console.log('connected successfully');
				self.writeConfig('root', 'andyflow','localhost', 'privatecloud');
				obj.updateStatus('Connected to database');
				obj.setProgress(1.00);
			}
		});
	}
	
	
	
	this.writeConfig = function(user, password, host, database){
		var configObj = new Object();
		configObj.host = host;
		configObj.user = user;
		configObj.password = password;
		configObj.database = database;
		
		var configStr = JSON.stringify(configObj);
		fs.writeFile('config.json', configStr, function(err){
			if(err){
				console.log('error writing config file');
			}
		});
	}
	
	
	
}

var DbManager = function(){
	
	var conn = null;
	var obj = null;
	var fs = require('fs');
	var mysql = require('mysql');
	var sudo = require('sudo-prompt');
	
	this.parseConfig = function(){
		var self = this;
		fs.readFile('config.json', function(err, data){
			if(err)
				throw err;
			else{
				var configStr = data;
				console.log(configStr);
				var configObj = JSON.parse(configStr);
				console.log('parsing config file ', configObj.database);
				self.createConnection(configObj.user, configObj.password, configObj.host, configObj.database);
			}
				
		});
	}
	
	this.setObject = function(gwtObj){
		obj = gwtObj;
		console.log('set object called ', obj);
	}
	
	this.createConnection = function(puser, ppassword, phost, pdatabase){
		console.log('Creating connection');
		var self = this;
		conn = mysql.createConnection({
			  host     : phost,
			  user     : puser,
			  password : ppassword,
			  database : pdatabase
			});
		console.log('Creating connection 1 ', conn );
			conn.connect(function(err){
				if(err){
					console.log('error connecting to database');
				}else{
					console.log('connected successfully after parsing', obj);
					obj.updateStatus('Connected to database');
					obj.setProgress(1.00);
					obj.onSuccessfullConnect();
				}
			});
		
	}
	
	this.saveDatabase = function(dbName, destination){
		var self = this;
		var date = new Date();
		var tStamp = date.getTime();
		var fName = destination+'/'+dbName+'_'+date;
		var files = new Array();
		fs.mkdirSync(fName);
		var stream = fs.createWriteStream(fName+"/structure.sql", {flags:'a'});
		var qryStr = "SELECT TABLE_NAME FROM information_schema.TABLES where TABLE_SCHEMA= '"+dbName+"'"; 
		conn.query(qryStr,function(err, results, fields){
			for(var i=0; i < results.length;i++ ){
				self.saveCreateTable(results[i].TABLE_NAME, stream);
				self.saveTableData(results[i].TABLE_NAME, dbName, tStamp, files);
			}
			console.log('files list ', files);
			self.moveFilesToDestination(files);
		});
		
	}
	
	this.saveTableData = function(table_name, dbName, tStamp, files){
		var file_name = "/var/lib/mysql-files/"+dbName+"_"+table_name+"_"+tStamp+".csv";
		files.push(file_name);
		var qryStr = "SELECT * FROM "+ table_name+" INTO OUTFILE '" + file_name + "' "
						+" FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' LINES TERMINATED BY '\\n'";
		console.log("save data qry "+qryStr);
		var self = this;
		conn.query(qryStr,function(err, results, fields){
			if(err) console.log(err);
			console.log('result ', results);
		});
	}
	
	this.moveFilesToDestination = function(files){
		
	}
	
	this.saveCreateTable = function(table_name, stream){
		var qryStr = "SHOW CREATE TABLE "+ table_name;
		var self = this;
		conn.query(qryStr,function(err, results, fields){
			stream.write(results[0]['Create Table']+';\n');
			
		});
	}
	
	this.getAllDatabases = function(cbk){
		console.log('get all databases called');
		conn.query("show databases", function (error, results, fields) {
			if(error) throw error;
			  console.log('The solution is: ', results);
			  var dataObj = new Object();
			  dataObj.databases = new Array();
			  for(var i=0; i < results.length;i++ ){
				  dataObj.databases.push(results[i].Database);
			  }
			  cbk(JSON.stringify(dataObj));
		});

		
	}
		
	this.getDirectory = function(){
		console.log('Checking file priv directory');
		
		conn.query("show variables like 'secure_file_priv'", function (error, results, fields) {
			if(error) throw error;
			  console.log('The solution is: ', results[0].Value);
			return results[0].value;
		});
	}
	
}

var Util = function(){
	
	this.clickBrowse = function(callback){
		var elm = document.getElementById('selector');
		elm.addEventListener('input', function(evt){
			callback(elm.value);
		});
		elm.click();
	}
}

var Config = function(){
	var obj = null;
	var fs = require('fs');
	var mysql = require('mysql');

	this.checkConfig = function(){
		var self = this;
		console.log('Checking config');
		fs.access('config.json', fs.constants.F_OK, function(err) {
  			if(err){
  				obj.showConfigPopup();
  			}else{
  				obj.createConnection();
			}
		});

	}

	this.setObject = function(gwtObj){
		obj = gwtObj;
	}

	/*this.createConfig = function(username, password){
		console.log('Config File does not exist ', obj);
		var msg = 'Configuring your application';
		var self = this;
		obj.updateStatus(msg);
		obj.setProgress(0.15);
		var connection = mysql.createConnection({
		  host     : 'localhost',
		  user     : 'root',
		  password : 'root',
		  database : ''
		});

		connection.connect(function(err){
			if(err){
				console.log('error connecting to database');
			}else{
				console.log('connected successfully');
				self.writeConfig('root', 'andyflow','localhost', '');
				obj.updateStatus('Connected to database');
				obj.setProgress(1.00);
			}
		});
	}*/
	
	this.testConnection = function(user_name, password, database, remember){
		var self = this;
		var connection = mysql.createConnection({
			  host     : 'localhost',
			  user     : user_name,
			  password : password,
			  database : database
		});
		connection.connect(function(err){
			if(err){
				console.log('error connecting to database');
				obj.updateStatus("Error connecting to database");
				obj.setProgress(0.25);
			}else{
				if(remember)
					self.writeConfig(user_name, password,'localhost', database);
				obj.updateStatus('Connected to database');
				obj.setProgress(1.00);
				connection.close();
				
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
	var fs = require('fs');
	var mysql = require('mysql');
	var sp = require('sudo-prompt');
	var progressCbk = null;
	var connSuccessCbk = null;
	var connFailureCbk = null;

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
				self.createConnection(configObj.user, configObj.password, configObj.database);
			}

		});
	}
	

	this.setSaveProgressCallback = function(callbackObj){
		progressCbk = callbackObj;
	}
	
	this.setConnectionCallback = function(successCbk, failureCbk){
		connSuccessCbk = successCbk;
		connFailureCbk = failureCbk;
	}

	this.createConnection = function(puser, ppassword, pdatabase){
		console.log('Creating connection');
		var self = this;
		conn = mysql.createConnection({
			  host     : 'localhost',
			  user     : puser,
			  password : ppassword,
			  database : pdatabase,
			  multipleStatements: true
			});
		conn.connect(function(err){
			if(err){
				console.log('error connecting to database');
				if(connFailureCbk){
					connFailureCbk();
				}
			}else{
				console.log('connected successfully after parsing');
				if(connSuccessCbk){
					connSuccessCbk();
				}
				
			}
		});

	}

	this.saveDatabase = function(dbName, srcFolder, destination){
		var self = this;
		var date = new Date();
		var tStamp = date.getTime();
		var fName = destination+'/'+dbName+'_'+tStamp;
		var files = new Object();
		files.size = 0;
		files.list = new Array();
		fs.mkdirSync(fName);
		console.log('mysql dir ', srcFolder);
		var stream = fs.createWriteStream(fName+"/structure.sql", {flags:'a'});
		var qryStr = "SELECT TABLE_NAME FROM information_schema.TABLES where TABLE_SCHEMA= '"+dbName+"' and TABLE_TYPE='BASE TABLE'";
		conn.query(qryStr,function(err, results, fields){
			files.size=results.length;
			for(var i=0; i < results.length;i++ ){
				self.saveCreateTable(dbName, results[i].TABLE_NAME, stream);
				self.saveTableData(results[i].TABLE_NAME, dbName, tStamp, files,srcFolder, fName);
			}
			console.log('files list ', files);

		});

	}



	this.saveTableData = function(table_name, dbName, tStamp, files, srcFolder,destination){
		var os = require('os');
		var linux = true;
		var platform = os.platform();
		var file_name = srcFolder+dbName+"_"+table_name+"_"+tStamp+".csv";
		if(platform.indexOf('win')>-1){
			linux=false;
			file_name = srcFolder.replace(/\\/g,'/')+dbName+"_"+table_name+"_"+tStamp+".csv";
		}

		var fObj = new Object();
		fObj.fileName = srcFolder+dbName+"_"+table_name+"_"+tStamp+".csv";
		fObj.tableName = table_name;
		var qryStr = "SELECT * FROM "+dbName+"."+ table_name+" INTO OUTFILE '" + file_name + "' "
						+" FIELDS TERMINATED BY ','  ENCLOSED BY '\"' LINES TERMINATED BY '\\r\\n'";
		console.log("save data qry "+qryStr);
		var self = this;

		conn.query(qryStr,function(err, results, fields){
			if(err) console.log(err);

			files.list.push(fObj);
			var percent = files.list.length*80.0/files.size;
			progressCbk(percent*1.0, "Saving "+table_name);
			console.log('result ', results);

			console.log('num ', files.list.length, " nim ", files.size, "percent ", percent);

			if(files.size==files.list.length){
				self.moveFilesToDestination(files, destination, linux);
				var fileListStr = JSON.stringify(files);
				fs.writeFile(destination+'/files.json', fileListStr, function(err){
					if(err){
						console.log('error writing config file');
					}
				});
			}
		});
	}

	this.moveFilesToDestination = function(files, destination, linux){

		var cmd = '';
		if(linux){

			cmd += 'mv ';
			console.log('moving files to destination '+destination);

			for(var i=0; i < files.list.length; i++){
					cmd += '\"'+files.list[i].fileName+'\" '

			}
			cmd+='\"'+destination+'\"';
		}else{
			console.log('moving files to destination '+destination);

			for(var i=0; i < files.list.length; i++){
					cmd += 'move \"'+files.list[i].fileName+'\" '+ '\"'+destination+'\"';
					if(i<files.list.length-1){
						cmd+=' & '
					}
			}

		}

		console.log('command ', cmd);
		sp.exec(cmd, {name: 'Fast Backup'}, function(err, sout, serr){
			if(err) throw err;
			console.log(new Date().getTime());
			progressCbk(100.0, "Saved successfully");
		});

	}

	this.saveCreateTable = function(db_name, table_name, stream){

		var qryStr = "SHOW CREATE TABLE "+db_name+'.'+ table_name;
		var self = this;
		console.log('in create table '+qryStr);
		conn.query(qryStr,function(err, results, fields){
			console.log('create table result ', results);
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


	this.getDirectory = function(dbCallback){
		console.log('Checking file priv directory');

		conn.query("show variables like 'secure_file_priv'", function (error, results, fields) {
			if(error) throw error;

			  var mysqlPath = results[0].Value;
			  console.log('The solution is: ', mysqlPath);
			dbCallback(mysqlPath);
		});
	}

	this.restoreDatabase = function(folderName, destination, dbName, callback){
		console.log(new Date().getTime());
		//Using nested callbacks. rather prefer using promises
		var self = this;
		self.loadPreImportScript(function (status){
			fs.readFile(folderName+"/structure.sql", function(err, data){

				var qryData = 'use '+dbName+'; '+data;
				//console.log('file data ', qryData);
				conn.query(qryData, function (error, results, fields){
					if(error) throw error;
					//console.log('Import of db structure result is: ', results);
					callback(15, "Imported Structure");
					self.importData(folderName, destination, dbName, callback);
				});
			});
		});

	}

	this.loadPreImportScript = function(callback){
		fs.readFile('pre-import.sql', function(err, data){
			if(err) throw err;
			var qry = ''+data;
			//console.log(qry);
			conn.query(qry, function(err, results, fields){
				callback("done");
			});
		});
	}

	this.loadPostImportScript = function(callback){
		fs.readFile('post-import.sql', function(err, data){
			conn.query(data, function(err, results, fields){
				callback("done");
			});
		});
	}

	this.importData = function(folderName, destination, dbName, progressCbk){
		console.log('import data '+folderName);
		var self = this;
		var os = require('os');
		var linux = true;
		var platform = os.platform();
		if(platform.indexOf('win')>-1){
			linux = false;
		}
		fs.readFile(folderName+'/files.json', function(err, data){
			if(err)
				throw err;
			else{
				var fileListStr = data;
				var filesObj = JSON.parse(fileListStr);
				var cmd = '';
				var files = new Array();
				if(linux){
					cmd+="cp ";
					for(var i=0; i<filesObj.list.length; i++){
						var fullName = filesObj.list[i].fileName;
						var tableName = filesObj.list[i].tableName;
						var fileName = fullName.substring(fullName.lastIndexOf('/')+1);
						var fileData = new Object();
						fileData.fileName = fullName;
						fileData.tableName = tableName;
						files.push(fileData);
						cmd+='\"'+folderName+'/'+fileName+'\" ';

					}
					cmd+='\"'+destination+'\"';

				}
				else{
					for(var i=0; i<filesObj.list.length; i++){
						var fullName = filesObj.list[i].fileName;
						var tableName = filesObj.list[i].tableName;
						var fileName = fullName.substring(fullName.lastIndexOf('\\')+1);
						var fileData = new Object();
						fileData.fileName = fullName;
						fileData.tableName = tableName;
						files.push(fileData);
						cmd+='copy \"'+folderName+'\\'+fileName+'\" '+'\"'+destination+'\"';
						if(i<filesObj.list.length-1){
							cmd+=' & '
						}
					}
				}

				//console.log('command for restore ', cmd);
				//console.log('files to load data ', files);
				progressCbk(30, 'Copying files');
				sp.exec(cmd, {name: 'Fast Backup'}, function(err, sout, serr){
					if(err) throw err;
					self.loadData(files, progressCbk);
					progressCbk(35, "Copied files to mysql file directory");


				});
			}

		});
	}

	this.loadData = function(files, progressCbk){
		console.log('files ', files);
		var qry ="";
		var fileTrack = new Object();
		fileTrack.completedCount = 0;
		progressCbk(35, "Importing "+files[0].tableName);
		console.log("Importing "+files[0].tableName);
		for(var i=0; i < files.length; i++){
			qry=" LOAD DATA INFILE '"+files[i].fileName.replace(/\\/g,'/')+"' INTO TABLE "+files[i].tableName+" FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\\r\\n'; commit;";
			//console.log('qry '+qry);
			conn.query(qry, function(err, results, fields){
				fileTrack.completedCount++;
				var percent = 35.0 + fileTrack.completedCount*65.0/files.length;
				console.log('load data result '+files[fileTrack.completedCount-1].tableName, results);
				progressCbk(percent, "Importing "+files[fileTrack.completedCount].tableName);
				console.log(new Date().getTime());
				console.log(fileTrack.completedCount+" - "+files.length);
				if(fileTrack.completedCount+1==files.length){
					progressCbk(percent, "Database imported successfully");
				}

			});
		}

	}

	this.createDatabase = function(dbName, dbCallback){
		conn.query('create schema '+dbName, function(error, results, fields){
			if(error) throw error;
			console.log('database created successfully ', results);
			dbCallback('successfully created');
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

	this.close = function(){
		var gui = require('nw.gui');
		var win = gui.Window.get();
		win.close(true);
	}
}

var config = function(obj){
	var fs = require('fs');
	var mysql = require('mysql');	
	function checkConfig(){
		fs.access('config.json', fs.constants.F_OK, function(err) {
  			if(err){
  				createConfig();
  			}else{
				parseConfig();
			}
		});
		
	}
	
	function createConfig(){
		console.log('Config File does not exist');
		var msg = 'Configuring your application';
		obj.@com.quasle.mysqlfastbackup.client.ConfigScreen::updateStatus(Ljava/lang/String;)(msg);
		obj.@com.quasle.mysqlfastbackup.client.ConfigScreen::setProgress(D)(0.15);
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
				writeConfig('localhost', 'root', 'andyflow', 'privatecloud');
				obj.@com.quasle.mysqlfastbackup.client.ConfigScreen::updateStatus(Ljava/lang/String;)('Connected to database');
				obj.@com.quasle.mysqlfastbackup.client.ConfigScreen::setProgress(D)(0.25);
				getDirectory(connection);
			}
		});
	}
	
	function parseConfig(){
		console.log('parsing config file');
		fs.readFile('config.json', function(err, data){
			if(err)
				throw err;
			else{
				var configStr = data;
				console.log(configStr);
				
			}
				
		});
	}
	
	function writeConfig(user, password, host, database){
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
	
	function connect(){
		
	}

}

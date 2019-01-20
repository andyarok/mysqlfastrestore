package com.quasle.mysqlfastbackup.client;

import com.gargoylesoftware.htmlunit.javascript.host.media.OscillatorNode;
import com.google.gwt.core.client.GWT;
import com.google.gwt.event.logical.shared.AttachEvent;
import com.google.gwt.resources.client.GwtCreateResource;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;

import gwt.material.design.addins.client.circularprogress.MaterialCircularProgress;
import gwt.material.design.addins.client.circularprogress.events.StartEvent;
import gwt.material.design.addins.client.circularprogress.ui.CircularProgressLabel;
import gwt.material.design.client.ui.MaterialLabel;

public class ConfigScreen extends Composite {

	private static ConfigScreenUiBinder uiBinder = GWT.create(ConfigScreenUiBinder.class);

	interface ConfigScreenUiBinder extends UiBinder<Widget, ConfigScreen> {
	}

	private boolean launched = false;
	
	public ConfigScreen() {
		initWidget(uiBinder.createAndBindUi(this));
		//This is because of a bug in progressLabel. setValue stops code flow if not initialized  
		progressLabel.addStartHandler(new StartEvent.StartHandler() {
			@Override
			public void onStart(StartEvent event) {
				if(!launched) {
					launched = true;
					loadInfo();
				}
			}
		});
		
	}
	
	@UiField
	MaterialLabel osLabel;
	
	@UiField
	MaterialCircularProgress progressLabel; 
	
	private void loadInfo() {
		checkConfig(this);
	}
	
	public void updateStatus(String status) {
		osLabel.setText(status);
	}
	
	public void setProgress(double progress) {
		progressLabel.setValue(progress);
	}
	
	public native void checkConfig(ConfigScreen obj)/*-{
		var getDirectory = function(con){
			console.log('Checking file priv directory');
			con.query("show variables like 'secure_file_priv'", function (error, results, fields) {
				if(error) throw error;
			  console.log('The solution is: ', results[0].Value);
			});
		}; 
		var fs = $wnd.require('fs');
		var mysql = $wnd.require('mysql');
		fs.access('config.json', fs.constants.F_OK, function(err) {
  			if(err){
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
						
						obj.@com.quasle.mysqlfastbackup.client.ConfigScreen::updateStatus(Ljava/lang/String;)('Connected to database');
						obj.@com.quasle.mysqlfastbackup.client.ConfigScreen::setProgress(D)(0.25);
						getDirectory(connection);
					}
				});
  			}
		});
		
		
		
	}-*/ ;
	
	public native void log(String msg)/*-{
		console.log(msg);
	}-*/;

}

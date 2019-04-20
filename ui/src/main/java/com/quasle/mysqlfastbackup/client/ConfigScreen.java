package com.quasle.mysqlfastbackup.client;

import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;
import com.quasle.mysqlfastbackup.client.util.Logger;

import gwt.material.design.addins.client.circularprogress.MaterialCircularProgress;
import gwt.material.design.addins.client.circularprogress.events.CompleteEvent;
import gwt.material.design.addins.client.circularprogress.events.StartEvent;
import gwt.material.design.client.ui.MaterialDialog;
import gwt.material.design.client.ui.MaterialLabel;
import gwt.material.design.client.ui.MaterialToast;
import jsinterop.annotations.JsMethod;
import jsinterop.annotations.JsPackage;
import jsinterop.annotations.JsType;

@JsType(namespace = JsPackage.GLOBAL, name="ConfigScreen")
public class ConfigScreen extends Composite {

	private static ConfigScreenUiBinder uiBinder = GWT.create(ConfigScreenUiBinder.class);

	private static String userName;

	private static String password;

	private static String dbName;

	interface ConfigScreenUiBinder extends UiBinder<Widget, ConfigScreen> {
	}

	private boolean launched = false;
	
	private Config cfg = null;
	private MysqlConfigView configView = null;
	
	@UiField
	MaterialDialog dialog;
	
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
			
	public void updateStatus(String status) {
		Logger.consoleLog("status "+status);
		osLabel.setText(status);
		if(status.equals("Error connecting to database")) {
			configView.setError(status);
		}else if(status.equalsIgnoreCase("Connected to database")) {
			dialog.close();
			DbManager man = new DbManager();
			man.setConnectionCallback(new DbManager.ConnectionSuccessCallback() {
				
				@Override
				public void onSuccess() {
					HomeView.setMainWidget(new SelectionView());
				}
								
			}, new DbManager.ConnectionFailureCallback() {
				
				
				@Override
				public void onFailure() {
					showConfigPopup();
				}
					
				
			});
			progressLabel.addCompleteHandler(new CompleteEvent.CompleteHandler() {
				
				@Override
				public void onComplete(CompleteEvent event) {
					man.createConnection(userName, password, dbName);
				}
			});
			
			GlobalReference.setDbManager(man);
		}
		
	}
		
	public void setProgress(double progress) {
		progressLabel.setValue(progress);
	}
	
	public void createConnection() {
		DbManager man = new DbManager();
		man.setConnectionCallback(new DbManager.ConnectionSuccessCallback() {
			
			@Override
			public void onSuccess() {
				Logger.consoleLog("connection success");
				HomeView.setMainWidget(new SelectionView());
			}
							
		}, new DbManager.ConnectionFailureCallback() {
			
			
			@Override
			public void onFailure() {
				Logger.consoleLog("connection failed");
				showConfigPopup();
			}
				
			
		});
		GlobalReference.setDbManager(man);
		man.parseConfig();
		
	}
	
	public static void setConnectionParameters(String userName, String password, String dbName) {
		ConfigScreen.userName = userName;
		ConfigScreen.password = password;
		ConfigScreen.dbName = dbName;
	}
		
	
	public void showConfigPopup(){
		
		configView = new MysqlConfigView();
		configView.setConfig(cfg);
		dialog.add(configView);
		dialog.getElement().getStyle().setProperty("border-radius", "7px");
		dialog.open();
	}
		
	private void loadInfo() {
		Logger.consoleLog("loading info");
		cfg = new Config();
		cfg.setObject(this);
		cfg.checkConfig();
	}
}

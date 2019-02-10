package com.quasle.mysqlfastbackup.client;

import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;

import gwt.material.design.addins.client.circularprogress.MaterialCircularProgress;
import gwt.material.design.addins.client.circularprogress.events.StartEvent;
import gwt.material.design.client.ui.MaterialLabel;
import gwt.material.design.client.ui.MaterialToast;
import jsinterop.annotations.JsMethod;
import jsinterop.annotations.JsPackage;
import jsinterop.annotations.JsType;

@JsType(namespace = JsPackage.GLOBAL, name="ConfigScreen")
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
			
	public void updateStatus(String status) {
		osLabel.setText(status);
	}
		
	public void setProgress(double progress) {
		progressLabel.setValue(progress);
	}
	
	public void createConnection() {
		DbManager man = new DbManager();
		man.setObject(this);
		GlobalReference.setDbManager(man);
		man.parseConfig();
		
	}
	
	public void onSuccessfullConnect() {
		//Potentially cross polluting codes. Need callback rather than this method being used in javascript.
		//Ideally, a callback has to be passed 
		HomeView.setMainWidget(new SelectionView());
	}
	
	public void showConfigPopup(){
		
	}
		
	private void loadInfo() {
		Config cfg = new Config();
		cfg.setObject(this);
		cfg.checkConfig();
	}
}

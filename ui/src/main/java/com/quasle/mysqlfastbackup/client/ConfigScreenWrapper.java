package com.quasle.mysqlfastbackup.client;

import jsinterop.annotations.JsMethod;
import jsinterop.annotations.JsType;

@JsType
public class ConfigScreenWrapper {
	private ConfigScreen configScr;
	
	public ConfigScreenWrapper(ConfigScreen cfg) {
		this.configScr = cfg;
	}
	
	@JsMethod
	public void updateStatus(String status) {
		configScr.osLabel.setText(status);
	}
	
	@JsMethod
	public void setProgress(double progress) {
		configScr.progressLabel.setValue(progress);
	}
}

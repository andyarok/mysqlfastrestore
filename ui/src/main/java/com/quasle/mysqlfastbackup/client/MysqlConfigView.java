package com.quasle.mysqlfastbackup.client;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;

import gwt.material.design.client.ui.MaterialCheckBox;
import gwt.material.design.client.ui.MaterialLabel;
import gwt.material.design.client.ui.MaterialTextBox;

public class MysqlConfigView extends Composite {

	private static MysqlConfigViewUiBinder uiBinder = GWT.create(MysqlConfigViewUiBinder.class);

	interface MysqlConfigViewUiBinder extends UiBinder<Widget, MysqlConfigView> {
	}
	
	public MysqlConfigView() {
		initWidget(uiBinder.createAndBindUi(this));
		
	}
	
	private Config config;
	
	@UiField
	MaterialTextBox nameField, passwordField, dbField;
	
	@UiField
	MaterialCheckBox remmemberCkBox;
	
	@UiField
	MaterialLabel errorLbl;
	
	@UiHandler("okBtn")
	void onOkClick(ClickEvent ce) {
		config.testConnection(nameField.getText(), passwordField.getText(), dbField.getText(), remmemberCkBox.getValue());
		ConfigScreen.setConnectionParameters(nameField.getText(), passwordField.getText(), dbField.getText());
	}
	
	public void setConfig(Config config) {
		this.config = config;
	}
	
	public void setError(String error) {
		errorLbl.setText(error);
		
	}
		

}

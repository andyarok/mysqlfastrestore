package com.quasle.mysqlfastbackup.client;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Document;
import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.InputElement;
import com.google.gwt.dom.client.NativeEvent;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.DomEvent;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;

import gwt.material.design.addins.client.fileuploader.MaterialFileUploader;
import gwt.material.design.addins.client.stepper.MaterialStepper;
import gwt.material.design.client.ui.MaterialButton;
import gwt.material.design.client.ui.MaterialCheckBox;
import gwt.material.design.client.ui.MaterialCollection;
import gwt.material.design.client.ui.MaterialCollectionItem;
import gwt.material.design.client.ui.MaterialLabel;

public class MainView extends Composite {

	private static MainViewUiBinder uiBinder = GWT.create(MainViewUiBinder.class);

	interface MainViewUiBinder extends UiBinder<Widget, MainView> {
	}
	
	private List<String> selectedDbs = new ArrayList<String>();	

	@UiField
	MaterialCollection itemContainer;
	
	@UiField
	MaterialButton nextBtn, cancelBtn, saveBtn;
	
	@UiField
	MaterialStepper stepper;
	
	@UiField
	MaterialLabel locText;

	@UiHandler("nextBtn")
	void onNextClick(ClickEvent evt) {
		stepper.nextStep();
	}
	
	@UiHandler("browseCard")
	void onBrowseClick(ClickEvent evt) {
		Util util = new Util();
		
		util.clickBrowse(new Util.SelectionCallback() {
			
			@Override
			public void onSelect(String text) {
				if(text.length()>0)
					locText.setText(text);
			}
		});
		
	}
	
	@UiHandler("saveBtn")
	void onSave(ClickEvent evt) {
		DbManager dbMan = GlobalReference.getDbManager();
		dbMan.getDirectory();
		for(String db: selectedDbs)
			dbMan.saveDatabase(db, locText.getText());
	}
	
	
	public MainView() {
		initWidget(uiBinder.createAndBindUi(this));
	}
		
	public void loadDatabaseList() {
		GlobalReference.getDbManager().getAllDatabases(new DbManager.DatabaseCallback() {
			@Override
			public void onResult(String result) {
				populateDatabase(result);
			}
		});
		
	}
	
	private void populateDatabase(String data) {
		JSONValue dataObj = JSONParser.parseStrict(data);
		JSONObject dbObj = dataObj.isObject();
		JSONValue dbsJson = dbObj.get("databases");
		JSONArray array = dbsJson.isArray();
		for(int i=0; i < array.size(); i++) {
			JSONString str = array.get(i).isString();
			String dbName = str.stringValue();
			addMaterialCollectionItem(dbName);
		}
	}
	
	private void addMaterialCollectionItem(String dbName) {
		MaterialCollectionItem ci = new MaterialCollectionItem();
		MaterialCheckBox cBox = new MaterialCheckBox(dbName);
		ci.add(cBox);
		cBox.addValueChangeHandler(new ValueChangeHandler<Boolean>() {
			
			@Override
			public void onValueChange(ValueChangeEvent<Boolean> event) {
				if(event.getValue()) {
					selectedDbs.add(dbName);
				}else {
					selectedDbs.remove(dbName);
				}
				
			}
		});
		itemContainer.add(ci);
	}

	public void loadBackupView() {
		loadDatabaseList();
		
	}

	public void loadRestoreView() {
		// TODO Auto-generated method stub
		
	}
}

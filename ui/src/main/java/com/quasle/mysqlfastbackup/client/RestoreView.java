package com.quasle.mysqlfastbackup.client;

import java.sql.DatabaseMetaData;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
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
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;
import com.quasle.mysqlfastbackup.client.DbManager.DatabaseCallback;
import com.quasle.mysqlfastbackup.client.DbManager.SaveProgressCallback;

import gwt.material.design.addins.client.stepper.MaterialStepper;
import gwt.material.design.client.ui.MaterialButton;
import gwt.material.design.client.ui.MaterialCheckBox;
import gwt.material.design.client.ui.MaterialCollection;
import gwt.material.design.client.ui.MaterialCollectionItem;
import gwt.material.design.client.ui.MaterialLabel;
import gwt.material.design.client.ui.MaterialProgress;
import gwt.material.design.client.ui.MaterialTextBox;
import gwt.material.design.client.ui.MaterialToast;

public class RestoreView extends Composite {

	private static RestoreViewUiBinder uiBinder = GWT.create(RestoreViewUiBinder.class);

	interface RestoreViewUiBinder extends UiBinder<Widget, RestoreView> {
	}

	public RestoreView() {
		initWidget(uiBinder.createAndBindUi(this));
	}
	
	private String selectedDb = null;
	private MaterialCheckBox selectedCheckBox = null;

	@UiField
	MaterialStepper stepper;
	
	@UiField
	MaterialProgress progressBar;
	
	@UiField
	MaterialCollection itemContainer;
	
	@UiField
	MaterialTextBox newDbNameField;
	
	@UiField
	MaterialButton okBtn;
	
	@UiField
	MaterialLabel locText, statusText;
	
	@UiField
	MaterialButton homeBtn, exitBtn;

	@UiHandler("browseCard")
	void onBrowseClick(ClickEvent evt) {
		Util util = new Util();
		GlobalReference.setUtil(util);
		util.clickBrowse(new Util.SelectionCallback() {
			
			@Override
			public void onSelect(String text) {
				if(text.length()>0)
					locText.setText(text);
			}
		});
	}
	
	@UiHandler("nextBtn")
	void onNextClick(ClickEvent evt) {
		stepper.nextStep();
		loadDatabaseList();
	}
	
	@UiHandler("restoreBtn")
	void onRestoreClick(ClickEvent evt) {
		stepper.nextStep();
		DbManager dbManager = GlobalReference.getDbManager();
		
		SaveProgressCallback callBack = new SaveProgressCallback() {
			
			@Override
			public void onProgress(double percent, String message) {
				if(percent==-1.0) {
					MaterialToast.fireToast("Error saving database "+message);
					showExitButtons();
				}else{
					progressBar.setPercent(percent);
					statusText.setText(message);
					if(percent==100.0)
						showExitButtons();
				}
			}
		};
		
		dbManager.getDirectory(new DbManager.DatabaseCallback() {
			@Override
			public void onResult(String mysqlLoc) {
				dbManager.restoreDatabase(locText.getText(), mysqlLoc, selectedDb, callBack);
			}
			
		});
	}
	
	@UiHandler("exitBtn")
	void onExitClick(ClickEvent evt) {
		GlobalReference.getUtil().close();
	}
	
	@UiHandler("homeBtn")
	void onHomeClick(ClickEvent evt) {
		SelectionView sView = new SelectionView();
		HomeView.setMainWidget(sView);
	}
	
	@UiHandler("addIcon")
	void onAddClick(ClickEvent evt) {
		okBtn.setVisible(true);
		newDbNameField.setVisible(true);
		
	}
	
	@UiHandler("okBtn")
	void onOkClick(ClickEvent evt) {
		createDatabase(newDbNameField.getText());
		okBtn.setVisible(false);
		newDbNameField.setVisible(false);
	}
	
	public void loadDatabaseList() {
		GlobalReference.getDbManager().getAllDatabases(new DbManager.DatabaseCallback() {
			@Override
			public void onResult(String result) {
				populateDatabase(result);
			}
		});
	}
	
	private void showExitButtons() {
		exitBtn.setVisible(true);
		homeBtn.setVisible(true);
	}
	
	private void createDatabase(String database) {
		GlobalReference.getDbManager().createDatabase(database, new DbManager.DatabaseCallback() {
			@Override
			public void onResult(String result) {
				addMaterialCollectionItem(database);
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
				if(selectedDb!=null && event.getValue()) {
					selectedCheckBox.setValue(false);
				}else if(event.getValue()) {
					selectedDb = dbName;
					selectedCheckBox = cBox;
				}else {
					selectedDb = null;
					selectedCheckBox = null;
				}
				
			}
		});
		itemContainer.add(ci);
	}
	
	
}

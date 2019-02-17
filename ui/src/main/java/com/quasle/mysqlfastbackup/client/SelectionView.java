package com.quasle.mysqlfastbackup.client;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;

import gwt.material.design.client.ui.MaterialCard;

public class SelectionView extends Composite {

	private static SelectionViewUiBinder uiBinder = GWT.create(SelectionViewUiBinder.class);

	interface SelectionViewUiBinder extends UiBinder<Widget, SelectionView> {
	}

	public SelectionView() {
		initWidget(uiBinder.createAndBindUi(this));
		
	}
	
	@UiHandler("backupCard")
	void onBackupClick(ClickEvent evt) {
		MainView mainView = new MainView();
		HomeView.setMainWidget(mainView);
		mainView.loadBackupView();
	}
	
	@UiHandler("restoreCard")
	void onRestoreClick(ClickEvent evt) {
		RestoreView rView = new RestoreView();
		HomeView.setMainWidget(rView);
	}

}

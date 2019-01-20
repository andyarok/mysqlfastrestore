package com.quasle.mysqlfastbackup.client;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.Widget;

import gwt.material.design.client.ui.MaterialDialog;

public class HomeView implements EntryPoint{
	
	private static RootPanel panel = null;
	private static MaterialDialog dialog;
	
	private static Widget mainWidget = null;
	
	@Override
	public void onModuleLoad() {
		panel = RootPanel.get();
		//adding global dialog
		initDialogWidget();
		mainWidget = new ConfigScreen();
		panel.add(mainWidget);
		
		
	}

	public static void setMainWidget(Widget w) {
		panel.remove(mainWidget);
		mainWidget = w;
		panel.add(mainWidget);
		
	}
	
	private static void initDialogWidget(){
		dialog = new MaterialDialog();
		panel.add(dialog);
	}
	
	public static MaterialDialog getGlobalDialog() {
		return dialog;
	}
	
	public static MaterialDialog getNewGlobalDialog() {
		dialog = new MaterialDialog();
		panel.add(dialog);
		return dialog;
	}

	
}

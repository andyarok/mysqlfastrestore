package com.quasle.mysqlfastbackup.client;

public class GlobalReference {
	private static DbManager dbManager;

	public static DbManager getDbManager() {
		return dbManager;
	}

	public static void setDbManager(DbManager dbManager) {
		GlobalReference.dbManager = dbManager;
	}
	
	
	
}

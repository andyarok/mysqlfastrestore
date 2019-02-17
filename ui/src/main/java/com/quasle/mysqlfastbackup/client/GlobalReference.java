package com.quasle.mysqlfastbackup.client;

public class GlobalReference {
	private static DbManager dbManager;
	private static Util util;

	public static DbManager getDbManager() {
		return dbManager;
	}

	public static void setDbManager(DbManager dbManager) {
		GlobalReference.dbManager = dbManager;
	}
	
	public static void setUtil(Util util) {
		GlobalReference.util = util;
	}

	public static Util getUtil() {
		return util;
	}
	
}

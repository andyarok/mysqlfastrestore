package com.quasle.mysqlfastbackup.client;

import jsinterop.annotations.JsFunction;
import jsinterop.annotations.JsMethod;
import jsinterop.annotations.JsPackage;
import jsinterop.annotations.JsType;

@JsType(isNative=true, namespace=JsPackage.GLOBAL)
public class DbManager {
	
	@JsFunction
	public interface DatabaseCallback{
		void onResult(String result);
	}
	
	@JsFunction
	public interface SaveProgressCallback{
		void onProgress(double percent, String msg);
	}
	
	@JsMethod
	public native void parseConfig();
	
	@JsMethod
	public native void getDirectory(DatabaseCallback cbk);
	
	@JsMethod
	public native String getAllDatabases(DatabaseCallback dbCallback);
	
	@JsMethod
	public native void setObject(ConfigScreen screen);
	
	@JsMethod
	public native void setSaveProgressCallback(SaveProgressCallback cbk);
	
	@JsMethod
	public native void saveDatabase(String dbName, String fromLocation, String destination);
	
	@JsMethod
	public native void restoreDatabase(String folderName, String mysqlLoc, String dbName, SaveProgressCallback cbk);
	
	@JsMethod
	public native void createDatabase(String dbName, DatabaseCallback cbk);
}

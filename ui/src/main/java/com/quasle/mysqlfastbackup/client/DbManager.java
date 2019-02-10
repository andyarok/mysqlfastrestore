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
	
	@JsMethod
	public native void parseConfig();
	
	@JsMethod
	public native void getDirectory();
	
	@JsMethod
	public native String getAllDatabases(DatabaseCallback dbCallback);
	
	@JsMethod
	public native void setObject(ConfigScreen screen);
	
	@JsMethod
	public native void saveDatabase(String dbName, String destination);
}

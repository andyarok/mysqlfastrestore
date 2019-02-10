package com.quasle.mysqlfastbackup.client;

import jsinterop.annotations.JsMethod;
import jsinterop.annotations.JsPackage;
import jsinterop.annotations.JsType;

@JsType(isNative=true, namespace=JsPackage.GLOBAL)
public class Config {
	
	@JsMethod
	public native void checkConfig();
	@JsMethod
	public native void setObject(ConfigScreen screen);
}

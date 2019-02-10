package com.quasle.mysqlfastbackup.client;

import jsinterop.annotations.JsFunction;
import jsinterop.annotations.JsMethod;
import jsinterop.annotations.JsPackage;
import jsinterop.annotations.JsType;

@JsType(isNative=true, namespace=JsPackage.GLOBAL)
public class Util {
	
	@JsFunction
	public interface SelectionCallback {
		void onSelect(String text);
	}
	
	@JsMethod
	public native void clickBrowse(SelectionCallback callback);
	

}

package com.quasle.mysqlfastbackup.client.util;

public class Logger {
	public native static void consoleLog(String message) /*-{
		console.log(message);
	}-*/;
}

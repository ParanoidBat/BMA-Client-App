package com.example.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.meem.plugins.tcpcomm.TCPPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);

        registerPlugin(TCPPlugin.class);
    }
}

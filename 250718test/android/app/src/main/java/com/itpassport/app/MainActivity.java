package com.itpassport.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.itpassport.app.plugins.GooglePlayBillingPlugin;

public class MainActivity extends BridgeActivity {
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Google Play Billingプラグインを登録
        registerPlugin(GooglePlayBillingPlugin.class);
    }
}

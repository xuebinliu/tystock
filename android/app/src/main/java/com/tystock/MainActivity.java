package com.tystock;

import com.facebook.react.ReactActivity;
import cn.reactnative.modules.qq.QQPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import android.content.Intent;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "tystock";
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data){
        super.onActivityResult(requestCode, resultCode, data);
        getReactInstanceManager().onActivityResult(this, requestCode, resultCode, data);
    }
}

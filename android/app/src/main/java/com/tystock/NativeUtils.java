package com.tystock;

import android.widget.Toast;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by free on 03/03/2017.
 * 本地工具类，Native实现的接口用于JS调用
 */
public class NativeUtils extends ReactContextBaseJavaModule {

    public NativeUtils(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "NativeUtils";
    }

    @ReactMethod
    public void aliPay() {
        if (!CommonUtil.checkPackageInstalled(getReactApplicationContext(),
                "com.eg.android.AlipayGphone", "https://www.alipay.com")) {
            // 支付宝支付要求用户已经安装支付宝客户端
            Toast.makeText(getReactApplicationContext(), "请安装支付宝APP", Toast.LENGTH_SHORT).show();
            return;
        }
    }
}

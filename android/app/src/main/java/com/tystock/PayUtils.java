package com.tystock;

import android.content.ComponentName;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;
import c.b.BP;
import c.b.PListener;
import com.facebook.react.bridge.*;

/**
 * Created by free on 03/03/2017.
 * 支付接口类，Native实现的接口用于JS调用
 */
public class PayUtils extends ReactContextBaseJavaModule {
    private static final String TAG = "PayUtils";

    private int WX_PLUGIN_VERSION = 7;

    public PayUtils(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "PayUtils";
    }

    /**
     * 发起支付
     * @param isAliPay 支付类型，true支付宝，false微信
     * @param params
     *      // 商品名
            String name = params.getString("name");
            // 描述内容
            String content = params.getString("content");
            // 价格
            double price = params.getDouble("price");
     * @param callback
     */
    @ReactMethod
    private void pay(Boolean isAliPay, final ReadableMap params, final Callback callback) {
        Log.d(TAG, "pay" + ", isAliPay" + isAliPay);

        // 检查支付宝是否安装
        if (isAliPay) {
            if (!CommonUtil.checkPackageInstalled(getReactApplicationContext(),
                    "com.eg.android.AlipayGphone", "https://www.alipay.com")) {
                // 支付宝支付要求用户已经安装支付宝客户端
                Toast.makeText(getReactApplicationContext(), "请安装支付宝APP", Toast.LENGTH_SHORT).show();
                return;
            }
        } else {
            // 需要用微信支付时，要安装微信客户端，然后需要插件
            if (CommonUtil.checkPackageInstalled(getReactApplicationContext(),
                    "com.tencent.mm", "http://weixin.qq.com")) {
                // 有微信客户端，看看有无微信支付插件
                int pluginVersion = BP.getPluginVersion(getReactApplicationContext());
                if (pluginVersion < WX_PLUGIN_VERSION) {
                    // 为0说明未安装支付插件,
                    // 否则就是支付插件的版本低于官方最新版
                    Toast.makeText(getReactApplicationContext(),
                            pluginVersion == 0 ? "本机尚未安装支付插件,无法进行支付,请先安装插件(无流量消耗)"
                                    : "监测到本机的支付插件不是最新版,请先更新插件(无流量消耗)",
                            Toast.LENGTH_SHORT).show();
                    CommonUtil.installApk(getCurrentActivity(), "bp.db");
                    return;
                }
            } else {
                // 没有安装微信
                Toast.makeText(getReactApplicationContext(), "请安装微信客户端", Toast.LENGTH_SHORT).show();
                return;
            }
        }

        try {
            Intent intent = new Intent(Intent.ACTION_MAIN);
            intent.addCategory(Intent.CATEGORY_LAUNCHER);
            ComponentName cn = new ComponentName("com.bmob.app.sport",
                    "com.bmob.app.sport.wxapi.BmobActivity");
            intent.setComponent(cn);
            getCurrentActivity().startActivity(intent);
        } catch (Throwable e) {
            e.printStackTrace();
        }

        // 商品名
        String name = params.getString("name");
        // 描述内容
        String content = params.getString("content");
        // 价格
        double price = params.getDouble("price");

        Log.d(TAG, "pay" + ", name" + name + ", content=" + content + ", price=" + price);

        BP.pay(name, content, price, isAliPay, new PListener() {

            // 因为网络等原因,支付结果未知(小概率事件),出于保险起见稍后手动查询
            @Override
            public void unknow() {
                Log.d(TAG, "PListener unknown");
                Toast.makeText(getCurrentActivity(), "支付结果未知,请稍后手动查询", Toast.LENGTH_SHORT).show();
            }

            // 支付成功,如果金额较大请手动查询确认
            @Override
            public void succeed() {
                Log.d(TAG, "PListener succeed");
                Toast.makeText(getCurrentActivity(), "支付成功!", Toast.LENGTH_SHORT).show();
            }

            // 无论成功与否,返回订单号
            @Override
            public void orderId(String orderId) {
                // 此处应该保存订单号,比如保存进数据库等,以便以后查询
                callback.invoke(orderId);
                Log.d(TAG, "PListener orderId=" + orderId);
            }

            // 支付失败,原因可能是用户中断支付操作,也可能是网络原因
            @Override
            public void fail(int code, String reason) {
                // 当code为-2,意味着用户中断了操作
                // code为-3意味着没有安装BmobPlugin插件
                Log.d(TAG, "PListener fail code=" + code + ", reason=" + reason);
                if (code == -3) {
                    Toast.makeText(
                            getCurrentActivity(),
                            "监测到你尚未安装支付插件,无法进行支付,请先安装插件(已打包在本地,无流量消耗),安装结束后重新支付",
                            Toast.LENGTH_SHORT).show();
                    CommonUtil.installApk(getCurrentActivity(),"bp.db");
                } else {
                    Toast.makeText(getCurrentActivity(), "支付中断", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }
}

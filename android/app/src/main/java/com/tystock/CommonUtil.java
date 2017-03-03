package com.tystock;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.widget.Toast;

/**
 * Created by free on 03/03/2017.
 */
public class CommonUtil {
    /**
     * 检查某包名应用是否已经安装
     * @param packageName 包名
     * @param browserUrl 如果没有应用市场，去官网下载
     * @return
     */
    public static boolean checkPackageInstalled(Context context, String packageName, String browserUrl) {
        try {
            // 检查是否有支付宝客户端
            context.getPackageManager().getPackageInfo(packageName, 0);
            return true;
        } catch (PackageManager.NameNotFoundException e) {
            try {
                // 没有安装跳转到应用市场
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.setData(Uri.parse("market://details?id=" + packageName));
                context.startActivity(intent);
            } catch (Exception ee) {
                // 连应用市场都没有，用浏览器去支付宝官网下载
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW);
                    intent.setData(Uri.parse(browserUrl));
                    context.startActivity(intent);
                } catch (Exception eee) {

                }
            }
        }
        return false;
    }
}

package com.tystock;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Environment;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.widget.Toast;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;

/**
 * Created by free on 03/03/2017.
 */
public class CommonUtil {
    /**
     * 检查某包名应用是否已经安装
     * @param packageName 包名
     * @param browserUrl 如果没有应用市场，去官网下载
     * @return true 已安装
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

    /**
     * 安装assets里的apk文件
     * @param context
     * @param fileName
     */
    public static void installBmobPayPlugin(Context context, String fileName) {
        try {
            // 文件拷贝，重命名后缀为apk
            InputStream is = context.getAssets().open(fileName);
            File file = new File(Environment.getExternalStorageDirectory()
                    + File.separator + fileName + ".apk");
            if (file.exists())
                file.delete();
            file.createNewFile();
            FileOutputStream fos = new FileOutputStream(file);
            byte[] temp = new byte[1024];
            int i = 0;
            while ((i = is.read(temp)) > 0) {
                fos.write(temp, 0, i);
            }
            fos.close();
            is.close();

            // 发起安装
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.setDataAndType(Uri.parse("file://" + file), "application/vnd.android.package-archive");
            context.startActivity(intent);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 安装asset 目录的apk
     * @param context
     * @param s
     */
    public static void installApk(Context context, String s) {
        if (ContextCompat.checkSelfPermission(context, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            //申请权限
            ActivityCompat.requestPermissions((Activity) context, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 101);
        } else {
            installBmobPayPlugin(context, s);
        }
    }
}

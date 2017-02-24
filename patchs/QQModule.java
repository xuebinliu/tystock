

/**
QQ登陆模块：react-native-qq QQModule增加获取头像和昵称的功能
*/
    @ReactMethod
    public void updateUserInfo(final Callback callback) {
        if (api != null && api.isSessionValid()) {
            IUiListener listener = new IUiListener() {
                @Override
                public void onError(UiError e) {
                }

                @Override
                public void onComplete(final Object response) {
                    new Thread(){
                        @Override
                        public void run() {
                            JSONObject json = (JSONObject)response;
                            if(json.has("figureurl") && json.has("nickname")){
                                try {
                                    callback.invoke(json.getString("figureurl_qq_2"), json.getString("nickname"));
                                } catch (JSONException e) {
                                    Log.d("xb", "err");
                                }
                            }
                        }
                    }.start();
                }

                @Override
                public void onCancel() {

                }
            };

            UserInfo mInfo = new UserInfo(getReactApplicationContext(), api.getQQToken());
            mInfo.getUserInfo(listener);
        } else {
        }
    }
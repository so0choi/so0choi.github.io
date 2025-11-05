---
title: React Native 기기 사용 권한 설정하기
description: 'Application permission 이란 앱에서 장치 수준 기능에 대한 액세스를 제어하고 규제하는 수단이다. 일반적으로는 카메라나 위치 정보 접근과 같은 장치의 하드웨어 기능 및 개인 데이터 액세스 기능과 같이 개인 정보에 영향을 미칠 수 있는 기능이 포함된다. React Native 문서에는 Android 권한을…'
pubDate: 2023-02-09 10:35:47
category: React Native

---


Application permission 이란 앱에서 장치 수준 기능에 대한 액세스를 제어하고 규제하는 수단이다. 일반적으로는 카메라나 위치 정보 접근과 같은 장치의 하드웨어 기능 및 개인 데이터 액세스 기능과 같이 개인 정보에 영향을 미칠 수 있는 기능이 포함된다. React Native 문서에는 Android 권한을 다루는 `PermissionsAndroid`에 대한 설명은 나와있는데 IOS 관련 내용은 없었다. 보통 두 OS를 공통으로 처리하기 위해 [react-native-permissions](https://github.com/zoontek/react-native-permissions) 라이브러리를 많이 사용한다고 한다.

권한을 요청할 뿐 아니라 권한을 얻지 못했을 때의 동작을 핸들링하려면 직접 처리하는 작업은 꼭 필요해 보인다.

## 설치

github READ.me를 참고하여 설치할 수 있다.

```shell
yarn add react-native-permissions
```

### IOS

'Podfile'을 업데이트 하고 `pod install`을 실행해야 한다. Podfile에서 아래에 해당하는 블럭을 찾아 추가하고자 하는 권한만 추가하면 된다.

```shell
target 'YourAwesomeProject' do

  # …

  permissions_path = '../node_modules/react-native-permissions/ios'

  pod 'Permission-AppTrackingTransparency', :path => "#{permissions_path}/AppTrackingTransparency"
  pod 'Permission-BluetoothPeripheral', :path => "#{permissions_path}/BluetoothPeripheral"
  pod 'Permission-Calendars', :path => "#{permissions_path}/Calendars"
  pod 'Permission-Camera', :path => "#{permissions_path}/Camera"
  pod 'Permission-Contacts', :path => "#{permissions_path}/Contacts"
  pod 'Permission-FaceID', :path => "#{permissions_path}/FaceID"
  pod 'Permission-LocationAccuracy', :path => "#{permissions_path}/LocationAccuracy"
  pod 'Permission-LocationAlways', :path => "#{permissions_path}/LocationAlways"
  pod 'Permission-LocationWhenInUse', :path => "#{permissions_path}/LocationWhenInUse"
  pod 'Permission-MediaLibrary', :path => "#{permissions_path}/MediaLibrary"
  pod 'Permission-Microphone', :path => "#{permissions_path}/Microphone"
  pod 'Permission-Motion', :path => "#{permissions_path}/Motion"
  pod 'Permission-Notifications', :path => "#{permissions_path}/Notifications"
  pod 'Permission-PhotoLibrary', :path => "#{permissions_path}/PhotoLibrary"
  pod 'Permission-PhotoLibraryAddOnly', :path => "#{permissions_path}/PhotoLibraryAddOnly"
  pod 'Permission-Reminders', :path => "#{permissions_path}/Reminders"
  pod 'Permission-Siri', :path => "#{permissions_path}/Siri"
  pod 'Permission-SpeechRecognition', :path => "#{permissions_path}/SpeechRecognition"
  pod 'Permission-StoreKit', :path => "#{permissions_path}/StoreKit"

end
```

```shell
cd ios && pod install
```

그리고 'Info.plist'를 업데이트 해야한다. 권한을 얻는 alert가 뜰 때 나타날 문구를 설정할 수 있다.

```<?xml version="1.0" encoding="UTF-8"?>
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>

  <!-- 🚨 Keep only the permissions used in your app 🚨 -->

  <key>NSAppleMusicUsageDescription</key>
  <string>YOUR TEXT</string>
  <key>NSBluetoothAlwaysUsageDescription</key>
  <string>YOUR TEXT</string>
  <key>NSBluetoothPeripheralUsageDescription</key>
  <string>YOUR TEXT</string>
  <key>NSCalendarsUsageDescription</key>
  <string>YOUR TEXT</string>
  <key>NSCameraUsageDescription</key>
  <string>YOUR TEXT</string>
  <key>NSContactsUsageDescription</key>
  <string>YOUR TEXT</string>
  <key>NSFaceIDUsageDescription</key>
  <string>YOUR TEXT</string>
  <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
  <string>YOUR TEXT</string>
  <key>NSLocationAlwaysUsageDescription</key>
  <string>YOUR TEXT</string>
  <key>NSLocationTemporaryUsageDescriptionDictionary</key>
  <dict>
    <key>YOUR-PURPOSE-KEY</key>
    <string>YOUR TEXT</string>
  </dict>
  <key>NSLocationWhenInUseUsageDescription</key>
  <string>YOUR TEXT</string>
  <key>NSMicrophoneUsageDescription</key>
  <string>YOUR TEXT</string>
  <key>NSMotionUsageDescription</key>
  <string>YOUR TEXT</string>
  <key>NSPhotoLibraryUsageDescription</key>
  <string>YOUR TEXT</string>
  <key>NSPhotoLibraryAddUsageDescription</key>
  <string>YOUR TEXT</string>
  <key>NSRemindersUsageDescription</key>
  <string>YOUR TEXT</string>
  <key>NSSpeechRecognitionUsageDescription</key>
  <string>YOUR TEXT</string>
  <key>NSSiriUsageDescription</key>
  <string>YOUR TEXT</string>
  <key>NSUserTrackingUsageDescription</key>
  <string>YOUR TEXT</string>

  <!-- … -->

</dict>
</plist>
```

### Android

`android/app/src/main/AndroidManifest.xml` 파일을 수정해야 한다.

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  package="com.myawesomeapp">

  <!-- 🚨 Keep only the permissions used in your app 🚨 -->

  <uses-permission android:name="android.permission.ACCEPT_HANDOVER" />
  <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_MEDIA_LOCATION" />
  <uses-permission android:name="android.permission.ACTIVITY_RECOGNITION" />
  <uses-permission android:name="com.android.voicemail.permission.ADD_VOICEMAIL" />
  <uses-permission android:name="android.permission.ANSWER_PHONE_CALLS" />
  <uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />
  <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
  <uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
  <uses-permission android:name="android.permission.BODY_SENSORS" />
  <uses-permission android:name="android.permission.BODY_SENSORS_BACKGROUND" />
  <uses-permission android:name="android.permission.CALL_PHONE" />
  <uses-permission android:name="android.permission.CAMERA" />
  <uses-permission android:name="android.permission.GET_ACCOUNTS" />
  <uses-permission android:name="android.permission.NEARBY_WIFI_DEVICES" />
  <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
  <uses-permission android:name="android.permission.PROCESS_OUTGOING_CALLS" />
  <uses-permission android:name="android.permission.READ_CALENDAR" />
  <uses-permission android:name="android.permission.READ_CALL_LOG" />
  <uses-permission android:name="android.permission.READ_CONTACTS" />
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
  <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
  <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
  <uses-permission android:name="android.permission.READ_PHONE_NUMBERS" />
  <uses-permission android:name="android.permission.READ_PHONE_STATE" />
  <uses-permission android:name="android.permission.READ_SMS" />
  <uses-permission android:name="android.permission.RECEIVE_MMS" />
  <uses-permission android:name="android.permission.RECEIVE_SMS" />
  <uses-permission android:name="android.permission.RECEIVE_WAP_PUSH" />
  <uses-permission android:name="android.permission.RECORD_AUDIO" />
  <uses-permission android:name="android.permission.SEND_SMS" />
  <uses-permission android:name="android.permission.USE_SIP" />
  <uses-permission android:name="android.permission.UWB_RANGING" />
  <uses-permission android:name="android.permission.WRITE_CALENDAR" />
  <uses-permission android:name="android.permission.WRITE_CALL_LOG" />
  <uses-permission android:name="android.permission.WRITE_CONTACTS" />
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

  <!-- … -->

</manifest>
```

## 사용법

### Status types

| Return value        | 내용                                 |
|---------------------|------------------------------------|
| RESULTS.UNAVAILABLE | 이 기능은 이 디바이스에서 사용 불가               |
| RESULTS.DENIED      | 아직 요청 된 적 없거나 거부되었으나 다시 요청이 가능한 경우 |
| RESULTS.GRANTED     | 허용됨                                |
| RESULTS.LIMITED     | 	제한적 허용                            |
| RESULTS.BLOCKED     | 거부되었으며 다시 요청할 수 없음                 |


### Methods

- check
한 가지 permission에 대한 status를 확인한다

> Android는 `check` 메소드에 `blocked`를 반환하지 않는다. 상태를 알기 위해서는 permission을 요청해야 한다.

```ts
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';

check(PERMISSIONS.IOS.LOCATION_ALWAYS)
    .then((result) => {
        switch (result) {
            case RESULTS.UNAVAILABLE:
                console.log('This feature is not available (on this device / in this context)');
                break;
            case RESULTS.DENIED:
                console.log('The permission has not been requested / is denied but requestable');
                break;
            case RESULTS.LIMITED:
                console.log('The permission is limited: some actions are possible');
                break;
            case RESULTS.GRANTED:
                console.log('The permission is granted');
                break;
            case RESULTS.BLOCKED:
                console.log('The permission is denied and not requestable anymore');
                break;
        }
    })
    .catch((error) => {
        // …
    });
```

- request

한 가지 Persmission을 요청한다. (`rationale` 파라미터는 Android에서만 사용)

```ts
// 
type Rationale = {
  title: string;
  message: string;
  buttonPositive?: string;fsdafdsfasd
  buttonNegative?: string;
  buttonNeutral?: string;
};

function request(permission: string, rationale?: Rationale): Promise<PermissionStatus>;
//

import {request, PERMISSIONS} from 'react-native-permissions';

request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
    // …
});
```

# EnterpriseBarcodeDemo
Demo of Enterprise Barcode Plugin

- Clone repository
- EnterpriseBarcode only compiles against Cordova 4.3.0 right now (npm install cordova@4.3.0), ensure that is installed.
- Install EMDK for Android 3.0
- Add platform `cordova platform add android`
- Add Enterprise Barcode plugin `cordova plugin add https://github.com/darryncampbell/EnterpriseBarcodePoC.git`
- Modify project.properties as follows:

`# Project target.
    target=Symbol Technologies, Inc.:EMDK 3.0 (API 19):19
    android.library.reference.1=CordovaLib`

- Build for Android `cordova build android`

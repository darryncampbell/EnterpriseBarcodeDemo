# EnterpriseBarcodeDemo
Demo of Enterprise Barcode Plugin

- Clone repository
- Add platform `cordova platform add android`
- Add Enterprise Barcode plugin `cordova plugin add https://github.com/darryncampbell/EnterpriseBarcodePoC.git`
- Modify project.properties as follows:

`# Project target.
    target=Symbol Technologies, Inc.:EMDK 3.0 (API 19):19
    android.library.reference.1=CordovaLib`

- Build for Android `cordova build android`

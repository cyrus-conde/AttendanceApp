# AttendanceApp
Mobile application built using react-native expo
## HOW TO INSTALL REACT-NATIVE EXPO ##

npx create-expo-app ProjectName
-this will create the expo-app blank project

cd ProjectName
-this will go to the project directory
npx expo start
-this will start the expo app

Reference: https://reactnative.dev/docs/environment-setup?guide=quickstart
docs for expo: https://docs.expo.dev/

Now, you can edit the blank project to your desired program

If done, you can now build the application

First, install the lates EAS CLI
command: npm install --global eas-cli

create expo account in https://expo.dev/signup
after that, run this command: npx expo login
enter the username or email and password
if done, run this command: eas build:configure

If you encountered an error about Execution Policy please refer to the bottom of this page for instruction.

eas build:configure command will generate eas.json file, open it and replace the content of the file

{
  "cli": {
    "version": ">= 3.9.2"
  },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "preview2": {
      "android": {
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "preview3": {
      "developmentClient": true
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}

if done, you can now build by running this command: eas build:run -p android
and follow the on-screen instructions

### for execution policy error ###
1. Open windows powershell
2. run this command: Get-ExecutionPolicy -list
As you can see, the ExecutionPolicy of the current user is undefined, it means restricted.
3. run this command: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
4. run this command: eas --version
If this command will return the version of the eas, you're good to go.

Reference: https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.3

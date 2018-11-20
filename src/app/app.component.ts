import { Component } from '@angular/core';
import {App, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { BackgroundMode } from '@ionic-native/background-mode';
import { HomePage } from '../pages/home/home';
import { Push, PushObject, PushOptions } from '@ionic-native/push';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(
    private app: App,
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    storage: Storage,
    backgroundMode: BackgroundMode,
    private push: Push
  ) {
    platform.ready().then(() => {
      statusBar.overlaysWebView(false);
      statusBar.backgroundColorByHexString('#990066');
      this.pushSetup();
      splashScreen.hide();

      if(platform.is("android")){
          platform.registerBackButtonAction(() => {
              let nav = this.app.getActiveNav();
              let activeView: any = nav.getActive();

              if (activeView != null) {
                  if (nav.canGoBack()) {
                      nav.pop();
                  } else if (backgroundMode.isEnabled()) {
                      backgroundMode.moveToBackground();
                  }
              }
          });
      }
    });
    storage.get('introShown').then(result => {
      console.log('introShown' + result);
      if (result) {
        this.rootPage = HomePage;
      } else {
        //this.rootPage = LoginPage;
       this.rootPage = 'LoginPage';
      }
    });
  }

  pushSetup(){
    // to check if we have permission
    this.push.hasPermission()
    .then((res: any) => {
      if (res.isEnabled) {
        console.log('We have permission to send push notifications');
      } else {
        console.log('We do not have permission to send push notifications');
      }
    });


    const options: PushOptions = {
      android: {
        senderID:'271111022906'
      },
      ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
      }
   };

   const pushObject: PushObject = this.push.init(options);
   
   
   pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
   
   pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));
   
   pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }
}

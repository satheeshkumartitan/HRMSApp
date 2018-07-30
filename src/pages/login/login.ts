import { UtilsProvider } from './../../providers/utils/utils';
import { Component,Renderer } from '@angular/core';
import { HomePage } from './../home/home';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController
} from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  ServiceProvider
} from '../../providers/service/service';
import {
  StorageProvider
} from '../../providers/storage/storage';
import {
  GooglePlus
} from '@ionic-native/google-plus';
import { MyApp } from '../../app/app.component'
//import { AngularFireModule } from 'angularfire2';
import * as firebase from 'firebase';
import { AuthHandlerProvider } from '../../providers/auth-handler/auth-handler';


/**
 * Login Functionalities
 * @author Vivek
 */

declare var WL;
declare var WLAuthorizationManager;

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public adapterResult: any = "";
  public AuthHandler: any;
  AuthHandlerMessage:String="";
  public gmailHandler: any;
  public employee_id: any;
  public password: any;
  public isChallenged: boolean = false;
  jsondata: any;
  //storage: any;
  photos: string;
  form;
  loader: any;

  constructor(public alert: AlertController, public service: ServiceProvider, public navCtrl: NavController,
    public navParams: NavParams, public loadingCtrl: LoadingController, public storage: StorageProvider,
    private googlePlus: GooglePlus,public utils:UtilsProvider,public authHandler:AuthHandlerProvider,
    public render:Renderer, public mainService: MyApp) {
    
      this.form = new FormGroup({
        username: new FormControl("", Validators.required),
        password: new FormControl("", Validators.required)
      });
  
      this.authHandler.setLoginFailureCallback((error) => {
        this.loader.dismiss();
        if (error !== null) {
          this.showAlert('Login Failure', error);
        } else {
          this.showAlert('Login Failure', 'Failed to login.');
        }
      });
      this.authHandler.setLoginSuccessCallback(() => {
        let view = this.navCtrl.getActive();
        if (!(view.instance instanceof HomePage)) {
          console.log("invoke Home Page----->>>");
          this.mainService.attanancePageData = this.service.invokeAdapterCall('attananceRequest', 'resource', 'post', {payload : true,length: 3,payloadData: {"IP_BEGDA": "20180601","IP_ENDDA": "20180731","IP_PERNR": "00477072"}});
          console.log(this.mainService.attanancePageData);
          this.navCtrl.setRoot("HomePage");
        }
      });
      this.authHandler.setHandleChallengeCallback(() => {
        this.navCtrl.setRoot("LoginPage");
      });
  }

  processForm() {
    let username = this.form.value.username;
    let password = this.form.value.password;
    let credentials = {
      "username":username,
      "password":password
    };
    if (username === "" || password === "") {
      this.showAlert('Login Failure', 'Username and password are required');
      return;
    }
    console.log('--> Sign-in with user: ', username);
    this.loader = this.loadingCtrl.create({
      content: 'Signining in. Please wait ...',
      dismissOnPageChange: true
    });
    this.loader.present().then(() => {
      sessionStorage.setItem("securityName","UserLogin");
      this.authHandler.login(credentials,"UserLogin");
    });
  }

  

  /**
   * Method for reading  json data from local jsonstore
   */
  ionViewDidLoad() {
    setTimeout(()=>{
    this.storage.jsonstoreInitialize().then(()=>{ 
    this.storage.jsonstoreReadAll("userImage").then((jsonData:any)=>{
      if(jsonData){
            if(jsonData.length == 0) {
            this.photos = ("./assets/icon/avatar.png");
            localStorage.setItem("userPicture", this.photos);
            }
            else{
            this.photos = jsonData.json.value;
            localStorage.setItem("userPicture", this.photos);
            //console.log("JSON data has image");
            }
      };
    }, (error)=>{
      console.log("Data readed from jsonstore error",error);
    });
  
    });
  
    }, 2000);
  
  }
  
  
  /**
   * Method to handle user login via google plus option
   */
  userLoginViagooglePlus(){
    this.googlePlus.login({
      'webClientId': '609753179467-2l3pspgamabenaigj9euf0mqs9ug7cpg.apps.googleusercontent.com',
      'offline': true
    }).then((res) => {
      let inputParams = {
        "vendor": "google",
        "token": res.idToken
      };
      this.loader = this.loadingCtrl.create({
        content: 'Signining in. Please wait ...',
        dismissOnPageChange: true
      });
      this.loader.present().then(() => {
        sessionStorage.setItem("securityName","socialLogin");
        this.authHandler.login(inputParams,"socialLogin");
      });
    });
  }

  showAlert(alertTitle, alertMessage) {
    let prompt = this.alert.create({
      title: alertTitle,
      message: alertMessage,
      buttons: [{
        text: 'Ok',
      }]
    });
    prompt.present();
  }
}

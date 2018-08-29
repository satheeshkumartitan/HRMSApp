import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { StorageProvider } from '../../providers/storage/storage';
import { MyApp } from '../../app/app.component';
import { ServiceProvider } from '../../providers/service/service';
import { UtilsProvider } from '../../providers/utils/utils';

@IonicPage()
@Component({
  selector: 'page-encashment-leave',
  templateUrl: 'encashment-leave.html',
})
export class EncashmentLeavePage {
  title: any;
  hamburger: string;
  homeIcon: string;
  public encashmentData:any;
  public applyBtnFlag:boolean = false;
  public applyEncashDays:any;

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public storage:StorageProvider,public mainService: MyApp, 
    public service: ServiceProvider, public utilService: UtilsProvider) {

      this.title = this.navParams.get("titleName");
  }

  ionViewDidLoad() {
    this.hamburger = ("./assets/homePageIcons/hamburger.svg");
    this.homeIcon = ("./assets/homePageIcons/Home.svg");
    console.log('ionViewDidLoad EncashmentLeavePage');
  }

  ionViewCanEnter() {
    this.encashmentData = this.mainService.leaveEncashData;
    this.applyBtnFlag = (this.encashmentData.EP_ELGBL == "")?true:false;
  }

  openMenu() {
    this.menu.toggle();
  }
  back(){
    this.navCtrl.pop();
  }
  home() {
    this.navCtrl.setRoot("HomePage");
  }

  applyEncashmentRequest(){

    if(this.applyEncashDays === undefined || this.applyEncashDays == ""){
      this.utilService.showCustomPopup4Error("Leave Encashment","Please enter the Days..", "FAILURE");
    }else{

      this.utilService.showLoader("Please wait..");

      var payloadData = {
        "IP_NO_DAYS": this.applyEncashDays,
      }

      console.log(payloadData);
    
    this.service.invokeAdapterCall('commonAdapterServices', 'applyEncashmentRequest', 'post', {payload : true, length:1, payloadData: payloadData}).then((resultData:any)=>{
      if(resultData){
        if(resultData.status_code == 200){
          if(resultData.data.EP_RETURN.TYPE == "E"){
            this.utilService.dismissLoader();
            this.utilService.showCustomPopup4Error("Leave Encashment", resultData.data.EP_RETURN.MESSAGE, "FAILURE");
          }else if(resultData.data.EP_RETURN.TYPE == "S"){
            const alert = this.alertCtrl.create({
              title: "",
              message: "<p class='header'>Apply FTP</p> <p>"+resultData.data.EP_RETURN.MESSAGE+"</p>",
              cssClass: "SUCCESS",
              enableBackdropDismiss: false,
            });
            alert.addButton({
              text: 'OK',
              handler: data => {
                this.navCtrl.setRoot("HomePage");
              }
            });
            this.utilService.dismissLoader();
            alert.present();
            
          }
        }else{
          this.utilService.dismissLoader();
          this.utilService.showCustomPopup4Error("Leave Encashment", resultData.message, "FAILURE");
        }
  
      };
    }, (error)=>{
      console.log("Data readed from jsonstore error",error);
      this.utilService.dismissLoader();
      this.utilService.showCustomPopup4Error("Leave Encashment", error.statusText, "FAILURE");
    });

  }

}
}

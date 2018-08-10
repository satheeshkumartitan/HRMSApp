import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { StorageProvider } from '../../providers/storage/storage';

@IonicPage()
@Component({
  selector: 'page-apply-leave',
  templateUrl: 'apply-leave.html',
})
export class ApplyLeavePage {
  homeIcon: string;
  hamburger: string;

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public storage:StorageProvider) {
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
  privilegeLeave() {
    this.navCtrl.push("AllLeavesPage", {"titleName":"PRIVILEGE LEAVE"});
  }
  sickLeave() {
    this.navCtrl.push("AllLeavesPage", {"titleName":"SICK LEAVE"});
  }
  generalLeave() {
    this.navCtrl.push("AllLeavesPage", {"titleName":"GENERAL LEAVE"});
  }
  casualLeave() {
    this.navCtrl.push("AllLeavesPage", {"titleName":"CASUAL LEAVE"});
  }
  leaveEncashment() {
    this.navCtrl.push("EncashmentLeavePage", {"titleName":"LEAVE ENCASHMENT"});
  }

  ionViewDidLoad() {
    this.hamburger = ("./assets/homePageIcons/hamburger.svg");
    this.homeIcon = ("./assets/homePageIcons/Home.svg");
    console.log('ionViewDidLoad ApplyLeavePage');
  }

  

}

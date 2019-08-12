import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { GlobalVariables } from '../../global/global_variable';
import { UtilProvider } from '../../providers/util/util';
import { Camera, CameraOptions } from '@ionic-native/camera';


@Component({
  selector: 'page-homestay-detail',
  templateUrl: 'homestay-detail.html',
})
export class HomestayDetailPage {
  private itemsCollection: AngularFirestoreCollection<any>;

  user: any = GlobalVariables.user;
  homeStay: any = GlobalVariables.homeStay;
  pictures = [];

  beforeImg = null;
  beforeSize = '0';
  afterImg = null;
  afterSize = '0';

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private util: UtilProvider,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private camera: Camera) {

    if (this.navParams.get('homestay')) {
      this.homeStay = this.navParams.get('homestay');
      this.pictures = this.homeStay['pictures'].split('|');
    }
    if (!this.navParams.get('homestay')) {
      this.homeStay['pictures'] = '';
      this.homeStay['breakfast'] = false;
      this.homeStay['wifi'] = false;
    }
  }

  ionViewDidLoad() {
    // this.itemsCollection = this.db.collection<any>('homestays');
    this.itemsCollection = this.db.collection<any>('users');
  }

  submitHomeStay() {
    let data = { homestay: this.homeStay };
    this.util.presentLoading();
    var userRef = this.itemsCollection.doc(this.user['base64']);
    userRef.update(data).then((data) => {
      userRef.get().subscribe(newdata => {
        GlobalVariables.user = newdata.data();
        this.util.stopLoading();
        this.navCtrl.pop();
      })

    }, err => { this.util.stopLoading() });
  }

  //-------------reSize---------------------
  uploadFile(event) {
    let randomName = Math.random().toString(36).substring(2) + Date.now().toString(36);
    var realData = event.split(",")[1]
    let blob = this.b64toBlob(realData, 'image/jpeg');
    const file = this.b64toBlob(realData, 'image/jpeg');
    const filePath = 'uploads/' + randomName + '.jpg';
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);
    this.util.presentLoading();
    task.then(res => {
      this.storage.ref(filePath).getDownloadURL().subscribe(data => {
        if (data) {
          this.pictures.push(data)
          this.homeStay['picture'] = data;
          this.homeStay['pictures'] += data + '|';
        }
        this.util.stopLoading();
      })
    }, err => this.util.stopLoading())
  }

  loadImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true,
      allowEdit: false
    };
    this.camera.getPicture(options).then(imageData => {
      let base64data = 'data:image/jpeg;base64,' + imageData;
      this.beforeImg = base64data;
      this.beforeSize = this.getImageSize(this.beforeImg);
      this.createThumbnail();
    }, err => {
      console.log('gallery error: ', err);
    });
  }
  createThumbnail() {
    this.generateFromImage(this.beforeImg, 400, 400, 10, data => {
      this.afterImg = data;
      this.afterSize = this.getImageSize(this.afterImg);
      this.uploadFile(data);
    });
  }
  generateFromImage(img, MAX_WIDTH: number = 500, MAX_HEIGHT: number = 500, quality: number = 5, callback) {
    var canvas: any = document.createElement("canvas");
    var image = new Image();
    image.onload = () => {
      var width = image.width;
      var height = image.height;
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, width, height);
      var dataUrl = canvas.toDataURL('image/jpeg', quality);
      callback(dataUrl)
    }
    image.src = img;
  }
  getImageSize(data_url) {
    var head = 'data:image/jpeg;base64,';
    return ((data_url.length - head.length) * 3 / 4 / (1024 * 1024)).toFixed(4);
  }
  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
  //-------------End reSize-----------------

}

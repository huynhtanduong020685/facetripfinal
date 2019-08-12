import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AppProvider } from '../../providers/app/app';
import { GlobalVariables } from '../../global/global_variable';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { UtilProvider } from '../../providers/util/util';
import { AngularFireStorage } from '@angular/fire/storage';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  private itemsCollection: AngularFirestoreCollection<any>;
  countryList: Array<any> = [];
  user: any = GlobalVariables.user;
  pictures = [];

  checkCountry: boolean;
  checkCity: boolean;
  checkLang1: boolean;
  checkLang2: boolean;
  checkLang3: boolean;
  checkLang4: boolean;

  itemsCountry: any;
  itemsLang: any;
  itemsCity: any;
  filtContry: any;
  filtCity: any;
  filtLang: any;

  beforeImg = null;
  beforeSize = '0';
  afterImg = null;
  afterSize = '0';

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alertController: AlertController,
    private appProvider: AppProvider,
    private storage: AngularFireStorage,
    private util: UtilProvider,
    private db: AngularFirestore,
    public http: HttpClient,
    private camera: Camera
  ) {
    this.loadCountryJSON();
    if (!this.user['pictures']) {
      this.user['pictures'] = '';
    } else {
      this.pictures = this.user['pictures'].split('|');
    }
  }

  ionViewDidLoad() {
    this.itemsCollection = this.db.collection<any>('users');
    this.user = this.navParams.get('user') || this.user;
  }

  onItemSelected(ev) {
    this.user['country'] = ev;
  }
  loadCountryJSON() {
    this.http
      .get('assets/country.json')
      .subscribe((data) => {
        this.itemsCountry = data;
      });
    this.http
      .get('assets/lang_list.json')
      .subscribe((data) => {
        this.itemsLang = data;
      });
    this.checkCountry = false;
    this.checkCity = false;
    this.checkLang1 = false;
    this.checkLang2 = false;
    this.checkLang3 = false;
    this.checkLang4 = false;
  }
  clickAutocomplete(data) {

    if (data.country) {
      this.user['country'] = data.country;
      this.user['city'] = data.city;
      this.filtContry = [];
      this.checkCountry = false;
    }
    if (data.city) {
      this.user['city'] = data.city;
      this.filtCity = [];
      this.checkCity = false;
    }
    if (data.language1) {
      this.user['language1'] = data.language1;
      this.filtLang = [];
      this.checkLang1 = false;
    }
    if (data.language2) {
      this.user['language2'] = data.language2;
      this.filtLang = [];
      this.checkLang2 = false;
    }
    if (data.language3) {
      this.user['language3'] = data.language3;
      this.filtLang = [];
      this.checkLang3 = false;
    }
    if (data.language4) {
      this.user['language4'] = data.language4;
      this.filtLang = [];
      this.checkLang4 = false;
    }

  }
  filter() {
    if (this.user['country'].length >= 3) {
      this.checkCountry = true
      this.filtContry = this.itemsCountry.filter(item => item.country.toLowerCase().indexOf(this.user['country'].toLowerCase()) > -1).map(i => i);
    } else {
      this.filtContry = [];
      this.checkCountry = false
    }
  }
  filterCity() {
    if (this.user['city'].length >= 2) {
      this.checkCity = true
      this.filtCity = this.itemsCountry.filter(item => (item.city || '').toLowerCase().indexOf(this.user['city'].toLowerCase()) > -1);
    } else {
      this.checkCity = false
      this.filtCity = [];
    }
  }
  filterLang() {
    if (this.user['language1'].length >= 1) {
      this.checkLang1 = true;
      this.filtLang = this.itemsLang.filter(item => item.lang_name.toLowerCase().indexOf(this.user['language1'].toLowerCase()) > -1);
    } else {
      this.checkLang1 = false;
      this.filtLang = [];
    }
  }
  filterLang2() {
    if (this.user['language2'].length >= 1) {
      this.checkLang2 = true;
      this.filtLang = this.itemsLang.filter(item => item.lang_name.toLowerCase().indexOf(this.user['language2'].toLowerCase()) > -1);
    } else {
      this.checkLang2 = false;
      this.filtLang = [];
    }
  }
  filterLang3() {
    if (this.user['language3'].length >= 1) {
      this.checkLang3 = true;
      this.filtLang = this.itemsLang.filter(item => item.lang_name.toLowerCase().indexOf(this.user['language3'].toLowerCase()) > -1);
    } else {
      this.checkLang3 = false;
      this.filtLang = [];
    }
  }
  filterLang4() {
    if (this.user['language4'].length >= 1) {
      this.checkLang4 = true;
      this.filtLang = this.itemsLang.filter(item => item.lang_name.toLowerCase().indexOf(this.user['language4'].toLowerCase()) > -1);
    } else {
      this.checkLang4 = false;
      this.filtLang = [];
    }
  }
  async presentAlertCheckbox() {
    const alert = await this.alertController.create({
      inputs: [
        {
          type: 'checkbox',
          label: 'INTERNET GAME',
          value: 'INTERNET GAME ',
        },

        {
          type: 'checkbox',
          label: 'NIGHT LIFE',
          value: 'NIGHT LIFE  ',
        },

        {
          type: 'checkbox',
          label: 'PET',
          value: 'PET '
        },

        {
          type: 'checkbox',
          label: 'MUSIC',
          value: 'MUSIC '
        },

        {
          type: 'checkbox',
          label: 'MOVIE',
          value: 'MOVIE '
        },

        {
          type: 'checkbox',
          label: 'TRIP',
          value: 'TRIP '
        },
        {
          type: 'checkbox',
          label: 'SPORTS',
          value: 'SPORTS '
        },
        {
          type: 'checkbox',
          label: 'FOOD',
          value: 'FOOD '
        },
        {
          type: 'checkbox',
          label: 'SHOPPING',
          value: 'SHOPPING '
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            this.user['interest'] = data;
          }
        }
      ]
    });

    await alert.present();
  }
  
  //-------------reSize---------------------
  uploadFile(event) {
    let randomName = Math.random().toString(36).substring(2) + Date.now().toString(36);
    var realData = event.split(",")[1]
    const file = this.b64toBlob(realData, 'image/jpeg');
    const filePath = 'users/' + randomName + '.jpg';
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);
    this.util.presentLoading();
    task.then(res => {
      this.storage.ref(filePath).getDownloadURL().subscribe(data => {
        if (data) {
          this.pictures.push(data)
          this.user['pictures'] += data + '|';
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


  save() {
    this.util.presentLoading();
    this.itemsCollection.doc(this.user['base64']).update(this.user).then(res => {
      GlobalVariables.user = this.user;
      this.util.setLocal('user', this.user);
      this.util.stopLoading();
    }, err => this.util.stopLoading())

  }
}

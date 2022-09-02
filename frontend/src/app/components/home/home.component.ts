import { Component, OnInit, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public gifs: any;
  public playing: any;
  public server: string = 'http://10.12.18.226:3000/api';
  public uploadImageForm!: FormGroup;
  public uploadedImage: any;
  public uploadedImageData: any;
  public imageLoaded: boolean = false;
  public message: string = '';
  public uploadedName: string;

  constructor(
    private fb: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private http: HttpClient,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadGifs();
    this.uploadImageForm = this.fb.group({
      image: ['']
    });
  };

  loadGifs() {
    this.http.get(this.server + '/ftp/gifs').subscribe((res: any) => {
      this.gifs = res;
    });
    this.http.get(this.server + '/ftp/playing').subscribe((res: any) => {
      if (res) this.playing = res;
    });
  }

  deleteGif(gif: any) {
    this.http.delete(this.server + '/ftp/delete', { body: { gif: gif } }).subscribe((res: any) => {
      this.ngOnInit();
    });
  };

  selectGif(gif: any) {
    this.http.post(this.server + '/ftp/play', { gif: gif }).subscribe((res: any) => {
      this.ngOnInit();
    });
  };

  imageUpload(event: any) {
    this.message = '';
    var file = event.target.files.length;
    for (let i = 0; i < file; i++) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.uploadedImage = event.target.result;
        this.changeDetector.detectChanges();
      }
      reader.readAsDataURL(event.target.files[i]);
      this.uploadedImageData = event.target.files[i];
    }
  };

  handleImageLoad() {
    this.imageLoaded = true;
  };

  onSubmit(): any {
    var image = this.uploadedImage; //get Image Base64
    var data = this.uploadedImageData;

    if (!data) return this.message = 'Please select a GIF';

    this.http.post(this.server + '/ftp', { content: image, name: data.name, size: data.size, type: data.type }).subscribe((res: any) => {
      console.log(res);
      if (res.status === 200) {
        this.ngOnInit();
        this.message = res.message;
        this.uploadedName = data.name.toLowerCase();
      }
      else if (res.status === 500) {
        this.ngOnInit();
        this.message = res.message;
        this.uploadedName = data.name.toLowerCase();
      }
      else res.message = res.status + ' ' + res.message;
    });
  };

}

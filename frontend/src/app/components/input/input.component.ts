import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
  uploadImageForm!: FormGroup;
  uploadedImage: any;
  uploadedImageData: any;
  imageLoaded: boolean = false;
  message: string = '';
  constructor(
    private fb: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.uploadImageForm = this.fb.group({
      image: ['']
    });
  }

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
  }
  handleImageLoad() {
    this.imageLoaded = true;
  }
  onSubmit() {
    var image = this.uploadedImage; //get Image Base64
    var data = this.uploadedImageData;

    this.http.post('http://localhost:3000/api/ftp', { content: image, name: data.name, size: data.size, type: data.type }).subscribe((res: any) => {
      console.log(res);
      if (res.status === 200) this.message = res.message;
      else if (res.status === 500) this.message = res.message;
      else res.message = res.status + ' ' + res.message;
    });
  }
}

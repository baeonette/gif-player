import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
  selectedFile = null;
  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
  }

  uploadFile() {
    const fd = new FormData();
    fd.append('image', this.selectedFile);
    this.http.post('http://localhost:3000/api/ftp', fd).subscribe(res => {
      console.log(res);
    });
  }
}

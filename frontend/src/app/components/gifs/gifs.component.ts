import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-gifs',
  templateUrl: './gifs.component.html',
  styleUrls: ['./gifs.component.css']
})
export class GifsComponent implements OnInit {
  public gifs: any;
  public playing: any;
  public server: string = 'http://localhost:3000/api';

  constructor(
    private fb: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.http.get(this.server + '/ftp/gifs').subscribe((res: any) => {
      this.gifs = res;
    });
    this.http.get(this.server + '/ftp/playing').subscribe((res: any) => {
      if (res) this.playing = res;
    });
  };

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

}

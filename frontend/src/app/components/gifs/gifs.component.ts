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
  }

}

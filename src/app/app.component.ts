import { Component, Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { NgStyle } from '@angular/common';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/timeout";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@Injectable()
export class AppComponent {
  private fortunes: any[];
  private randomColor: string;

  constructor(private http: Http) {
    this.fortunes = [];
    this.fortuneStore = {
      color: '',
      fortune: []
    }
  }

  private fortuneAPI = 'http://api.acme.international/fortune';
  private fortuneStore: any;

  ngOnInit() {
    //checks local storage to see if existing fortunes can be rendered
    if (localStorage.getItem('fortunes')) {
      this.fortunes = JSON.parse(localStorage.getItem('fortunes'));
    }
  }

  deleteFortune(i: number) {
    //deletes fortune at index specified 
    console.log('deleting this fortune', this.fortunes[i]);
    this.fortunes.splice(i, 1);
    this.saveFortunes(this.fortunes);
  }

  getAPI(url: string) {
    this.http.get(url)
      .timeout(10000)
      .map(res => res.json())
      .subscribe(
        (data) => {
          console.log('new fortune: ', data.fortune);
          this.storeFortunes(data.fortune);
        }, (err) => { 
          console.log(err, "request failed");
          this.storeFortunes(["Patience is a virtue."])
        }
    );
  }

  getRandomColor() {
    //generating lighter colors so text will show up better
    this.randomColor =  "hsl(" + 360 * Math.random() + ',' +
    (25 + 70 * Math.random()) + '%,' + 
    (85 + 10 * Math.random()) + '%)';
  }

  storeFortunes(fortune: any) {
    //stores in this.fortunes array
    this.getRandomColor();

    this.fortuneStore = {
      color: this.randomColor,
      fortune: fortune
    }

    if (this.fortunes.length < 4) {
      this.fortunes.push(this.fortuneStore);
    }

    this.saveFortunes(this.fortunes);
    console.log(this.fortunes);
  }

  saveFortunes(fortunes: any) {
    //saves to local storage
    localStorage.setItem('fortunes', JSON.stringify(this.fortunes));
  }

  onClick() {
    //when button is clicked, sends GET request to the API
    console.log('getting fortune...');
    this.getAPI(this.fortuneAPI);
  }
}

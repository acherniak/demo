import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }
	toast = (msg: string) => this.snackBar.open(msg, 'OK', {duration:15000, panelClass: 'pre-wrap'});
	getHttp = (url:string) => this.http.get(url);
	putHttp = (url:string, data: Object) => this.http.put(url, data);
	deleteHttp = (url:string) => this.http.delete(url);
}

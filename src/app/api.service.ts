import { Component, Inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient, private snackBar: MatSnackBar, private dialog: MatDialog) { }
	toast = (msg: string) => this.snackBar.open(msg, 'OK', {duration:15000, panelClass: 'pre-wrap'});
	getHttp = (url:string) => this.http.get(url);
	putHttp = (url:string, data: Object) => this.http.put(url, data);
	deleteHttp = (url:string) => this.http.delete(url);
	confirm = (msg: string, act: ()=>void) => this.dialog.open(ConfirmDialog, { data: msg })
		.afterClosed().subscribe((ok)=> { if (ok) act(); })
}

@Component({ selector: 'confirm',
 template: `<h1 mat-dialog-title>Are you sure?</h1><span mat-dialog-content>{{data}}</span>
 <div mat-dialog-actions><span class="spacer"></span>
	 <button mat-raised-button [mat-dialog-close]="false">Cancel</button>
	 <button mat-raised-button [mat-dialog-close]="true" color="warn">OK</button>
 </div>` })
 export class ConfirmDialog { constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
 }

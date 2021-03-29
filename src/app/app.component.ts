import { Component, OnInit, ViewChild } from '@angular/core';
import { format } from 'date-fns'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table';
import { MatSidenav } from '@angular/material/sidenav';
import { ApiService } from './api.service';

@Component ({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: ['.mat-paginator {background-color:transparent;}']
})
export class AppComponent implements OnInit{
  title = "Alex's Staff"; list = new MatTableDataSource<any>([]); displCols =['_id','name','dob','email','phone','adr','city','state'];
	curRow: any = {};
	@ViewChild(MatPaginator) paginator!: MatPaginator; @ViewChild(MatSort) sort!: MatSort;
	@ViewChild(MatSidenav) sidenav!: MatSidenav;
	constructor(public api: ApiService) {}
	ngOnInit(): void {
		this.init()
	}
	show = (rows:any[]) => {
		this.list = new MatTableDataSource(rows);
		this.list.paginator = this.paginator;
    this.list.sort = this.sort;
	}
	init = () => this.api.getHttp('staff').subscribe((res: any) =>
		this.show(res.map((el:any)=>{ let cust = el.custom;
			return { _id:el._id, name:el.name,dob:!el.dob?'':format(new Date(el.dob),'yyyy-MM-dd'),
				email:cust.email,phone:cust.phone,adr:!cust.adr? '':cust.adr+(!cust.city?'':', '+cust.city)+(!cust.state?'':' '+cust.state)}
		})))
	selRow = (row:any) => { this.curRow = row; this.sidenav.open(); }
	add = (n:number) => this.api.putHttp('add/'+n, {}).subscribe(res => this.init());
	clear = () => this.api.deleteHttp('clear').subscribe(res => this.init());
	delete = (id:number) => this.api.deleteHttp('delete/'+id).subscribe(res => {
		let list = this.list.data, n = list.findIndex(row=>row._id==id);
		if (n>=0) { list.splice(n, 1); this.show(list); this.sidenav.close(); }
	});
	viewSql = () => this.api.getHttp('/staff/db').subscribe((res:any) =>
		this.api.toast(`${res.ver}\n${res.staff})`));
}
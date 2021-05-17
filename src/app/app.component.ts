import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { format } from 'date-fns'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table';
import { MatSidenav } from '@angular/material/sidenav';
import { ApiService } from './api.service';
import { DomSanitizer, Title } from '@angular/platform-browser';

@Component ({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: ['.mat-paginator {background-color:transparent;}', '.mat-column-avatar {width:40px;}',
		'.svg { width:200px; margin:0 auto; }', 'iframe {width:100%}']
})
export class AppComponent implements OnInit{
  title = "Alex's Staff"; list = new MatTableDataSource<any>([]); cols = ['_id','name','dob','email','phone','adr','city','state'];
	displCols = ['avatar', ...this.cols]; curRow: any = {}; working: boolean = false; frameUrl: any;
	@ViewChild(MatPaginator) paginator!: MatPaginator; @ViewChild(MatSort) sort!: MatSort;
	@ViewChild(MatSidenav) sidenav!: MatSidenav;
	
	constructor(public api: ApiService, private sanitizer: DomSanitizer, private titleService: Title) {}
	ngOnInit(): void { this.init()
		this.api.getHttp('info').subscribe((res:any) => this.titleService.setTitle(res.db));
	}
	show = (rows:any[]) => { this.working = false;
		this.list = new MatTableDataSource(rows);
		this.list.paginator = this.paginator;
    this.list.sort = this.sort;
	}
	init = () => this.api.getHttp('staff').subscribe((res: any) =>
		this.show(res.map((el:any)=>{ let cust = el.custom;
			return { _id:el._id, name:el.name,dob:!el.dob?'':format(new Date(el.dob),'yyyy-MM-dd'),
				avatar: !el.avatar?undefined:this.sanitizer.bypassSecurityTrustHtml(el.avatar),
				email:cust.email,phone:cust.phone,adr:cust.adr,city:cust.city,state:cust.state}
		})))
	selRow = (row:any) => { this.curRow = row; this.sidenav.open(); }
	add = (n:number) => { this.working = true; this.api.putHttp('add/'+n, {}).subscribe((res:any) => this.init()); }
	clear = () => this.api.confirm('ALL records will be deleted!', ()=>this.api.deleteHttp('clear').subscribe((res:any) => this.init()));
	delete = () => this.api.confirm('Delete '+this.curRow.name, () => this.api.deleteHttp('delete/'+this.curRow._id)
		.subscribe(() => { let list = this.list.data, n = list.findIndex(row=>row._id==this.curRow._id);
			if (n>=0) { list.splice(n, 1); this.show(list); this.sidenav.close(); }
		})
	);
	search = () => window.open('https://www.google.com/search?q='+this.curRow.name);
	viewSql = () => this.api.getHttp('/staff/db').subscribe((res:any) =>
		this.api.toast(`${res.ver}\n${res.staff})`));
}
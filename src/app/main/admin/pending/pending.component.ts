import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { GlobalService } from '../../services/global.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatDialog, MatPaginator } from '@angular/material';
import { cardAnimation, plusAnimation } from '../animations/template.animations';
import { EventEmitterService } from 'app/main/services/event-emit.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector   : 'pending',
    templateUrl: './pending.component.html',
    styleUrls  : ['./pending.component.scss'],
    animations: [cardAnimation, plusAnimation]
})
export class PendingComponent implements OnInit
{

    displayedColumns: string[] = ['position', 'provider', 'term', 'rate', 'email', 'remove'];
    dataSource = new MatTableDataSource<any>([]);

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator

    userinfo: any;
    private _stop$: Subject<any>;


    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';


    constructor(
        private _fuseConfigService: FuseConfigService,
        public gs: GlobalService,
        public router: Router,
        private _snackBar: MatSnackBar,
        public dialog: MatDialog,
        public eventEmitterService: EventEmitterService,
        public domSanitizer: DomSanitizer
    )
    {
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: false
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        this._stop$ = new Subject();
    }

    ngOnInit() {
        this.gs.user$.pipe(filter((userinfo) => !!userinfo), takeUntil(this._stop$)).subscribe((userinfo) => {
            this.userinfo = userinfo
            console.log("userinfo: ", userinfo)
            this.init()
        })
    }

    init() {
        this.gs.getContractsByUser(this.userinfo._id, "pending").subscribe((res: any) => {
            console.log("getContractsByUser: ", res)
            this.dataSource.data = res.data
            this.dataSource.paginator = this.paginator;
        })
    }

    message(message) {
        this._snackBar.open(message, '', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
    }

    detail(_id) {
        console.log(_id)
        this.router.navigate(["/admin/pending/" + _id])
    }

    deleteContractById(_id) {
        this.gs.deleteContractById(_id).subscribe(res => {
            console.log("deleteContractById", res)
            this.init()
        })
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._stop$.next();
        this._stop$.complete();
    }
    
}

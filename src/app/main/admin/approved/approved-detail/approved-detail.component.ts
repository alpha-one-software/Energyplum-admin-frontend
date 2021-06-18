import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { GlobalService } from '../../..//services/global.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatDialog, MatPaginator } from '@angular/material';
import { EventEmitterService } from 'app/main/services/event-emit.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector   : 'approved-detail',
    templateUrl: './approved-detail.component.html',
    styleUrls  : ['./approved-detail.component.scss']
})
export class ApprovedDetailComponent implements OnInit
{

    userinfo: any;
    private _stop$: Subject<any>;
    _id: any;
    pdfContent = '';
    customer_email: any;

    @ViewChild('pdfViewer', { static: true }) pdfViewer;

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';


    constructor(
        private _fuseConfigService: FuseConfigService,
        public gs: GlobalService,
        public router: Router,
        private _snackBar: MatSnackBar,
        public dialog: MatDialog,
        public eventEmitterService: EventEmitterService,
        public domSanitizer: DomSanitizer,
        public route: ActivatedRoute
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
        this._id = this.route.snapshot.paramMap.get("id");
        
    }

    ngOnInit() {
        this.gs.user$.pipe(filter((userinfo) => !!userinfo), takeUntil(this._stop$)).subscribe((userinfo) => {
            this.userinfo = userinfo
            console.log("userinfo: ", userinfo)
            this.gs.getContractById(this._id).subscribe((res: any) => {
                console.log('getContractById: ', res)
                this.customer_email = res.data.contact.email
                this.pdfContent = res.file;
                const byteArray = new Uint8Array(atob(res.file).split('').map(char => char.charCodeAt(0)));
                var pdffile = new Blob([byteArray], { type: 'application/pdf' });
                this.pdfViewer.pdfSrc = pdffile;
                this.pdfViewer.refresh();
            })
        })
    }

    message(message) {
        this._snackBar.open(message, '', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._stop$.next();
        this._stop$.complete();
    }
    
}

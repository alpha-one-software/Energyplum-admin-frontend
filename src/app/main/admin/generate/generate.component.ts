import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { GlobalService } from '../../services/global.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatDialog } from '@angular/material';
import { cardAnimation, plusAnimation } from '../animations/template.animations';
import { GenerateModalComponent } from '../dashboard/generate-modal/generate-modal.component';
import { EventEmitterService } from 'app/main/services/event-emit.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector   : 'generate',
    templateUrl: './generate.component.html',
    styleUrls  : ['./generate.component.scss'],
    animations: [cardAnimation, plusAnimation]
})
export class GenerateComponent implements OnInit
{

    @ViewChild("content", { static: true }) content: ElementRef;
    @ViewChild('canvas', { static: true }) canvas: ElementRef;
    @ViewChild('downloadLink', { static: true }) downloadLink: ElementRef;
    userinfo: any;
    private _stop$: Subject<any>;
    snapshotSrc: any;

    total_contract: any = 0;
    total_kwh: any = 0;

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    dataSource = new MatTableDataSource<any>([]);
    displayedColumns : string[] = ["supplier_logo", "6 Month", "12 Month", "24 Month", "36 Month", "48 Month", "60 Month"];

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
        let dataTable: any = []
        this.gs.user$.pipe(filter((userinfo) => !!userinfo), takeUntil(this._stop$)).subscribe((userinfo) => {
            this.userinfo = userinfo
            console.log("userinfo: ", userinfo)
            this.gs.getCompany().subscribe((res: any) => {
                console.log("getCompany: ", res)
                
                res.files.forEach((element, i) => {
                    let TYPED_ARRAY = new Uint8Array(element.data);
                    console.log("type", TYPED_ARRAY)
                    const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
                        return data + String.fromCharCode(byte);
                    }, '');
                    let base64String = btoa(STRING_CHAR);
                    console.log(typeof this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + base64String))
                    if (this.userinfo._id == res.data[i].userid) {
                        if (localStorage.getItem("tdsp")) {
                            dataTable.push({
                                "6 Month": res.data[i].priceArray[parseInt(localStorage.getItem("tdsp"))].month_6,
                                "12 Month": res.data[i].priceArray[parseInt(localStorage.getItem("tdsp"))].month_12,
                                "24 Month": res.data[i].priceArray[parseInt(localStorage.getItem("tdsp"))].month_24,
                                "36 Month": res.data[i].priceArray[parseInt(localStorage.getItem("tdsp"))].month_36,
                                "48 Month": res.data[i].priceArray[parseInt(localStorage.getItem("tdsp"))].month_48,
                                "60 Month": res.data[i].priceArray[parseInt(localStorage.getItem("tdsp"))].month_60,
                                supplier: res.data[i].name,
                                supplier_logo: this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + base64String),
                                userid: res.data[i].userid,
                                _id: res.data[i]._id
                            })
                        } else {
                            dataTable.push({
                                "6 Month": res.data[i].priceArray[0].month_6,
                                "12 Month": res.data[i].priceArray[0].month_12,
                                "24 Month": res.data[i].priceArray[0].month_24,
                                "36 Month": res.data[i].priceArray[0].month_36,
                                "48 Month": res.data[i].priceArray[0].month_48,
                                "60 Month": res.data[i].priceArray[0].month_60,
                                supplier: res.data[i].name,
                                supplier_logo: this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + base64String),
                                userid: res.data[i].userid,
                                _id: res.data[i]._id
                            })
                        }
                    }
                });
                this.dataSource.data = dataTable
                console.log("data: ", this.dataSource.data)
            })
        })
    }


    generate() {
        
        const customerDialogRef = this.dialog.open(GenerateModalComponent, {
            width: "500px",
            data: {
                _id: this.userinfo._id
            },
            disableClose: true
        });
      
        customerDialogRef.afterClosed().subscribe((res) => {
            if (res.event == 'submit') {
                console.log("res", res)
                this.gs.customerInvite(res.email).subscribe(res => {
                    console.log("customerInvite: ", res)
                })
            }
        });
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

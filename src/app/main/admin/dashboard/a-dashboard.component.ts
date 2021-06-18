import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { GlobalService } from '../../services/global.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatDialog } from '@angular/material';
import { cardAnimation, plusAnimation } from '../animations/template.animations';
import { GenerateModalComponent } from './generate-modal/generate-modal.component';
import html2canvas from "html2canvas";
import { EventEmitterService } from 'app/main/services/event-emit.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PriceModalComponent } from './price-modal/price-modal.component';
import { DecimalPipe,formatNumber } from '@angular/common';

@Component({
    selector   : 'a-dashboard',
    templateUrl: './a-dashboard.component.html',
    styleUrls  : ['./a-dashboard.component.scss'],
    animations: [cardAnimation, plusAnimation]
})
export class ADashboardComponent implements OnInit
{

    @ViewChild("content", { static: true }) content: ElementRef;
    @ViewChild('canvas', { static: true }) canvas: ElementRef;
    @ViewChild('downloadLink', { static: true }) downloadLink: ElementRef;
    userinfo: any;
    private _stop$: Subject<any>;
    snapshotSrc: any;

    total_contract: any = 0;
    total_kwh: any = 0;
    tdsp: any = "0";
    companyList: any;

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    dataSource = new MatTableDataSource<any>([]);
    displayedColumns : string[] = ["supplier_logo", "6 Month", "12 Month", "24 Month", "36 Month", "48 Month", "60 Month", "action"];

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
        this.init()
        this.eventEmitterService.uploadEmit
        .pipe(takeUntil(this._stop$))
        .subscribe(() => {
            this.init()
        });
    }

    init() {
        let dataTable: any = []
        this.gs.user$.pipe(filter((userinfo) => !!userinfo), takeUntil(this._stop$)).subscribe((userinfo) => {
            this.userinfo = userinfo
            console.log("userinfo: ", userinfo)
            if (this.userinfo.role != "admin") {
                this.router.navigate(['/dashboard'])
            }
            this.gs.getCompany().subscribe((res: any) => {
                console.log("getCompany: ", res)

                this.companyList = res.data
                
                res.files.forEach((element, i) => {
                    let TYPED_ARRAY = new Uint8Array(element.data);
                    console.log("type", TYPED_ARRAY)
                    const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
                        return data + String.fromCharCode(byte);
                    }, '');
                    let base64String = btoa(STRING_CHAR);
                    console.log(typeof this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + base64String))
                    this.companyList[i].supplier_logo = this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + base64String)
                    dataTable.push({
                        "6 Month": this.companyList[i].priceArray[parseInt(this.tdsp)].month_6,
                        "12 Month": this.companyList[i].priceArray[parseInt(this.tdsp)].month_12,
                        "24 Month": this.companyList[i].priceArray[parseInt(this.tdsp)].month_24,
                        "36 Month": this.companyList[i].priceArray[parseInt(this.tdsp)].month_36,
                        "48 Month": this.companyList[i].priceArray[parseInt(this.tdsp)].month_48,
                        "60 Month": this.companyList[i].priceArray[parseInt(this.tdsp)].month_60,
                        supplier: this.companyList[i].name,
                        supplier_logo: this.companyList[i].supplier_logo,
                        userid: this.companyList[i].userid,
                        _id: this.companyList[i]._id
                    })
                    if (this.companyList[i].userid == this.userinfo._id) {
                        this.total_contract += this.companyList[i].count
                        this.total_kwh += this.companyList[i].kwh
                    }
                });
                this.dataSource.data = dataTable
                console.log("data: ", this.dataSource.data)
            })
        })
    }

    tdspChange(event) {
        console.log("event: ", event.value)
        localStorage.setItem("tdsp", event.value)
        this.tdsp = event.value
        let dataTable: any = []
        this.companyList.forEach((element, i) => {
            dataTable.push({
                "6 Month": element.priceArray[parseInt(this.tdsp)].month_6,
                "12 Month": element.priceArray[parseInt(this.tdsp)].month_12,
                "24 Month": element.priceArray[parseInt(this.tdsp)].month_24,
                "36 Month": element.priceArray[parseInt(this.tdsp)].month_36,
                "48 Month": element.priceArray[parseInt(this.tdsp)].month_48,
                "60 Month": element.priceArray[parseInt(this.tdsp)].month_60,
                supplier: element.name,
                supplier_logo: element.supplier_logo,
                userid: element.userid,
                _id: element._id
            })
        });
        this.dataSource.data = dataTable
    }


    // edit(event, _id, i) {
    //     console.log(event)
    //     let value = parseInt(event.target.textContent)/100
    //     console.log("value: ", value)
    //     console.log("_id:", _id)
    //     console.log("i: ", i)
    //     let key
    //     switch (i) {
    //         case "6 Month":
    //             key = "month_6"
    //             break;
    //         case "12 Month":
    //             key = "month_12"
    //             break;
    //         case "36 Month":
    //             key = "month_36"
    //             break;
    //         case "48 Month":
    //             key = "month_48"
    //             break;
    //         case "60 Month":
    //             key = "month_60"
    //             break;
    //         default:
    //             break;
    //     }
    //     this.gs.updateCompany(_id, key, value).subscribe(res => {
    //         console.log("updateComapny: ", res)
    //     })
    // }

    formatNumber100(value, flag) {
        var valueString = value.toString();
        var nTh = valueString.indexOf('\.');
        var valueLength = valueString.length;
        var res;
        if(flag){
            var _value = value * 100;
            res = _value.toFixed(valueLength - nTh - 3 > 0 && nTh > -1 ? valueLength - nTh - 3 : 0);
        }else{
            var _value = value / 100;
            res = _value.toFixed(valueLength - nTh + 1  > 0 && nTh > -1 ? valueLength - nTh + 1 : 2);
        }
        console.log("Price Edit value", value, nTh, valueLength, flag, res);

        return res;
    }

    editModal(userid, value, _id, i) {
        value = formatNumber(value, 'en-EN', '1.2-4');
        if (userid != this.userinfo._id) {
            return
        }
        //value = this.formatNumber100(value, true);
        
        const priceDialogRef = this.dialog.open(PriceModalComponent, {
            width: "500px",
            data: {
                value: value
            },
            disableClose: true
        });
      
        priceDialogRef.afterClosed().subscribe((res) => {
            if (res.event == 'submit') {
                console.log("res: ", res)
                let data = res.value //this.formatNumber100(res.value, false)
                let key
                switch (i) {
                    case "6 Month":
                        key = "month_6"
                        break;
                    case "12 Month":
                        key = "month_12"
                        break;
                    case "24 Month":
                        key = "month_24"
                        break;
                    case "36 Month":
                        key = "month_36"
                        break;
                    case "48 Month":
                        key = "month_48"
                        break;
                    case "60 Month":
                        key = "month_60"
                        break;
                    default:
                        break;
                }
                this.gs.updateCompany(_id, key, data, this.tdsp).subscribe(res => {
                    console.log("updateComapny: ", res)
                    this.init()
                })
            }
        });
    }

    deleteCompany(_id) {
        this.gs.deleteCompany(_id).subscribe(res => {
            console.log("del: ", res)
            this.init()
        })
    }

    generate() {
        // var element = document.getElementById("content");

        // // html2canvas(element, { canvas: scaledCanvas }).then((canvas) => {
        // html2canvas(element).then((canvas) => {
        //     const imgData = canvas.toDataURL("image/png");
        //     // const reader = new FileReader();
        //     // reader.onload = e => {
        //     //     this.snapshotSrc = reader.result
        //     // }
        //     // reader.readAsDataURL(imgData);
        //     const doc = new jspdf();
        //     const imageHeight = (canvas.height * 208) / canvas.width;
        //     doc.addImage(imgData, 0, 0, 208, imageHeight);
        //     doc.save("form.pdf")
        // });
        
        
        const customerDialogRef = this.dialog.open(GenerateModalComponent, {
            width: "500px",
            data: {
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

import { Component, OnInit, ViewChild } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { GlobalService } from '../services/global.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog, MatTableDataSource, MatPaginator, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { Router } from '@angular/router';

@Component({
    selector   : 'super-admin',
    templateUrl: './super-admin.component.html',
    styleUrls  : ['./super-admin.component.scss']
})
export class SuperAdminComponent implements OnInit
{
    userinfo: any;
    private _stop$: Subject<any>;

    displayedColumns: string[] = ['position', 'name', 'email', "islogo", "isbg", "url", "upload"];
    dataSource = new MatTableDataSource<any>([]);

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(
        private _fuseConfigService: FuseConfigService,
        public gs: GlobalService,
        public dialog: MatDialog,
        public router: Router,
        public _snackBar: MatSnackBar
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
            if (this.userinfo.role != "super") {
                this.router.navigate(['/dashboard'])
            } else {
                this.getUsers()
            }
        })
    }

    getUsers() {
        this.dataSource.data = []
        this.gs.getUsers().subscribe((res: any) => {
            console.log("getUsers: ", res)
            res.users.forEach(element => {
                if (element.role == "admin") {
                    this.dataSource.data.push(element)
                }
            });
            console.log("data: ", this.dataSource.data)
            this.dataSource.paginator = this.paginator
        })
    }

    uploadLogo(event, _id, islogo) {
        console.log("file", event.target.files[0])
        let file = event.target.files[0]
        if (file.name.substr(file.name.length - 3) == 'jpg' || file.name.substr(file.name.length - 3) == 'png') {
            let formData = new FormData()
            formData.append('file', file, _id + "_logo." + file.name.substr(file.name.length - 3));
            this.gs.uploadAdmin(formData).subscribe((res: any) => {
                console.log("uploadAdminLogo: ", res)
                if (res.status == "success") {
                    if (!islogo) {
                        this.gs.updateUser(_id, "islogo").subscribe(() => {
                            this.message("Uploaded successfully")
                            this.getUsers()
                        })
                    } else {
                        this.message("Uploaded successfully")
                        this.getUsers()
                    }
                }
            })
        } else {
            this.message("Please select .jpg or .png file")
            return
        }
    }

    uploadBackground(event, _id, isbg) {
        console.log("file", event.target.files[0])
        let file = event.target.files[0]
        if (file.name.substr(file.name.length - 3) == 'jpg' || file.name.substr(file.name.length - 3) == 'png') {
            let formData = new FormData()
            formData.append('file', file, _id + "_bg." + file.name.substr(file.name.length - 3));
            this.gs.uploadAdmin(formData).subscribe((res: any) => {
                console.log("uploadAdminBackground: ", res)
                if (res.status == "success") {
                    if (!isbg) {
                        this.gs.updateUser(_id, "isbg").subscribe(() => {
                            this.message("Uploaded successfully")
                            this.getUsers()
                        })
                    } else {
                        this.message("Uploaded successfully")
                        this.getUsers()
                    }
                }
            })
        } else {
            this.message("Please select .jpg or .png file")
            return
        }
    }

    removeLogo(_id) {
        console.log("ID: ", _id)
        this.gs.removeLogo(_id).subscribe((res: any) => {
            console.log("removeLogo: ", res)
            if (res.status == "success") {
                this.gs.updateUser(_id, "islogo", false).subscribe(() => {
                    this.message("Removed successfully")
                    this.getUsers()
                })
            } else {
                this.message("Removed unsuccessfully")
                this.getUsers()
            }
        })
    }

    removeBackground(_id) {
        console.log("ID: ", _id)
        this.gs.removeBackground(_id).subscribe((res: any) => {
            console.log("removeBackground: ", res)
            if (res.status == "success") {
                this.gs.updateUser(_id, "isbg", false).subscribe(() => {
                    this.message("Removed successfully")
                    this.getUsers()
                })
            } else {
                this.message("Removed unsuccessfully")
                this.getUsers()
            }
        })
    }

    removeAccount(_id) {
        console.log("ID: ", _id)
        this.gs.removeUserById(_id).subscribe(res => {
            console.log("removeUserById: ", res)
            this.getUsers()
        })
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._stop$.next();
        this._stop$.complete();
    }

    message(message) {
        this._snackBar.open(message, '', {
          duration: 3000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
    }
    
}

import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { GlobalService } from '../services/global.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { InviteModalComponent } from './invite-modal/invite-modal.component';

@Component({
    selector   : 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls  : ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit
{
    userinfo: any;
    private _stop$: Subject<any>;
    amount: any = 0;
    count: any = 0;
    t_count: any = 0;

    constructor(
        private _fuseConfigService: FuseConfigService,
        public gs: GlobalService,
        public dialog: MatDialog
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
            this.getUserInfo()
        })
    }

    getUserInfo() {
        this.gs.getUserInfo().subscribe((res: any) => {
            console.log("getUserInfo: ", res)
            this.amount = res.user.amount
            this.count = res.user.count
            this.t_count = res.user.t_count
        })
    }

    invite() {
        const inviteDialogRef = this.dialog.open(InviteModalComponent, {
            width: "500px",
            data: {
            },
            disableClose: true
        });
      
        inviteDialogRef.afterClosed().subscribe((res) => {
            if (res.event == 'submit') {
                console.log("res", res)
                this.gs.inviteTeam(res.inviteList).subscribe(res => {
                    console.log("inviteTeam: ", res)
                })
            }
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._stop$.next();
        this._stop$.complete();
    }
    
}

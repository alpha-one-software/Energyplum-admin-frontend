import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/main/services/auth.service';
import { GlobalService } from 'app/main/services/global.service';

@Component({
  selector: 'app-verfiy-email',
  templateUrl: './verfiy-email.component.html',
  styleUrls: ['./verfiy-email.component.scss']
})
export class VerfiyEmailComponent implements OnInit {

  constructor(private aroute: ActivatedRoute, private gs: GlobalService, private authService: AuthService, private router: Router) { }

  /**
     * On init
     */
  ngOnInit(): void {
    this.aroute.queryParams.subscribe(params => {
      if (params['token']) {
        this.authService.verifyEmail({ resettoken: params['token'] }).subscribe(data => {
          if (data['user']['token']) {
            localStorage.setItem('currentuser', JSON.stringify(data['user']))
            this.gs.setUserDetails(data['user'])
            if (data['user']['role'] === 'admin') {
              this.router.navigate(["/admin/dashboard"]);
            }
            else {
              this.router.navigate(["/dashboard"]);
            }
          }
        }, error => {
          this.router.navigateByUrl('/auth/login');
        })
      }
    })
  }

}

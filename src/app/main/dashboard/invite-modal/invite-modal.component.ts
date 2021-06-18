import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { GlobalService } from 'app/main/services/global.service';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: "invite-modal",
  templateUrl: "./invite-modal.component.html",
  styleUrls: ["./invite-modal.component.scss"],
})
export class InviteModalComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  inviteForm: FormGroup

  constructor(
    public gs: GlobalService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<InviteModalComponent>,
    public _formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.inviteForm = this._formBuilder.group({
      email1: ['', [Validators.required, Validators.email]],
      email2: ['', [Validators.required, Validators.email]],
      email3: ['', [Validators.required, Validators.email]],
      email4: ['', [Validators.required, Validators.email]],
      email5: ['', [Validators.required, Validators.email]]
    });
  }

  submitBtn() {
    let inviteList = [
      this.inviteForm.get('email1').value, 
      this.inviteForm.get('email2').value, 
      this.inviteForm.get('email3').value, 
      this.inviteForm.get('email4').value, 
      this.inviteForm.get('email5').value
    ]
    this.dialogRef.close({
      event: 'submit',
      inviteList
    })
  }

  closeBtn() {
    this.dialogRef.close({event: 'close'})
  }

  message(message) {
    this._snackBar.open(message, '', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}

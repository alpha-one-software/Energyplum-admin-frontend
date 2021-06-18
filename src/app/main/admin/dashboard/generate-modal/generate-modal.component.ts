import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { GlobalService } from 'app/main/services/global.service';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: "generate-modal",
  templateUrl: "./generate-modal.component.html",
  styleUrls: ["./generate-modal.component.scss"],
})
export class GenerateModalComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  // customerForm: FormGroup

  constructor(
    public gs: GlobalService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<GenerateModalComponent>,
    public _formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    // this.customerForm = this._formBuilder.group({
    //   first_name: ['', Validators.required],
    //   last_name: ['', Validators.required],
    //   email: ['', [Validators.required, Validators.email]]
    // });
  }

  submitBtn() {
    this.dialogRef.close({
      event: 'submit',
      // first_name: this.customerForm.get("first_name").value,
      // last_name: this.customerForm.get("last_name").value,
      // email: this.customerForm.get("email").value
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

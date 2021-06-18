import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { GlobalService } from 'app/main/services/global.service';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material';
@Component({
  selector: "price-modal",
  templateUrl: "./price-modal.component.html",
  styleUrls: ["./price-modal.component.scss"],
})
export class PriceModalComponent implements OnInit {

  value: any;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    public gs: GlobalService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PriceModalComponent>,
  ) {
    this.value = data.value
  }

  ngOnInit() {
  }

  submitBtn() {
    this.dialogRef.close({
      event: 'submit',
      value: this.value
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

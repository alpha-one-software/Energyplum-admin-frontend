import { Component} from '@angular/core';
import * as XLSX from 'xlsx';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { GlobalService } from 'app/main/services/global.service';
import { EventEmitterService } from 'app/main/services/event-emit.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent  {

  file: any;
  logoData: any;
  logoSrc: any;
  pdfData: any;
  jsonData: any = null;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private _snackBar: MatSnackBar,
    public gs: GlobalService,
    public eventEmitterService: EventEmitterService
    ) {}

  uploadFile(event) {
    console.log("event", event)
    if (event[0].name.substr(event[0].name.length - 4) == 'xlsx') {
      this.message(event[0].name + ' is selected')
    } else {
      this.message("Please select .xlsx file")
      return
    }
    if (event[0].type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      this.message("File type is incorrect")
      return
    }
    this.file = event[0]
    let workBook = null;
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      this.jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      console.log("jsonData", this.jsonData)
    }
    reader.readAsBinaryString(this.file);
  }

  deleteAttachment() {
    this.file = null
    this.jsonData = null
  }

  uploadLogo(event) {
    console.log("file", event.target.files[0])
    if (event.target.files[0]) {
      this.logoData = event.target.files[0]
    } else {
      return
    }
    // this.uploadData.append('file', file, file.name);
    if (this.logoData.name.substr(this.logoData.name.length - 3) == 'jpg' || this.logoData.name.substr(this.logoData.name.length - 3) == 'png') {
        this.message(this.logoData.name + ' is selected')
    } else {
        this.message("Please select .jpg or .png file")
        this.logoData = null
        return
    }
    const reader = new FileReader();
      reader.onload = e => {
        this.logoSrc = reader.result
      }
    reader.readAsDataURL(this.logoData);
    // this.logoData = new FormData();
    // this.logoData.append('file', file, this.userinfo.rut + '.' + file.name.substr(file.name.length - 3));
  }

  uploadPdf(event) {
    console.log("file", event.target.files[0])
    if (event.target.files[0]) {
      this.pdfData = event.target.files[0]
    } else {
      return
    }
    if (this.pdfData.name.substr(this.pdfData.name.length - 3) == 'pdf') {
        this.message(this.pdfData.name + ' is selected')
    } else {
        this.message("Please select .pdf file")
        this.pdfData = null
        return
    }
  }

  upload() {
    this.gs.createCompany(this.jsonData.Sheet1).subscribe((res: any) => {
      console.log("createCompany: ", res)
      let formData = new FormData();
      formData.append('file', this.logoData, res.company._id + this.logoData.name.substr(this.logoData.name.length - 4));
      this.gs.uploadLogo(formData).subscribe((result: any) => {
        console.log("uploadLogo: ", result)
        if (result.status == "success") {
          let pdf = new FormData()
          pdf.append('file', this.pdfData, res.company.name.toUpperCase() + ".pdf")
          this.gs.uploadPdf(pdf).subscribe((res: any) => {
            console.log("uploadPdf: ", res)
            this.message("uploaded successfully and pending status now")
            this.eventEmitterService.upload()
            this.file = null
            this.jsonData = null
            this.logoData = null
            this.logoSrc = null
            this.pdfData = null
          })
        }
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
}

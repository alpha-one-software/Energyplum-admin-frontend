import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { distinctUntilChanged, map, catchError } from "rxjs/operators";
import { HttpClient } from '@angular/common/http';
import { ConstantService } from './constant.service';
import { CommonHttpService } from './common-http.service';

@Injectable({
  providedIn: "root",
})
export class GlobalService extends CommonHttpService  {
  // user Info
  private userInfoSource = new BehaviorSubject(null);
  public user$ = this.userInfoSource.asObservable();

  constructor(
    private http: HttpClient,
    public cs: ConstantService
  ) {
    super()
  }

  /** Method Name : setUserDetails()
   *   Purpose  : Set user selected folder name
   * Parameters : data
   */
  setUserDetails(data) {
    if (data instanceof Object) {
      this.userInfoSource.next(data);
    } else {
      this.userInfoSource.next(null);
    }
  }

  public getUserInfo() {
    return this.http.get(this.cs.getApiUrl(this.cs.getUserInfo)).pipe(
      map((Response) => { return Response }),
      catchError(this.handleError)
    );
  }

  public inviteTeam(inviteList) {
    return this.http.post(this.cs.getApiUrl(this.cs.inviteTeam), {inviteList}).pipe(
      map((Response) => { return Response }),
      catchError(this.handleError)
    );
  }

  public customerInvite(email) {
    return this.http.post(this.cs.getApiUrl(this.cs.customerInvite), {email}).pipe(
      map((Response) => { return Response }),
      catchError(this.handleError)
    );
  }

  public createCompany(data) {
    return this.http.post(this.cs.getApiUrl(this.cs.createCompany), {data}).pipe(
      map((Response) => { return Response }),
      catchError(this.handleError)
    );
  }

  public uploadLogo(formData) {
    return this.http.post(this.cs.getApiUrl(this.cs.uploadLogo), formData).pipe(
      map((Response) => { return Response }),
      catchError(this.handleError)
    );
  }

  public removeLogo(_id) {
    return this.http.post(this.cs.removeLogo, {_id: _id, flag: 'lg'}).pipe(
      map((Response) => { return Response }),
      catchError(this.handleError)
    );
  }

  public removeBackground(_id) {
    return this.http.post(this.cs.removeBackgroud, {_id: _id, flag: 'bg'}).pipe(
      map((Response) => { return Response }),
      catchError(this.handleError)
    );
  }

  public uploadPdf(formData) {
    return this.http.post("http://54.151.113.189/api/newcontract/add-template", formData).pipe(
      map((Response) => { return Response }),
      catchError(this.handleError)
    );
  }

  public getCompany() {
    return this.http.get(this.cs.getApiUrl(this.cs.getCompany)).pipe(
      map((Response) => { return Response }),
      catchError(this.handleError)
    );
  }

  public updateCompany(_id, key, value, tdsp) {
    return this.http.post(this.cs.getApiUrl(this.cs.updateCompany), {_id, key, value, tdsp}).pipe(
      map((Response) => { return Response }),
      catchError(this.handleError)
    );
  }

  public deleteCompany(_id) {
    return this.http.post(this.cs.getApiUrl(this.cs.deleteCompany), {_id}).pipe(
      map((Response) => { return Response }),
      catchError(this.handleError)
    );
  }

  public getContractsByUser(userid, a_status) {
    return this.http.post("http://54.151.113.189/api/newcontract/get-contracts", {userid, a_status}).pipe(
      map((Response) => { return Response }),
      catchError(this.handleError)
    );
  }

  public getContractById(_id) {
    return this.http.post("http://54.151.113.189/api/newcontract/get-contract", {_id}).pipe(
      map((Response) => { return Response }),
      catchError(this.handleError)
    );
  }

  public updateContractById(_id, a_status) {
    return this.http.post("http://54.151.113.189/api/newcontract/update-contract", {_id, a_status}).pipe(
      map((Response) => { return Response }),
      catchError(this.handleError)
    );
  }

  public deleteContractById(_id) {
    return this.http.post("http://54.151.113.189/api/newcontract/delete-contract", {_id}).pipe(
      map((Response) => { return Response }),
      catchError(this.handleError)
    );
  }

  public getUsers() {
    return this.http.get(this.cs.getApiUrl(this.cs.getUsers)).pipe(
      map((Response) => { return Response }),
      catchError(this.handleError)
    );
  }

  public uploadAdmin(formData) {
    return this.http.post("http://54.151.113.189/api/upload/upload", formData).pipe(
      map((Response) => { return Response }),
      catchError(this.handleError)
    );
  }

  public updateUser(_id, key, val = true) {
    return this.http.post(this.cs.getApiUrl(this.cs.updateUser), {_id, key, val}).pipe(
      map((Response) => { return Response }),
      catchError(this.handleError)
    );
  }

  public removeUserById(_id) {
    return this.http.post(this.cs.getApiUrl(this.cs.removeUserById), {_id}).pipe(
      map((Response) => { return Response }),
      catchError(this.handleError)
    );
  }
}

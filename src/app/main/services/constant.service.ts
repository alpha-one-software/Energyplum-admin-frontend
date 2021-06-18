import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class ConstantService {
  // authencation releated end points
  public getaccesstoken = "users/login";
  public createUser = "users";
  public resetPasswordLink = "send-reset-password-link";
  public verifyPasswordLink = "verif-token";
  public resetNewPassword = "new-password";
  public verifEmail = "verif-email";
  public getUserInfo = "get-user-info";
  public inviteTeam = "invite-team";
  public customerInvite = "customer-invite";
  public createCompany = "company/create";
  public getCompany = "company/get";
  public updateCompany = "company/update";
  public deleteCompany = "company/delete";
  public uploadLogo = "company/upload-logo"
  public removeLogo = "http://54.151.113.189/api/upload/remove"  
  public removeBackgroud = "http://54.151.113.189/api/upload/remove" 
  
  public uploadPdf = "company/upload-pdf"
  public getUsers = "get-users"
  public updateUser = "update-user"
  public removeUserById = "remove-user-by-id"

  constructor() {}
  /**
   * @description get api endpoint from base url
   * @param path
   */
  public getApiUrl(path: string) {
    return environment.baseUrl + path;
  }
}

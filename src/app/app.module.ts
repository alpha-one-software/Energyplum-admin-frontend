import { NgModule, APP_INITIALIZER } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import "hammerjs";
import { MatProgressSpinnerModule } from "@angular/material";
import { FuseModule } from "@fuse/fuse.module";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from "@fuse/components";

import { fuseConfig } from "app/fuse-config";

import { AppComponent } from "app/app.component";
import { LayoutModule } from "app/layout/layout.module";
import { AppInit } from "./main/services/app.init.service";
import { AuthguradService, NonAuthgurad } from "./main/services/authgurad.service";
import { HttpInterceptorService } from "./main/services/http-interceptor.service";
import { PagesModule } from "./main/pages/pages.module";
import { DashboardComponent } from "./main/dashboard/dashboard.component";
import { DemoMaterialModule } from "./main/material-module";
import { InviteModalComponent } from './main/dashboard/invite-modal/invite-modal.component';
import { ADashboardComponent } from './main/admin/dashboard/a-dashboard.component';
import { UploadFileComponent } from './main/admin/dashboard/upload-file/upload-file.component';
import { DragDropDirective } from './main/admin/dashboard/drag-drop.directive';
import { GenerateModalComponent } from './main/admin/dashboard/generate-modal/generate-modal.component';
import { PriceModalComponent } from './main/admin/dashboard/price-modal/price-modal.component';
import { PendingComponent } from './main/admin/pending/pending.component';
import { ApprovedComponent } from './main/admin/approved/approved.component';
import { DeclinedComponent } from './main/admin/declined/declined.component';
import { PendingDetailComponent } from './main/admin/pending/pending-detail/pending-detail.component';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { DeclinedDetailComponent } from './main/admin/declined/declined-detail/declined-detail.component';
import { ApprovedDetailComponent } from './main/admin/approved/approved-detail/approved-detail.component';
import { GenerateComponent } from './main/admin/generate/generate.component';

import { ClipboardModule } from 'ngx-clipboard';
import { FormsModule } from '@angular/forms';
import { SuperAdminComponent } from './main/super-admin/super-admin.component';


const appRoutes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthguradService]
  },
  {
    path: "admin/dashboard",
    component: ADashboardComponent,
    canActivate: [AuthguradService]
  },
  {
    path: "admin/pending",
    component: PendingComponent,
    canActivate: [AuthguradService]
  },
  {
    path: "admin/pending/:id",
    component: PendingDetailComponent,
    canActivate: [AuthguradService]
  },
  {
    path: "admin/approved",
    component: ApprovedComponent,
    canActivate: [AuthguradService]
  },
  {
    path: "admin/approved/:id",
    component: ApprovedDetailComponent,
    canActivate: [AuthguradService]
  },
  {
    path: "admin/declined",
    component: DeclinedComponent,
    canActivate: [AuthguradService]
  },
  {
    path: "admin/declined/:id",
    component: DeclinedDetailComponent,
    canActivate: [AuthguradService]
  },
  {
    path: "admin/generate",
    component: GenerateComponent,
    canActivate: [AuthguradService]
  },
  {
    path: "super-admin",
    component: SuperAdminComponent,
    canActivate: [AuthguradService]
  },
  {
    path: "",
    redirectTo: "/auth/login",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "errors/error-404",
    pathMatch: "full",
  },
];
export function loadApp(initApp: AppInit) {
  return () => initApp.load();
}

@NgModule({
  declarations: [
    AppComponent, 
    DashboardComponent,
    InviteModalComponent,
    ADashboardComponent,
    UploadFileComponent,
    DragDropDirective,
    GenerateModalComponent,
    PriceModalComponent,
    PendingComponent,
    ApprovedComponent,
    DeclinedComponent,
    PendingDetailComponent,
    DeclinedDetailComponent,
    ApprovedDetailComponent,
    GenerateComponent,
    SuperAdminComponent
  ],
  entryComponents: [
    InviteModalComponent,
    GenerateModalComponent,
    PriceModalComponent
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: loadApp,
      deps: [AppInit], // before loading app set user info
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true, // http intercepters
    }
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot(),

    // Fuse modules
    FuseModule.forRoot(fuseConfig),
    FuseProgressBarModule,
    FuseSharedModule,
    FuseSidebarModule,
    FuseThemeOptionsModule,
    MatProgressSpinnerModule,

    // App modules
    LayoutModule,
    PagesModule,
    RouterModule.forRoot(appRoutes),
    DemoMaterialModule,
    PdfJsViewerModule,
    ClipboardModule,
    FormsModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

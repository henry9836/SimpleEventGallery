import {Component, Input} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {HttpClient, HttpEventType, HttpRequest} from "@angular/common/http";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {finalize, Subscription} from 'rxjs';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})

export class UploadComponent {

  @Input()
  requiredFileType:string = "image/png";

  baseApiUrl : string = "http://localhost:8001/api";

  constructor(private http: HttpClient) {}

  uploadSub: Subscription | null = null;
  uploadProgress : number | null = 0.0;

  onFileSelected(event : Event){
    console.log("clicked!");
    console.log(event);

    if (event.target == null){
      return;
    }

    const files : FileList|null = (event.target as HTMLInputElement).files;
    if (files == null){
      return;
    }

    for (let i = 0; i < files.length; i++) {
      console.log(files[i].name);
      this.uploadFile(files[i]);
    }
  }

  uploadFile(file : File){
    const formData = new FormData();
    formData.append("file", file);

    const req = new HttpRequest('POST', `${this.baseApiUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);


   /* const upload$ = this.http.post(`${(this.baseApiUrl)}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
        finalize(() => this.reset())
      );
    upload$.subscribe(event => {
      if (event.type == HttpEventType.UploadProgress) {
        if (event.total)
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
      }
    })*/
  }

  cancelUpload() {
    this.reset();
  }

  reset() {
    if (this.uploadSub)
    {
      this.uploadSub.unsubscribe();
    }
    this.uploadProgress = null;
    this.uploadSub = null;
  }

/*  @Input()
  requiredFileType:string;

  fileName = '';
  uploadProgress:number;
  uploadSub: Subscription;

  constructor(private http: HttpClient) {}

  onFileSelected(event) {
    const file:File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("thumbnail", file);

      const upload$ = this.http.post("/api/thumbnail-upload", formData, {
        reportProgress: true,
        observe: 'events'
      })
        .pipe(
          finalize(() => this.reset())
        );

      this.uploadSub = upload$.subscribe(event => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        }
      })
    }
  }

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
  }*/
}
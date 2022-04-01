import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from '../directives/dradanddrop.directive';
import * as $ from 'jquery';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css'],
})
export class UploadImageComponent implements OnInit, AfterViewInit {
  files: FileHandle[] = [];
  fileType: string = 'jpg';
  typesList: string[] = [];
  showProgress: boolean = false;
  convert_prct: string = '0%';
  time_left: number = 0;
  is_paused: boolean = false;
  is_cancelled: boolean = false;
  converted_files: FileHandle[] = [];
  convert_text: string = 'Convert now';
  is_add_more_disabled: boolean = false;

  constructor(private _sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.typesList = [
      ...this.typesList,
      'jpg',
      'png',
      'jpeg',
      'gif',
      'bmp',
      'webp',
      'ico',
      'tiff',
    ];
  }

  ngAfterViewInit(): void {}

  getDroppedImage(files): void {
    this.files = [...files];
    // if(typeof files )
    this.removeInvalidFiles();
    console.table(this.files);
  }

  getSelectedImage(evt): void {
    if (this.files.length === 0) {
      this.convert_text = 'Convert now';
    }
    for (let i = 0; i < evt.target.files.length; i++) {
      const file: File = evt.target.files[i];
      const url = URL.createObjectURL(file);
      const id = this.files.length;
      if (this.files.some((f) => f.file.name === file.name)) break;
      this.files.push({ id, file, url });
    }
    this.removeInvalidFiles();
  }

  removeInvalidFiles() {
    if (this.files.length <= 0) return;
    this.files = this.files.filter(
      (file, index) => file.file.type.split('/')[0] === 'image'
    );
  }

  sanitizeUrl(url) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  deleteFile(id: number) {
    this.files = this.files.filter((f) => f.id != id);
    if (this.files.length === 0) {
      this.convert_text = 'Convert now';
    }
  }

  triggerChooseOption() {
    $('#upload-image').click();
  }

  convertFiles() {
    if (this.files.length == 0) return;
    if (this.convert_text === 'Convert now') {
      let count = 1;
      this.showProgress = !this.showProgress;
      const totalTime = this.files.length;
      let width = Math.round(100 / totalTime);
      let time_taken = totalTime;
      let t = setInterval(() => {
        if (!this.is_paused) {
          this.convert_prct = `${width}%`;
          width += Math.round(100 / totalTime);
          this.time_left = time_taken;
          time_taken--;
          if (width >= 100 || time_taken === 0 || this.is_cancelled) {
            let timeout = setTimeout(() => {
              count--;

              if (count === 0) {
                clearTimeout(timeout);
                this.convertImages();
                clearTimeout(t);
                this.showProgress = !this.showProgress;
                this.convert_text = 'Download now';
                this.is_add_more_disabled = true;
                $('.save-as-draft').prop('disabled', true);
              }
            }, 1000);
          }
        }
      }, 1000);
    } else {
      this.files.forEach((file, index) => {
        const a = document.createElement('a');
        a.href = file.url;
        a.download = file.file.name;
        a.click();
      });
    }
  }

  convertImages() {
    this.files.forEach((file, index) => {
      let getName = file.file.name.split('.');
      getName.pop();
      const final_name = getName.join('.') + `.${this.fileType}`;
      const newFile = {
        name: final_name,
        type: `image/${this.fileType}`,
        size: file.file.size,
        lastModified: file.file.lastModified,
        webkitRelativePath: file.file.webkitRelativePath,
        ...file.file,
      };
      console.log(newFile);
      // const url = URL.createObjectURL(newFile);
      this.converted_files[index] = {
        file: newFile,
        id: file.id,
        url: file.url,
      };
    });
    [...this.files] = this.converted_files;
  }
}

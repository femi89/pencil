import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {StorageService} from "../services/storage.service";
import {ToastrService} from "ngx-toastr";
import {NgxChessBoardService} from "ngx-chess-board";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  public isChecked = false;
  @ViewChild('iFrame1') public iFrame1!: HTMLIFrameElement;
  @ViewChild('iFrame2') public iFrame2!: HTMLIFrameElement;
  constructor(
    private storageService: StorageService,
    private toastrService: ToastrService,
    private ngxChessBoardService: NgxChessBoardService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    for ( let n=1; n <= 2; ++n) {
      const iframe = <HTMLIFrameElement>document.querySelector(`#iframe${n}`);
      // const iframe = <HTMLIFrameElement>window.frames[`iframe${n}`];
      const iframeContent = iframe.contentWindow;
      console.log('old', iframe);
      if (iframeContent) {
        iframeContent.onload = (event: Event, l = n) => {
          console.log(event)
          iframeContent.postMessage({board: n}, '*');
        }
      }
    }
    window.addEventListener('message', (messageEvent) => {
      if (messageEvent.data.move) {
        this.storageService.addStorageItem('gameState', messageEvent.data);
        if(messageEvent.data.checkMate) {
          this.isChecked = true;
          this.toastrService.success(`Check mate`, 'Game Complete');
        }
        this.updateIframe(messageEvent.data, messageEvent.data.boardNumber);
      }
    });
  }
  public ngAfterViewInit(): void {}
  public updateIframe(move: any, boardNumber: number): void {
    const invertNumber = boardNumber === 1 ? 2 : 1;
    const iframe = <HTMLIFrameElement>document.querySelector(`#iframe${invertNumber}`);
    const iframeContentWindow = iframe.contentWindow;
    if (iframeContentWindow) {
      iframeContentWindow.postMessage(move, '*')
    }
  }

  public startNewGame(): void {
    this.ngxChessBoardService.reset();
    this.storageService.removeStorageItem('gameState');
    this.router.navigate(['index']);
  }
}

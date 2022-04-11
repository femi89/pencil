import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {StorageService} from "../services/storage.service";
import {NgxChessBoardView} from "ngx-chess-board";

@Component({
  selector: 'app-iframe-page',
  templateUrl: './iframe-page.component.html',
  styleUrls: ['./iframe-page.component.scss']
})
export class IframePageComponent implements OnInit, AfterViewInit {
  @ViewChild('board') public board!: NgxChessBoardView;
  public boardNumber: number = 1;
  public isDarkBoardDisabled: boolean = false;
  public isLightBoardDisabled: boolean = false;
  constructor(
    private storageService: StorageService
  ) { }
  ngOnInit(): void {

  }
  boardEventUpdate(event: any): void {
    parent.postMessage(
      {
        move: event.move,
        checkMate: event.checkmate,
        boardValue: this.board.getFEN(),
        boardNumber: this.boardNumber,
      },
      '*',
    )
  }

  ngAfterViewInit(): void {
    window.addEventListener('message', (messageEvent) => {
      console.log(messageEvent, this.board);
      if (messageEvent.data.board) {
        let data = this.storageService.getStorageItem('gameState');
        if(data) {
          this.board.setFEN(data.boardValue);
        }
        this.boardNumber = messageEvent.data.board
        if (messageEvent.data.board === 2) {
          this.board.reverse();
          this.isLightBoardDisabled = true;
          this.isDarkBoardDisabled = false;
        }
        if(messageEvent.data.board === 1){
          this.isDarkBoardDisabled = true;
          this.isLightBoardDisabled = false;
        }
      }
      if (messageEvent.data.move && messageEvent.data.boardNumber !== this.boardNumber) {
        this.board.move(messageEvent.data.move)
      }
    }, false)
  }
}

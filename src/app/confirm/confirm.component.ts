import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './confirm.component.html'
})
export class ConfirmComponent implements OnInit {
  @Input() header: string;
  @Input() message: string;
  @Input() labels: string[];
  buttons: { label: string; func: () => any }[];

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    // the caller may pass in exactly 2 labels to replace the default label, if so, use them
    if (this.labels.length === 2) {
      this.buttons = [{ label: this.labels[0], func: this.onOK }, { label: this.labels[1], func: this.onCancel }];
    } else {
      this.buttons = [
        { label: "OK", func: this.onOK },
        { label: "Cancel", func: this.onCancel }
      ];
    }
  }

  onOK() {
    this.activeModal.close();
  }

  onCancel() {
    this.activeModal.dismiss();
  }

  handleClick(btn: { label: string; func: () => any }) {
    btn.func.call(this);
  }
}

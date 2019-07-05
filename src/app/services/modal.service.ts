import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalContentComponent } from '../components/modal-content/modal-content.component';

@Injectable()
export class ModalService {
  constructor(
    public ngbModal: NgbModal
  ) { }

  showModal(header: string, message: string): Promise<any> {
    const modalRef = this.ngbModal.open(ModalContentComponent);
    modalRef.componentInstance.header = header;
    modalRef.componentInstance.message = message;

    return modalRef.result;
  }

}
import Swal from 'sweetalert2';

const matCustomClass = {
  popup: 'mat-swal-popup',
  titlr: 'mat-swal-title',
  action: 'mat-swal-action',
  confirmButton: 'mat-swal-confirm',
  cancleButton: 'mat-swal-cancle',
};

export class Alerts {
  static success(text: string) {
    Swal.fire({
      title: 'Sucess',
      text,
      icon: 'success',
      customClass: matCustomClass,
    });
  }

  static error(text: string) {
    Swal.fire({
      title: 'Error',
      text,
      icon: 'error',
      customClass: matCustomClass,
    });
  }

  static comfirm(text: string, callback: Function) {
    Swal.fire({
      title: 'Da li ste sigurni',
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Da',
      customClass: matCustomClass,
    }).then((result) => {
      if (result.isConfirmed) {
        callback();
      }
    });
  }

  static cartComfirm(text: string, callback: Function) {
    Swal.fire({
      title: 'Korpa',
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Da',
      customClass: matCustomClass,
    }).then((result) => {
      if (result.isConfirmed) {
        callback();
      }
    });
  }
}

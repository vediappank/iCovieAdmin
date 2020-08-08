// Angular
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'kt-delete-entity-dialog',
	templateUrl: './delete-entity-dialog.component.html'
})
export class DeleteEntityDialogComponent implements OnInit {
	// Public properties
	viewLoading: boolean = false;
	hasFormErrors: boolean;
	ErrorMessage: string;
	//viewTextAreabox: boolean = false;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<DeleteEntityDialogComponent>
	 * @param data: any
	 */
	constructor(
		public dialogRef: MatDialogRef<DeleteEntityDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		// if(this.data.buttonText === 'Decline')
		// {

		// }
	}

	/**
	 * Close dialog with false result
	 */
	onNoClick(): void {
		this.dialogRef.close();
	}

	/**
	 * Close dialog with true result
	 */
	onYesClick(): void {
		
		/* Server loading imitation. Remove this */
		this.viewLoading = true;
		this.hasFormErrors= false;
		if (this.data.buttonType === 'Cancel Meeting' ) {
			if (this.data.cancelDescription == '') {
				this.ErrorMessage = 'Please Enter the valid Cancel Meeting Summary';
				this.hasFormErrors= true;
				this.viewLoading = false;
				return;
			}
			setTimeout(() => {
				this.dialogRef.close(this.data); // Keep only this row
			}, 2500);
		}
		else if (this.data.buttonType === 'Completed Meeting') {
			if (this.data.cancelDescription == '') {
				this.ErrorMessage = 'Please Enter the valid Completed Meeting Summary';
				this.hasFormErrors= true;
				this.viewLoading = false;
				return;
			}
			setTimeout(() => {
				this.dialogRef.close(this.data); // Keep only this row
			}, 2500);
		}
		else {
			setTimeout(() => {
				this.dialogRef.close(true); // Keep only this row
			}, 2500);
		}

	}
	/**
 * Returns is title valid
 */
	isTitleValid(): boolean {
		if (this.data.buttonType === 'Cancel Meeting') {
			return (this.data.cancelDescription > 0);
		}
		if (this.data.buttonType === 'Completed Meeting') {
			return (this.data.cancelDescription > 0);
		}
		else
			return true;
	}

	/**
	 * Close alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	  }

}

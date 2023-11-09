import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  signupForm: FormGroup;
  forbiddenUsernames = ['Chris', 'Anna'];

  get hobbyControls() {
    return (this.signupForm.get('hobbies') as FormArray).controls;
  }

  constructor() {}

  ngOnInit() {
    this.signupForm = new FormGroup({
      userData: new FormGroup({
        username: new FormControl(null, [
          Validators.required,
          // bind to reference and make sure it is from that instance class
          this.forbiddenNames.bind(this),
        ]),
        email: new FormControl(
            null,
            [Validators.required, Validators.email],
            this.forbiddenEmails
        ),
      }),
      gender: new FormControl('male'),
      hobbies: new FormArray([]),
    });
    // Fired everytime we do a change from the form
    // this.signupForm.valueChanges.subscribe(
    //   (value) => console.log(value)
    // );
    // listen the updates from the form
    this.signupForm.statusChanges.subscribe((status) => console.log(status));
    this.signupForm.setValue({
      userData: {
        username: 'Max',
        email: 'max@test.com',
      },
      gender: 'male',
      hobbies: [],
    });
    // only to update part of the form, the rest is still the same
    this.signupForm.patchValue({
      userData: {
        username: 'Anna',
      },
    });
  }

  onSubmit() {
    console.log(this.signupForm);
    this.signupForm.reset();
  }

  onAddHobby() {
    // add a new control to the overall form as default value
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(control);
  }

  // Check the control as input
  // Return javascript like error code object with any key of string and the value is a boolean associated to this key.
  forbiddenNames(control: FormControl): { [s: string]: boolean } {
    // -1 means not found
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return { 'nameIsForbidden': true };
    }
    // it should be null, means it is valid
    return null;
  }

  //  Async data
  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        // Validate asynchronously, pending status to invalid
        if (control.value === 'test@test.com') {
          resolve({ 'emailIsForbidden': true });
        } else {
          resolve(null);
        }
      }, 1500);
    });
    return promise;
  }
}

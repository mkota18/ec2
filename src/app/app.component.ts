import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {OperationsService} from "../services/operations.service";

// import custom validator to validate that password and confirm password fields match
import { MustMatch } from "./_helpers/must-match.validator";

@Component({ selector: "app", templateUrl: "app.component.html" })
export class AppComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private _operations:OperationsService) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        ogName: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
        domainName: [false],
        domainNameInput: ["", Validators.required],
        otherDomain: ["", Validators.required],
        commands: ["", Validators.required],
        update: ["", Validators.required]
      },
      {
        validator: MustMatch("password", "confirmPassword")
      }
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    // display form values on success
    console.log(JSON.stringify(this.registerForm.value, null, 4));
    var JSONFile = this.registerForm.value;
    console.log(JSONFile.ogName);
    let data={"name":JSONFile.ogName, "domainNameInput": JSONFile.domainNameInput, "otherDomain": JSONFile.otherDomain}
    this._operations.getComments(data).subscribe(
      r=>{
        console.log(r);
        console.log(r.status);
        if(r.status==true)
        alert('Registration Successfull!');
      }
      
    );
  }

  output;
  altSub(){
    this.submitted = true;

    // stop here if form is invalid
    // if (this.registerForm.invalid) {
    //   return;
    // }

    // display form values on success
    console.log(this.registerForm.value.commands)
    this._operations.callNodeJsExecuter(this.registerForm.value.commands).subscribe(resBody=>{
      console.log(resBody['stdout'].split("\n"));
      this.output = resBody['stdout'].split("\n")
    })
  }
    newtest(){
      this.submitted = true;
      console.log(this.registerForm.value.upgrade)
      this._operations.newupdate(this.registerForm.value.upgrade).subscribe(resBody=>{
        console.log(resBody['stdout'].split("\n"));
        this.output = resBody['stdout'].split("\n")
      }
    )
  }


  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }
}
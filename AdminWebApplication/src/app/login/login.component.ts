import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { Router } from '@angular/router';

@Component({
  host: {'class':'col-xl-12'},
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;
  alertText = '';
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  loginAction() {
    this.alertText = ''
    this.authService.logInWithEmailAndPassword(this.email, this.password).subscribe(firebaseUser => {
      if (firebaseUser != null) {
        this.alertText = 'success!';
        this.router.navigate(['dashboard']);
      } else {
        this.alertText = 'Error Try Again';
      }
    })
  }

}

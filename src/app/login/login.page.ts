import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  ngOnInit() {
  }
  constructor(private router: Router, private authService: AuthService,private toastService: ToastService) {}
  //variables
  isRegister = false;
  loading = false;
  userR = "";
  mensajeError = "Lo sentimos ocurrio un problema, porfavor intenta nuevamente";
  //modelos
  usuarioRequest = {
    username: '',
    password: '',
  };

  registroRequest = {
    username: '',
    password: '',
    correo: ''
  };

  //funcion registrar usuario
  registrarUsuario() {
    this.loading = true;
    if(this.registroRequest.username == ""){
      this.toastService.mostrarToast("El usuario no puede estar en blanco")
      this.loading = false;
      return;
    }
    if(this.registroRequest.password == ""){
      this.toastService.mostrarToast("El password no puede estar en blanco")
      this.loading = false;
      return;
    }
    if(this.registroRequest.correo == ""){
      this.toastService.mostrarToast("El correo no puede estar en blanco")
      this.loading = false;
      return;
    }
    this.authService.register(this.registroRequest).subscribe(
      (response: any) => {
        this.toastService.mostrarToast(response.mensaje)
        this.isRegister = true;
        this.loading = false;
      },
      (error: any) => {
        this.toastService.mostrarToast(error.error.mensaje)
        this.loading = false;
      }
    );
  }

  //funcion de login
  iniciarSesion() {
    this.loading = true;
    if(this.usuarioRequest.username == ""){
      this.toastService.mostrarToast("El usuario no puede estar en blanco")
      this.loading = false;
      return;
    }
    if(this.usuarioRequest.password == ""){
      this.toastService.mostrarToast("El password no puede estar en blanco")
      this.loading = false;
      return;
    }
    // Llama al método login del servicio de autorización
    this.authService.login(this.usuarioRequest).subscribe(
      (response: any) => {
        if (response && response.usuario) {
          this.userR = response.usuario;
          this.loading = false;
          this.toastService.mostrarToast("Bienvenido "+this.userR)
          this.router.navigate(['/home'], { state: { usuario: this.userR} });
        } else {
          this.loading = false;
          console.log(response)
          this.toastService.mostrarToast('Credenciales incorrectas'); 
        }
      },
      (error: any) => {
        this.toastService.mostrarToast(error.error.mensaje)
        this.loading = false;
      }
    );
  }

  toggleForm() {
    this.isRegister = !this.isRegister;
    this.registroRequest = {
      username: '',
      password: '',
      correo: ''
    };
  }

}

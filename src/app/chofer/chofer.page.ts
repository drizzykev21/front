import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ChoferService } from '../chofer.service';
import { ToastService } from '../toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chofer',
  templateUrl: './chofer.page.html',
  styleUrls: ['./chofer.page.scss'],
})
export class ChoferPage{
  loading: boolean = false;
  isChofer: boolean = false;
  isUser: boolean = false;
  auto : any;
  registro: boolean = false;
  
  tieneAuto: boolean = false;

  constructor(private authService: AuthService, private choferService : ChoferService, private toastService : ToastService, private router : Router) {}

  rol : string = "";

 
  ionViewWillEnter() {
    // Coloca aquí la lógica que necesitas al cargar la página
    // Por ejemplo, verificar la autenticación del usuario
    // y establecer la variable isAuth en consecuencia

    // Ejemplo simple para simular la autenticación
    this.check_rol();
  }

  check_rol(){
    this.loading == true;
    this.rol = this.authService.getRol()
    if (this.rol == 'usuario') {
      this.loading = false;
      this.isUser = true;
      this.isChofer = false;
      return;
    } else if (this.rol == 'chofer') {
      this.loading = false;
      this.isChofer = true;
      this.isUser = false;
      this.check_status();
      return;
    }
    this.loading = false;
  }

  cambiar_rol(){
    this.loading == true;
    this.authService.cambiarRol().subscribe(
      (response: any) => {
        if (response && response.mensaje) {
          this.loading = false;
          console.log(response)
          this.toastService.mostrarToast(response.mensaje);
          this.check_rol();
          this.router.navigate(['/home']);
          return;
        } else {
          this.loading = false;
          return;
        }
      },
      (error: any) => {
        this.loading = false;
        return;
      }
    );
  }

  check_status(){
    this.loading == true;
    this.choferService.check_status().subscribe(
      (response: any) => {
        if (response) {
          this.loading = false;
          console.log(response)
          this.auto = response.auto;
          this.registro = true
          return;
        } else {
          this.registro = false
          this.loading = false;
          return;
        }
      },
      (error: any) => {
        this.loading = false;
        return;
      }
    );
    
  }
}

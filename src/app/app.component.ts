import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private authService : AuthService,private router: Router) {}
  isLoggin : boolean = false;
  usuario = this.authService.getUsuario() || "";
  rol = this.authService.getRol() || "";
  isUser = false;
  isChofer = false;

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggin = isLoggedIn;
      this.usuario = this.authService.getUsuario() || '';
      this.rol = this.authService.getRol() || '';
      this.checkRoles();
    });
  }
  
  checkRoles(){
    if(this.rol == "usuario"){
      this.isUser= true;
      this.isChofer = false;
    }
    if(this.rol == "chofer"){
      this.isUser= false;
      this.isChofer = true;
    }
  }
  irAPerfil() {
    this.router.navigate(['/perfil'], { state: { usuario: this.usuario} });
  }
  salir(){
    this.authService.logout();
    window.location.reload();
  }

}

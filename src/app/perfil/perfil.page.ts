import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  usuario: any; // Declara una variable para almacenar el usuario
  loading : boolean = false;
  constructor(private route: ActivatedRoute, private authService: AuthService, private toastService: ToastService) { }
  user = {
    username : "",
    correo : ""
  }
  rol : any;
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (window.history.state.usuario) {
        this.usuario = window.history.state.usuario;
        this.getInfo();
      }
    });
  }
  cargarDatos(){
    this.rol = this.authService.getRol()
  }
  getInfo() {
    this.loading = true;
    this.cargarDatos();
    this.authService.getUserInfo().subscribe(
      (response: any) => {
        if (response && response.username) {
          this.user.username = response.username;
          this.user.correo = response.correo;
          this.loading = false;
        } else {
          this.loading = false;
          this.toastService.mostrarToast('Error al obtener los datos');
        }
      },
      (error: any) => {
        this.toastService.mostrarToast('Error al obtener los datos del usuario');
        this.loading = false;
      }
    );
  }

}

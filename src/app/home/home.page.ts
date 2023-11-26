import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../toast.service';
import { ChoferService } from '../chofer.service';
import { ViajesService } from '../viajes.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {  
  notificacionViajeTerminado: boolean = false;
  mensajebr: string = "";
  usuario: string = "";
  autoSeleccionado: any;
  chofer : any;
  autoID: any;
  isAuth: boolean = false;
  isChofer : boolean = false;
  registro : boolean = false;
  viajando : boolean = false;
  buscandoChofer : boolean = false;
  seleccionandoViaje : boolean = false;
  esperandoChofer : boolean = false;
  viajeFinalizado : boolean = false;
  choferEnTransito: boolean = false;
  public progress = 0;
  viajeDB : any;
  viajes: any =[];
  autos : any = [];
  loading = false;
  auto : any;
  //modelos
  viaje = {
    inicio: '',
    termino: '',
  };

  autoRequest = {
    patente: '',
    capacidad: '',
    modelo: '',
    marca: ''
  };
  viaje_seleccionado : any ;
  constructor(private authService: AuthService, private router: Router, private toastService : ToastService,private choferService: ChoferService, private viajeService : ViajesService) {}
 
  ionViewWillEnter() {
    this.checkAuthentication();
    if(this.isChofer == true){
      this.check_status();
      this.get_viajes();
    }else{
      this.check_viaje();
    }
  }
  // auth services
  checkAuthentication() {
    this.loading = true;
    if (this.authService.isUserLoggedIn()) {
      this.isAuth = true;
      this.usuario = this.authService.getUsuario();
      const rol = this.authService.getRol();
      if(rol == "chofer"){
        this.isChofer = true;
        this.loading = false;
        this.check_pendiente();
      }
      this.loading = false;
    } else {
      this.isAuth = false;
      this.isChofer = false;
      this.loading = false;
    }
  }

  irALogin(){
    this.router.navigate(['/login']);
  }

  //chofer services
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

  registrarAuto() {
    this.loading = true;
    if (
      this.autoRequest &&
      this.autoRequest.patente &&
      this.autoRequest.capacidad &&
      this.autoRequest.modelo &&
      this.autoRequest.marca
    ) {
      this.auto = {
        patente: this.autoRequest.patente,
        capacidad: this.autoRequest.capacidad,
        modelo: this.autoRequest.modelo,
        marca: this.autoRequest.marca
      };
  
      this.choferService.registrar_auto(this.auto).subscribe(
        (response: any) => {
          if (response) {
            this.toastService.mostrarToast(response);
            this.registro = true;
            this.loading = false;
          }
        },
        (error: any) => {
          this.loading = false;
          console.log(error);
        }
      );
    } else {
      this.loading = false;
      this.toastService.mostrarToast('Datos incompletos para registrar el auto');
    }
  }

  //viajes services
  buscarVehiculo(){
    console.log("buscando vehiculo" + this.viaje)
    this.viajeService.obtenerAutos().subscribe(
      (response: any) => {
        if (response) {
          this.loading = false;
          console.log(response)
          this.autos = response
          this.buscandoChofer = true;
        }
      },
      (error: any) => {
        this.loading = false;
        this.buscandoChofer = false;
        console.log(error);
      }
    );
  }

  seleccionarAuto(auto: any) {
    this.autoID = auto.id;
    this.autoSeleccionado = auto;
    try{
      this.crearViaje(this.autoID, this.viaje.inicio, this.viaje.termino, this.usuario);
    }catch(error){
      console.log(error)
      this.toastService.mostrarToast("ha ocurrido un error al crear el viaje, intente nuevamente")
    }
  }

  crearViaje(id_auto : number, inicio: string, termino: string, username : string){
    const datos={
      auto_id: id_auto,
      inicio: inicio,
      destino:termino
    }
    try{
      this.viajeService.crearViaje(datos).subscribe(
        (response) => {
          this.autos =[];
          this.buscandoChofer = false;
          this.viajando = true;
          this.chofer = response.chofer;
          this.autoSeleccionado.chofer = response.chofer;
          this.autos = [];
          new Promise(f => setTimeout(f, 1000));
          this.viajando = true;
          this.toastService.mostrarToast(response.mensaje);
          this.check_viaje();
        },
        (error) => {
          console.error(error); // Maneja el error aquí
          this.toastService.mostrarToast("Error al crear el viaje");
        }
      );
    }catch(error){
      console.error(error); // Maneja el error aquí
      this.toastService.mostrarToast("error al crear el viaje!")
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  check_viaje(){
    this.viajeService.check_viaje().subscribe(
      async (response: any) => {
        if (response) {
          this.viajando = true
          this.esperandoChofer = true
          console.log(response.viaje)
          this.viajeDB = response.viaje
          if(this.viajeDB.tomando == true){
            this.loading = false;
            this.viajeFinalizado = false
            this.esperandoChofer = false
            this.choferEnTransito = true
            await this.delay(3000); // Función para esperar 10 segundos
            this.check_viaje();
            return;
          }
          if(this.viajeDB.finalizado == true && this.viajeDB.notificado == false){
            this.viajeService.notificar().subscribe(
              async (response: any) => {
                if (response) {
                  this.loading = false;
                  this.esperandoChofer = false
                  this.choferEnTransito = false
                  this.toastService.mostrarToast("viaje finalizado con exito!")
                  this.viajeFinalizado = true
                  this.check_viaje();
                }}
            );
            return
          }
          await this.delay(5000); // Función para esperar 10 segundos
          this.check_viaje();
        }
      }
    );
  }

  get_viajes(){
    this.loading = true;
    this.choferService.get_mis_viajes().subscribe(
      async (response: any) => {
        console.log(response)
        if (response && response) {
          this.loading = false;
          this.viajes = response; 
          return;
        }
        await this.delay(10000);
        this.get_viajes(); // Función para esperar 10 segundos
      },
      async (error: any) => {
        console.log(error);
        this.loading = false;
        await this.delay(10000);
        this.get_viajes(); // Función para esperar 10 segundos
      }
    );
  }

  seleccionarViaje(viaje: any){
    console.log(viaje)
    this.loading = true;
    this.choferService.tomar_viaje(viaje.id).subscribe(
      async (response: any) => {
        console.log(response)
        if (response && response) {
          this.loading = false;
          this.seleccionandoViaje = true;
          this.viaje_seleccionado = viaje
          this.mensajebr="Dirigete rumbo a "+ this.viaje_seleccionado.destino +" para encontrarte con "+this.viaje_seleccionado.usuario
          return;
        }
      },
      async (error: any) => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  check_pendiente(){
    this.loading = true;
    this.choferService.pendientes().subscribe(
      async (response: any) => {
        console.log(response)
        if (response && response) {
          this.loading = false;
          this.seleccionandoViaje = true;
          this.viaje_seleccionado = response
          this.mensajebr="Dirigete rumbo a "+ this.viaje_seleccionado.destino +" para encontrarte con "+this.viaje_seleccionado.usuario
          return;
        }
      },
      async (error: any) => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  finalizaViaje(){
    this.loading = true;
    this.choferService.finalizaViaje(this.viaje_seleccionado.id).subscribe(
      async (response: any) => {
        if (response) {
          this.loading = false;
          this.viajeFinalizado = true;
          await this.delay(10000);
          this.reinicio();
          this.get_viajes();
          return;
        }
      },
      async (error: any) => {
        console.log(error);
        this.loading = false;
      }
    );
  }
  reinicio() {
    this.viajes = []
    this.viajeFinalizado = false;
    this.seleccionandoViaje = false; 
    this.viajando = false;
  }
}

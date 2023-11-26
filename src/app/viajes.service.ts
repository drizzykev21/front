import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class ViajesService {

  constructor(private http: HttpClient, private authService : AuthService) { }
  
  private apiURL = 'http://localhost:5000';
  // Método para crear un viaje
  crearViaje(datos: any): Observable<any> {
    const authToken = this.authService.getToken();
    if (!authToken) {
      throw new Error('Token no disponible');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.post<any>(`${this.apiURL}/crear-viaje`, datos,{headers})
      .pipe(
        map((response: any) => {
          if (response) {
            return response;
          }
        })
      );
  }

  obtenerAutos(): Observable<any[]> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token no disponible');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiURL}/obtener-autos`,{headers})
      .pipe(
        map((response: any) => {
          return response.autos;
        })
      );
  }

  check_viaje(): Observable<any[]> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token no disponible');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiURL}/check-viaje`,{headers})
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  check_pendientes(): Observable<any[]> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token no disponible');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiURL}/check-viaje`,{headers})
      .pipe(
        map((response: any) => {
          return response.viaje;
        })
      );
  }

  get_viaje(id:number): Observable<any[]> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token no disponible');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiURL}/get_viaje/`+id,{headers})
      .pipe(
        map((response: any) => {
          return response.viaje;
        })
      );
  }
  
  notificar(): Observable<any[]> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token no disponible');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiURL}/cambiar_estado`,{headers});
  }
}

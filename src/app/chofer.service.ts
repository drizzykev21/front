import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChoferService {
  
  constructor(private http: HttpClient, private authService : AuthService) { }
  private authToken = this.authService.getToken();
  private apiURL = 'https://radic21.pythonanywhere.com';
  

  check_status(): Observable<any[]> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token no disponible');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiURL}/check_status`,{headers})
      .pipe(
        map((response: any) => {
          return response.auto;
        })
      );
  }

  registrar_auto(auto: any): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token no disponible');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.apiURL}/registrar_auto`, auto, { headers })
      .pipe(
        map((response: any) => {
          if (response && response.mensaje) {
            return response.mensaje;
          }
        })
      );
  }

  get_mis_viajes(): Observable<any[]> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token no disponible');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiURL}/mis-viajes`,{headers})
      .pipe(
        map((response: any) => {
          return response.viajes;
        })
      );
  }

  tomar_viaje(id: number): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token no disponible');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.apiURL}/tomar-viaje/`+ id, {},{ headers })
      .pipe(
        map((response: any) => {
          if (response && response.mensaje) {
            return response.mensaje;
          }
        })
      );
  }

  pendientes(): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token no disponible');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiURL}/check-pendientes`,{ headers })
      .pipe(
        map((response: any) => {
          if (response && response.viaje) {
            return response.viaje;
          }
        })
      );
  }

  finalizaViaje(id: number): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token no disponible');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiURL}/finaliza/`+id,{ headers })
      .pipe(
        map((response: any) => {
          if (response && response.mensaje) {
            return response.mensaje;
          }
        })
      );
  }
  
}



import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Token } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}
  private authURL = 'https://radic21.pythonanywhere.com';
  private authToken: string | undefined;
  private usuario: string = '';
  private isLoggin: boolean = false; 
  private rol: string = '';

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private setToken(token: string) {
    this.authToken = token;
  }
  getRol() {
    return this.rol;
  }

  private setRol(rol: string) {
    this.rol = rol;
  }
  getToken(): string | undefined {
    return this.authToken;
  }
  setUsuario(usuario: string) {
    this.usuario = usuario;
    this.isLoggin = true;
  }

  getUsuario() {
    return this.usuario;
  }

  isUserLoggedIn(): boolean {
    return this.isLoggin;
  }

  logout() {
    this.usuario = '';
    this.isLoggin = false;
    this.isLoggedInSubject.next(false);
  }


  cambiarRol(): Observable<any[]> {
    if (!this.authToken) {
      throw new Error('Token no disponible');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`
    });
    return this.http.get<any[]>(`${this.authURL}/cambiar_rol`,{headers})
      .pipe(
        map((response: any) => {
          this.setRol(response.rol)
          this.setToken(response.token)
          return response;
        })
      );
  }
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.authURL}/login`, credentials)
      .pipe(
        map((response: any) => {
          if (response && response.token && response.usuario) {
            this.setToken(response.token);
            this.setUsuario(response.usuario);
            this.setRol(response.rol)
            this.isLoggin = true;
            this.isLoggedInSubject.next(true);
          }
          return response;
        })
      );
  }

  register(userDetails: any): Observable<any> {
    return this.http.post<any>(`${this.authURL}/registro`, userDetails);
  }
  
  getUserInfo(): Observable<any> {
    if (!this.authToken) {
      throw new Error('Token no disponible');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`
    });
    return this.http.get<any>(`${this.authURL}/user-info`, { headers });
  }
}



# TeLLevoApp

## ¿Como se inicio el proyecto?

Ejecutaremos los siguientes comandos para crear el proyecto y agregar capacito y android:

ionic start tellevo blank --type=angular --capacitor
cd tellevo
npm install @capacitor/android
npx cap add android

## ¿Como puedo ver mis cambios en el apk?

Ejecutamos los siguientes comandos:

ionic serve -> para ver los cambios en localhost.
ionic build -> hacemos build del ionic.
npx cap copy -> copiamos los cambios del build al proyecto android.
npx cap open android -> abrimos android studio con este proyecto.

## Servicios

En nuestra aplicacion tenemos los siguientes servicios:

- auth.service -> Servicio encargado de la autenticacion de la aplicacion (login, registro, roles).
- viajes.service -> Servicio encargado de los viajes en la aplicacion.
- chofer.service -> Servicio encargado de los usos que tendran los choferes en la app.
- toast.service -> Servicio encargado de las notificaciones en la app.

## Paginas

En nuestra aplicacion tenemos las siguientes paginas:

- home -> pagina de inicio de la aplicacion, si es chofer o usuario mostrara un contenido distinto.
- login -> pagina de entrada en la app, encargada del login.
- ayuda -> pagina de ayuda, contiene preguntas frecuentes y otros.

## Componentes

- usuario.component -> Componente del usuario que permite la creacion de viajes, busqueda de autos y otros.
- chofer.component -> Componente del chofer que permite la busqueda de usuarios y manejo de autos.
- mapa.component -> Componente de mapa falso para diseño (test).

## Usuarios de prueba:

- Rol_Usuario:
    usuario: test
    password: test
- Rol_Chofer:
    usuario: chofer
    password: chofer
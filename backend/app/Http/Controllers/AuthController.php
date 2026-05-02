<?php
// Mario Miranda
// Archivo: AuthController.php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Controlador de autenticación.
 *
 * Gestiona el registro, inicio de sesión y cierre de sesión
 * de los usuarios mediante tokens Sanctum.
 */
class AuthController extends Controller
{
    /**
     * Registra un nuevo usuario en el sistema.
     *
     * Valida los datos recibidos, crea el usuario en la base de datos,
     * genera un token de autenticación y lo devuelve en la respuesta.
     *
     * @param  \Illuminate\Http\Request  $request  Datos del formulario de registro
     * @return \Illuminate\Http\JsonResponse        Token de acceso y código 201
     */
    public function register(Request $request) {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => bcrypt($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json(['token' => $token], 201);
    }

    /**
     * Inicia sesión con las credenciales del usuario.
     *
     * Verifica email y contraseña. Si son correctos, genera y devuelve
     * un token de autenticación junto con los datos del usuario.
     *
     * @param  \Illuminate\Http\Request  $request  Email y contraseña
     * @return \Illuminate\Http\JsonResponse        Token y datos del usuario, o error 401
     */
    public function login(Request $request) {
        if (!Auth::attempt($request->only('email', 'password'))) { // Verificamos credenciales de usuario en BD
            return response()->json(['mensaje' => 'Credenciales incorrectas'], 401);
        }

        $user  = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json(['token' => $token, 'user' => $user]);
    }

    /**
     * Cierra la sesión del usuario autenticado.
     *
     * Elimina el token de acceso actual del usuario,
     * invalidando la sesión en curso.
     *
     * @param  \Illuminate\Http\Request  $request  Petición con el usuario autenticado
     * @return \Illuminate\Http\JsonResponse        Mensaje de confirmación
     */
    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['mensaje' => 'Sesión cerrada']);
    }
}
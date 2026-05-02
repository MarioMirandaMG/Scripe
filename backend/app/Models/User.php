<?php
// Autor: Mario Miranda
// Archivo: User.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Modelo que representa la tabla users en la base de datos.
 *
 * Gestiona los usuarios registrados en la tienda Scripe.
 * Extiende Authenticatable para permitir autenticación con Sanctum.
 */
class User extends Authenticatable
{
    /**
     * HasApiTokens  → permite generar tokens Sanctum
     * HasFactory    → permite crear usuarios de prueba con factories
     * Notifiable    → permite enviar notificaciones al usuario
     */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Campos permitidos para asignación masiva (mass assignment).
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * Campos ocultos en la serialización JSON.
     *
     * Evita que la contraseña y el token de sesión
     * se devuelvan en las respuestas de la API.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Conversión automática de tipos (casting) sobre los atributos.
     *
     * - email_verified_at → se convierte a objeto Carbon (fecha)
     * - password          → se hashea automáticamente al asignarse
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    /**
     * Relación 1:N con el modelo Direccion.
     *
     * Un usuario puede tener varias direcciones de envío asociadas.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function direcciones(){
        return $this->hasMany(Direccion::class);
    }

    /**
     * Relación 1:N con el modelo Pedido.
     *
     * Un usuario puede realizar varios pedidos a lo largo del tiempo.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function pedidos(){
        return $this->hasMany(Pedido::class);
    }
}
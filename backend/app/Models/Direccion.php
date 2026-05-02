<?php
// Autor: Mario Miranda
// Archivo: Direccion.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo que representa la tabla direcciones en la base de datos.
 *
 * Gestiona las direcciones de envío asociadas a cada usuario
 * registrado en la tienda Scripe.
 */
class Direccion extends Model
{
    /**
     * Nombre exacto de la tabla en la base de datos.
     *
     * Se especifica manualmente porque Laravel pluralizaría
     * incorrectamente "Direccion" en inglés.
     *
     * @var string
     */
    protected $table = 'direcciones';

    /**
     * Campos permitidos para asignación masiva (mass assignment).
     *
     * @var array<string>
     */
    protected $fillable = [
        'usuario_id',
        'direccion',
        'ciudad',
        'codigo_postal',
        'es_principal'
    ];

    /**
     * Relación N:1 con el modelo User.
     *
     * Cada dirección pertenece a un único usuario.
     * Se indica explícitamente la clave foránea 'usuario_id'.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function usuario() {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}